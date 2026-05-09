export type MarketStatus = "trading" | "locked" | "settled" | "cancelled";

export type Game = "magic-chess" | "cyber-snake-duel" | "blockwords" | "magic-chess-tournament";

export interface Player {
  pubkey: string;
  handle: string;
  rating?: number;
  avatarHue?: number;
}

export interface Market {
  id: string;
  game: Game;
  gameLabel: string;
  title: string;
  subtitle: string;
  players: Player[];
  poolByPlayer: number[];
  totalPool: number;
  backerCount: number;
  status: MarketStatus;
  startsInSec: number;
  feeBps: number;
  organizer?: string;
  liveAssessment?: {
    leadingPlayerIndex: number;
    confidence: number;
    rationale: string;
  };
  sparkline: number[];
  winningPlayerIndex?: number;
}

export interface ActivityEvent {
  id: string;
  type: "back" | "settle" | "claim" | "create" | "lock";
  marketId: string;
  marketTitle: string;
  actor: string;
  player?: string;
  amount?: number;
  ts: number;
}

export interface BackerRank {
  rank: number;
  wallet: string;
  handle: string;
  contestsEntered: number;
  contestsCorrect: number;
  totalBacked: number;
  totalWon: number;
  pnlPct: number;
  streak: number;
}

export const MARKETS: Market[] = [
  {
    id: "mc-weekly-14",
    game: "magic-chess",
    gameLabel: "Magic Chess",
    title: "Sindarov.sol vs Gukesh.sol",
    subtitle: "Magic Chess Weekly #14 — Round of 8",
    players: [
      { pubkey: "Sind...K91v", handle: "sindarov.sol", rating: 2746, avatarHue: 200 },
      { pubkey: "Guke...P82r", handle: "gukesh.sol", rating: 2733, avatarHue: 320 },
    ],
    poolByPlayer: [3240, 1890],
    totalPool: 5130,
    backerCount: 184,
    status: "trading",
    startsInSec: 6420,
    feeBps: 500,
    liveAssessment: {
      leadingPlayerIndex: 0,
      confidence: 0.63,
      rationale: "Sindarov holds a slight central tempo advantage.",
    },
    sparkline: [0.55, 0.57, 0.54, 0.58, 0.61, 0.59, 0.62, 0.63, 0.61, 0.65, 0.63, 0.66, 0.63],
  },
  {
    id: "csd-32",
    game: "cyber-snake-duel",
    gameLabel: "Cyber Snake Duel",
    title: "sf3000 vs sf2400",
    subtitle: "Stockfish-rated bot duel · best-of-3",
    players: [
      { pubkey: "sf30...9001", handle: "sf3000.bot", rating: 3000, avatarHue: 140 },
      { pubkey: "sf24...4400", handle: "sf2400.bot", rating: 2400, avatarHue: 30 },
    ],
    poolByPlayer: [1820, 690],
    totalPool: 2510,
    backerCount: 71,
    status: "locked",
    startsInSec: -45,
    feeBps: 500,
    liveAssessment: {
      leadingPlayerIndex: 0,
      confidence: 0.81,
      rationale: "sf3000 length advantage 14 vs 9 cells.",
    },
    sparkline: [0.71, 0.69, 0.74, 0.73, 0.75, 0.78, 0.77, 0.79, 0.82, 0.80, 0.81, 0.83, 0.81],
  },
  {
    id: "bw-friday",
    game: "blockwords",
    gameLabel: "Blockwords",
    title: "Friday Showdown — 4-player",
    subtitle: "Open enrollment · seasonal points eligible",
    players: [
      { pubkey: "alic...K8nx", handle: "alice.sol", rating: 1840, avatarHue: 50 },
      { pubkey: "bob_...h2qm", handle: "bob.sol", rating: 1790, avatarHue: 270 },
      { pubkey: "cyrl...7d22", handle: "cyril.sol", rating: 1720, avatarHue: 110 },
      { pubkey: "dare...vK1f", handle: "darene.sol", rating: 1680, avatarHue: 350 },
    ],
    poolByPlayer: [1240, 990, 410, 280],
    totalPool: 2920,
    backerCount: 96,
    status: "trading",
    startsInSec: 14820,
    feeBps: 500,
    sparkline: [0.42, 0.44, 0.41, 0.45, 0.43, 0.47, 0.45, 0.46, 0.43, 0.45, 0.42, 0.44, 0.42],
  },
  {
    id: "mc-tournament-q1",
    game: "magic-chess-tournament",
    gameLabel: "Magic Chess",
    title: "Spring Invitational — 8 players",
    subtitle: "Bracket prediction required to back · 36-hour window",
    players: [
      { pubkey: "Sind...K91v", handle: "sindarov.sol", rating: 2746, avatarHue: 200 },
      { pubkey: "Guke...P82r", handle: "gukesh.sol", rating: 2733, avatarHue: 320 },
      { pubkey: "Hika...N3m4", handle: "hikaru.sol", rating: 2802, avatarHue: 0 },
      { pubkey: "Andr...e1Pq", handle: "esipenko.sol", rating: 2691, avatarHue: 180 },
      { pubkey: "Anis...Gri7", handle: "girialike.sol", rating: 2702, avatarHue: 60 },
      { pubkey: "Praz...P41x", handle: "pragg.sol", rating: 2754, avatarHue: 240 },
      { pubkey: "Levo...eTy7", handle: "aronian.sol", rating: 2725, avatarHue: 90 },
      { pubkey: "Ding...L1ren", handle: "ding.sol", rating: 2780, avatarHue: 290 },
    ],
    poolByPlayer: [3120, 2840, 6210, 540, 410, 4280, 1740, 2460],
    totalPool: 21600,
    backerCount: 412,
    status: "trading",
    startsInSec: 86400 + 3600 * 6,
    feeBps: 500,
    organizer: "spring-invit.sol",
    sparkline: [0.32, 0.31, 0.30, 0.29, 0.28, 0.27, 0.27, 0.28, 0.27, 0.28, 0.29, 0.28, 0.29],
  },
  {
    id: "mc-weekly-13",
    game: "magic-chess",
    gameLabel: "Magic Chess",
    title: "esipenko.sol won vs giri.sol",
    subtitle: "Magic Chess Weekly #13 — Round of 8 · settled",
    players: [
      { pubkey: "Andr...e1Pq", handle: "esipenko.sol", rating: 2691, avatarHue: 180 },
      { pubkey: "Anis...Gri7", handle: "girialike.sol", rating: 2702, avatarHue: 60 },
    ],
    poolByPlayer: [820, 1410],
    totalPool: 2230,
    backerCount: 67,
    status: "settled",
    startsInSec: -7200,
    feeBps: 500,
    winningPlayerIndex: 0,
    sparkline: [0.36, 0.39, 0.41, 0.38, 0.43, 0.45, 0.48, 0.51, 0.55, 0.61, 0.69, 0.78, 0.92],
  },
  {
    id: "csd-31",
    game: "cyber-snake-duel",
    gameLabel: "Cyber Snake Duel",
    title: "sf2400 won vs sf1800",
    subtitle: "Bot duel · settled · payouts open",
    players: [
      { pubkey: "sf24...4400", handle: "sf2400.bot", rating: 2400, avatarHue: 30 },
      { pubkey: "sf18...1800", handle: "sf1800.bot", rating: 1800, avatarHue: 290 },
    ],
    poolByPlayer: [1140, 320],
    totalPool: 1460,
    backerCount: 38,
    status: "settled",
    startsInSec: -14400,
    feeBps: 500,
    winningPlayerIndex: 0,
    sparkline: [0.78, 0.82, 0.79, 0.85, 0.88, 0.86, 0.91, 0.93, 0.95, 0.96, 0.98, 0.99, 1.0],
  },
];

export const STATS = {
  tvlUsd: 48290,
  volume24hUsd: 12480,
  activeMarkets: 4,
  totalSettled: 142,
  totalBackers: 1820,
  totalWonUsd: 318420,
};

const HANDLES = [
  "alice.sol", "vault42.sol", "deepblue.sol", "knightmare.sol", "neon.sol", "phantom.sol",
  "kowloon.sol", "stratos.sol", "decimal.sol", "morpheus.sol", "chainwise.sol", "kira.sol",
  "0xprism.sol", "hyperion.sol", "lattice.sol", "0xmelon.sol", "mavbase.sol", "delta.sol",
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateActivityEvent(seed: number): ActivityEvent {
  const m = MARKETS[seed % MARKETS.length];
  const r = (seed * 9301 + 49297) % 233280 / 233280;
  const types: ActivityEvent["type"][] = ["back", "back", "back", "back", "settle", "claim", "create"];
  const type = types[Math.floor(r * types.length)];
  const player = m.players[Math.floor(r * m.players.length)];
  const amount = type === "back" ? Math.floor(5 + r * 195)
    : type === "claim" ? Math.floor(10 + r * 390)
    : 0;
  return {
    id: `${seed}-${m.id}`,
    type,
    marketId: m.id,
    marketTitle: m.title,
    actor: pick(HANDLES),
    player: player.handle,
    amount,
    ts: Date.now() - Math.floor(r * 60000),
  };
}

export function getInitialActivity(count = 18): ActivityEvent[] {
  return Array.from({ length: count }, (_, i) => generateActivityEvent(i * 13 + 7));
}

export const BACKERS: BackerRank[] = [
  { rank: 1, wallet: "0xpr…ism7", handle: "0xprism.sol", contestsEntered: 142, contestsCorrect: 89, totalBacked: 18420, totalWon: 31920, pnlPct: 73.3, streak: 8 },
  { rank: 2, wallet: "deep…blue", handle: "deepblue.sol", contestsEntered: 98, contestsCorrect: 60, totalBacked: 12080, totalWon: 19840, pnlPct: 64.2, streak: 4 },
  { rank: 3, wallet: "neo…n22", handle: "neon.sol", contestsEntered: 117, contestsCorrect: 70, totalBacked: 9320, totalWon: 14210, pnlPct: 52.5, streak: -2 },
  { rank: 4, wallet: "vau…lt42", handle: "vault42.sol", contestsEntered: 73, contestsCorrect: 41, totalBacked: 8120, totalWon: 11900, pnlPct: 46.5, streak: 3 },
  { rank: 5, wallet: "kni…tmre", handle: "knightmare.sol", contestsEntered: 65, contestsCorrect: 38, totalBacked: 5720, totalWon: 8210, pnlPct: 43.5, streak: 6 },
  { rank: 6, wallet: "lat…tice", handle: "lattice.sol", contestsEntered: 49, contestsCorrect: 27, totalBacked: 4290, totalWon: 5980, pnlPct: 39.4, streak: -1 },
  { rank: 7, wallet: "phan…tom", handle: "phantom.sol", contestsEntered: 56, contestsCorrect: 30, totalBacked: 3940, totalWon: 5320, pnlPct: 35.0, streak: 0 },
  { rank: 8, wallet: "morp…heus", handle: "morpheus.sol", contestsEntered: 41, contestsCorrect: 22, totalBacked: 3140, totalWon: 4180, pnlPct: 33.1, streak: 2 },
  { rank: 9, wallet: "chai…nwise", handle: "chainwise.sol", contestsEntered: 38, contestsCorrect: 20, totalBacked: 2820, totalWon: 3620, pnlPct: 28.4, streak: 1 },
  { rank: 10, wallet: "kira…02", handle: "kira.sol", contestsEntered: 29, contestsCorrect: 15, totalBacked: 2010, totalWon: 2480, pnlPct: 23.4, streak: 0 },
];

export const PORTFOLIO_POSITIONS = [
  { marketId: "mc-weekly-14", playerHandle: "sindarov.sol", amount: 50, sharePct: 1.54, est: 79, status: "open" as const },
  { marketId: "mc-tournament-q1", playerHandle: "hikaru.sol", amount: 120, sharePct: 1.93, est: 196, status: "open" as const },
  { marketId: "csd-32", playerHandle: "sf3000.bot", amount: 25, sharePct: 1.37, est: 33, status: "open" as const, locked: true },
  { marketId: "mc-weekly-13", playerHandle: "esipenko.sol", amount: 40, sharePct: 4.87, est: 95, status: "won" as const },
  { marketId: "csd-31", playerHandle: "sf2400.bot", amount: 30, sharePct: 2.63, est: 36, status: "won" as const },
];

export function fmtUsd(n: number, dec = 0): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(dec === 0 ? 1 : dec)}k`;
  return `$${n.toFixed(dec)}`;
}

export function fmtNum(n: number, dec = 0): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toFixed(dec);
}

export function fmtPct(p: number, dec = 1): string {
  return `${(p * 100).toFixed(dec)}%`;
}

export function fmtCountdown(secs: number): string {
  if (secs < 0) return "in progress";
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  if (secs < 86400) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  return `${d}d ${h}h`;
}

export function shortAddr(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function getMarket(id: string): Market | undefined {
  return MARKETS.find(m => m.id === id);
}
