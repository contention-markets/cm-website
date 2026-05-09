// Contention Markets API client — calls the resolver, adapts to the
// frontend's Market type. The resolver is a separately-operated Cloud Run
// service that reads CM v2.1 MarketState accounts via Helius. Helius API
// key stays server-side; browser never sees it. Override the URL via
// NEXT_PUBLIC_RESOLVER_URL to point at a different operator's resolver.

import type { Market, MarketStatus, Player } from "./mockData";

const RESOLVER =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_RESOLVER_URL) ||
  "https://resolver.gamerplex.com";

// Server DTO shape (matches the resolver's /cm/markets schema)
type CmMarketDto = {
  pda: string;
  authority: string;
  mint: string;
  p1: string;
  p2: string;
  eventId: string;
  p1Deposit: string;
  p2Deposit: string;
  resolved: boolean;
  settled: boolean;
  winningOutcome: number | null;
  createdAt: number;
  expiresAt: number;
  referrer: string;
  backerPoolP1: string;
  backerPoolP2: string;
  totalBackerPool: string;
  status: "trading" | "resolved" | "expired";
};

export type CmStatsDto = {
  ok: boolean;
  totalMarkets: number;
  trading: number;
  resolved: number;
  totalBackerVolume: string;
  totalWagerVolume: string;
  uniqueContestants: number;
  uniqueAuthorities: number;
  cachedAt: number;
};

// Known Stockfish bot wallets used as house contestants on devnet. If the
// wallet isn't here, we fall back to truncated base58. SNS reverse-lookup
// could be added later but adds N RPC round-trips so deferred.
const KNOWN_AGENTS: Record<string, { name: string; rating?: number }> = {
  Hzqo8q82PAFGuQy7dgZNkBZV1miZspMJP5dDg42uWjYr: { name: "sf1200", rating: 1200 },
  "5HTLBznoxZYaPLd8UDR6cqUX6MMnTESAdxDJ8h1q66me": { name: "sf1500", rating: 1500 },
  Ad5NJZNT8b3Bhw2vy9NicsQ1Ge4zmbQsTanwUbFcFaxc: { name: "sf1800", rating: 1800 },
  "6J9Pyf2EF4vCwJdBWEyFJ9R2vNmcLGLXEgqHkUvf88eT": { name: "sf2100", rating: 2100 },
  JBfgLFNjs4Jwh3oUt4GRgCxjeuyx2YsdNDHT1dHCtovt: { name: "sf2400", rating: 2400 },
  FZyXnUd6ACUAh6bwrnJ95aWt6LVVesF4mCZ2E6c5A2w5: { name: "sf3000", rating: 3000 },
};

// Stable hue from a base58 pubkey. Same input → same color across renders.
function hueFromPubkey(pubkey: string): number {
  let h = 0;
  for (let i = 0; i < pubkey.length; i++) {
    h = (h * 31 + pubkey.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function shortAddr(addr: string): string {
  if (!addr || addr.length <= 8) return addr || "?";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function playerFromPubkey(pubkey: string): Player {
  const known = KNOWN_AGENTS[pubkey];
  return {
    pubkey: shortAddr(pubkey),
    handle: known ? `${known.name}.bot` : `${shortAddr(pubkey)}`,
    rating: known?.rating,
    avatarHue: hueFromPubkey(pubkey),
  };
}

function adaptStatus(dto: CmMarketDto): MarketStatus {
  // CM v2.1 doesn't have a "locked" or "cancelled" concept the way our UI
  // does. Map: resolved/settled → settled, expired → cancelled, trading → trading.
  if (dto.status === "resolved") return "settled";
  if (dto.status === "expired") return "cancelled";
  return "trading";
}

// Synthetic sparkline derived from event_id + outcome. Real-time backing
// history would require querying BackerStake change events — defer.
function synthSparkline(dto: CmMarketDto): number[] {
  const seed = parseInt(dto.eventId.slice(-6), 10) || 0;
  const N = 13;
  const trendTarget =
    dto.winningOutcome === 0 ? 0.75 : dto.winningOutcome === 1 ? 0.25 : 0.5;
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const noise = ((seed * (i + 1)) % 100) / 1000 - 0.05;
    const v = 0.5 + (trendTarget - 0.5) * t + noise;
    out.push(Math.max(0.05, Math.min(0.95, v)));
  }
  return out;
}

// Adapt the resolver DTO → the Market type the frontend already renders.
export function dtoToMarket(dto: CmMarketDto): Market {
  const p1 = playerFromPubkey(dto.p1);
  const p2 = playerFromPubkey(dto.p2);

  // CM v2.1 markets are 2-player. Use backer pools as the "pool" for the
  // backer surface (this is contention.markets — we surface the backer
  // side, not the wager side).
  const poolP1 = Number(BigInt(dto.backerPoolP1) / BigInt(1_000)) / 1_000; // micro-USDC → USDC
  const poolP2 = Number(BigInt(dto.backerPoolP2) / BigInt(1_000)) / 1_000;
  const totalPool = poolP1 + poolP2;

  // Time-to-event. CM v2.1 expires_at is a hard cutoff for trading; if we're
  // past it but unresolved, mark cancelled.
  const nowSec = Math.floor(Date.now() / 1000);
  const startsInSec = dto.expiresAt > 0 ? dto.expiresAt - nowSec : -1;

  const winningPlayerIndex =
    dto.winningOutcome === 0 ? 0 : dto.winningOutcome === 1 ? 1 : undefined;

  return {
    id: dto.pda,
    game: "magic-chess", // Until on-chain registry tells us per-market, default
    gameLabel: p1.rating && p2.rating ? "Magic Chess (devnet)" : "CM v2.1 Market",
    title: `${p1.handle.replace(".bot", "")} vs ${p2.handle.replace(".bot", "")}`,
    subtitle: `Event ${dto.eventId.slice(-8)} · ${dto.pda.slice(0, 6)}…`,
    players: [p1, p2],
    poolByPlayer: [poolP1, poolP2],
    totalPool,
    backerCount: 0, // Not tracked in MarketState; need BackerStake scan
    status: adaptStatus(dto),
    startsInSec,
    feeBps: 500,
    sparkline: synthSparkline(dto),
    winningPlayerIndex,
  };
}

// ───── public API ─────

export type CmFetchOpts = {
  status?: "trading" | "resolved" | "expired" | "all";
  limit?: number;
};

export async function fetchCmMarkets(opts: CmFetchOpts = {}): Promise<Market[]> {
  const params = new URLSearchParams();
  if (opts.status) params.set("status", opts.status);
  if (opts.limit) params.set("limit", String(opts.limit));
  const url = `${RESOLVER}/cm/markets${params.toString() ? "?" + params.toString() : ""}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "fetch failed");
  return (data.markets as CmMarketDto[]).map(dtoToMarket);
}

export async function fetchCmMarket(pda: string): Promise<Market | null> {
  const r = await fetch(`${RESOLVER}/cm/markets/${encodeURIComponent(pda)}`, {
    cache: "no-store",
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  if (!data.ok) return null;
  return dtoToMarket(data.market);
}

export async function fetchCmStats(): Promise<CmStatsDto> {
  const r = await fetch(`${RESOLVER}/cm/stats`, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as CmStatsDto;
}
