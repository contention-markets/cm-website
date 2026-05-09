"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Market } from "@/lib/mockData";
import { fmtUsd, fmtCountdown } from "@/lib/mockData";
import { fetchCmMarket } from "@/lib/cmApi";
import StatusPill from "@/components/StatusPill";
import PoolDepthBar from "@/components/PoolDepthBar";
import SkillAssessment from "@/components/SkillAssessment";
import Sparkline from "@/components/Sparkline";
import ActivityFeed from "@/components/ActivityFeed";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [market, setMarket] = useState<Market | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchCmMarket(id)
      .then((m) => { if (!cancelled) setMarket(m); })
      .catch(() => { if (!cancelled) setMarket(null); });
    return () => { cancelled = true; };
  }, [id]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [amount, setAmount] = useState("25");
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (market) setCountdown(market.startsInSec);
  }, [market]);

  useEffect(() => {
    if (!market) return;
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [market]);

  // Loading / not-found UI
  if (market === undefined) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16 text-white/55 text-sm">
        Loading market from on-chain…
      </div>
    );
  }
  if (market === null) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
        <Link href="/markets" className="inline-flex items-center gap-1.5 text-[12px] font-mono text-white/45 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> all markets
        </Link>
        <div className="text-white/55 text-sm">Market not found on-chain.</div>
      </div>
    );
  }

  const total = market.totalPool;
  const selectedPool = market.poolByPlayer[selectedIdx];
  const sharePct = total > 0 ? (selectedPool / total) * 100 : 0;
  const amountNum = parseFloat(amount) || 0;
  const myShareOfWinningPool = selectedPool + amountNum > 0
    ? amountNum / (selectedPool + amountNum)
    : 0;
  const distributable = total + amountNum - (total + amountNum) * (market.feeBps / 10000);
  const estPayout = myShareOfWinningPool * distributable;
  const profit = estPayout - amountNum;
  const roi = amountNum > 0 ? (profit / amountNum) * 100 : 0;

  const tradingOpen = market.status === "trading";

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-6 pb-16">
      {/* breadcrumb */}
      <Link href="/markets" className="inline-flex items-center gap-1.5 text-[12px] font-mono text-white/45 hover:text-white mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> all markets
      </Link>

      {/* header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/45">
            {market.gameLabel}
          </span>
          <StatusPill status={market.status} />
          {market.organizer && (
            <span className="text-[10px] font-mono text-white/30">
              organized by {market.organizer}
            </span>
          )}
        </div>
        <h1 className="text-[32px] md:text-[40px] font-semibold leading-tight mb-2">{market.title}</h1>
        <p className="text-white/50 text-[14px]">{market.subtitle}</p>
      </div>

      {/* top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.05] border border-white/[0.07] rounded-xl overflow-hidden mb-8">
        <Stat label="Prize Pool" value={fmtUsd(total)} accent />
        <Stat label="Backers" value={market.backerCount.toString()} />
        <Stat label="Contestants" value={market.players.length.toString()} />
        <Stat label="Protocol Fee" value={`${market.feeBps / 100}%`} />
        <Stat
          label={market.status === "trading" ? "Closes In" : market.status === "locked" ? "Resolving" : "Ended"}
          value={fmtCountdown(countdown)}
          warning={market.status === "trading" && countdown < 3600}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — chart, players, assessment, activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sparkline / chart */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">Pool Share Over Time</div>
                <div className="text-sm text-white/55">{market.players[0].handle.replace(".sol", "")} share %</div>
              </div>
              <div className="flex gap-1 text-[10px] font-mono">
                {["1H", "1D", "1W", "MAX"].map((p, i) => (
                  <button key={p} className={`px-2.5 py-1 rounded ${i === 1 ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[160px]">
              <Sparkline
                data={market.sparkline}
                width={800}
                height={160}
                strokeWidth={2}
                className="w-full h-full"
                fill
              />
            </div>
          </div>

          {/* Players + back panel preview */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold uppercase tracking-widest text-white/70">Contestants</h2>
              <span className="text-[10px] font-mono text-white/30">click to back</span>
            </div>
            <div className="space-y-2">
              {market.players.map((p, i) => {
                const pct = total > 0 ? (market.poolByPlayer[i] / total) * 100 : 0;
                const isSelected = selectedIdx === i;
                const isWinner = market.winningPlayerIndex === i;
                return (
                  <button
                    key={i}
                    disabled={!tradingOpen}
                    onClick={() => tradingOpen && setSelectedIdx(i)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg border transition ${
                      isSelected && tradingOpen
                        ? "bg-white/[0.06] border-[#00f2ff]/40"
                        : isWinner
                        ? "bg-[#00ff88]/[0.06] border-[#00ff88]/30"
                        : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]"
                    } ${!tradingOpen ? "cursor-default" : ""}`}
                  >
                    <div
                      className="w-8 h-8 rounded-full shrink-0"
                      style={{ background: `linear-gradient(135deg, hsl(${p.avatarHue ?? 0}, 90%, 65%), hsl(${(p.avatarHue ?? 0) + 30}, 90%, 50%))` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{p.handle.replace(".sol", "")}</span>
                        {p.rating && <span className="text-[10px] font-mono text-white/35">elo {p.rating}</span>}
                        {isWinner && (
                          <span className="text-[9px] font-mono font-bold tracking-widest text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-1.5 py-0.5 rounded">
                            WINNER
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] font-mono text-white/35">{p.pubkey}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-mono font-semibold text-white tabular-nums">
                        {fmtUsd(market.poolByPlayer[i])}
                      </div>
                      <div className="text-[11px] font-mono text-white/40 tabular-nums">{pct.toFixed(1)}%</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <PoolDepthBar
                pools={market.poolByPlayer}
                hues={market.players.map(p => p.avatarHue ?? 0)}
              />
            </div>
          </div>

          {/* Live skill assessment */}
          {market.liveAssessment && (market.status === "trading" || market.status === "locked") && (
            <SkillAssessment market={market} />
          )}

          {/* about */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-white/40" />
              <h3 className="text-[14px] font-semibold uppercase tracking-widest text-white/70">About</h3>
            </div>
            <div className="space-y-3 text-[13px] text-white/55 leading-relaxed">
              <p>
                Back a contestant in this Skill Contest. Your stake joins the pool for that contestant. If they win, you split the prize pool with other backers of the winner, pro-rata to your stake. Pari-mutuel — no order book, no counterparty bookmaker.
              </p>
              <p>
                Settlement is automatic and trustless. When the underlying {market.gameLabel} match resolves on-chain, the contest reads the game program directly. No oracle committee, no dispute window. {market.feeBps / 100}% protocol fee taken from the total pool.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <a href={`https://solscan.io/account/contest-${market.id}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[11px] font-mono text-white/45 hover:text-[#00f2ff]">
                  Contest PDA <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-white/15">·</span>
                <a href={`https://solscan.io/account/match-${market.id}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[11px] font-mono text-white/45 hover:text-[#00f2ff]">
                  Underlying match <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold uppercase tracking-widest text-white/70">Recent Activity</h3>
              <span className="text-[10px] font-mono text-white/30">this market</span>
            </div>
            <ActivityFeed limit={8} marketId={market.id} />
          </div>
        </div>

        {/* RIGHT — back panel */}
        <div className="space-y-4">
          <div className="sticky top-20 glass-strong rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[14px] font-semibold uppercase tracking-widest text-white/85">
                {market.status === "settled" ? "Claim Payout" : market.status === "cancelled" ? "Claim Refund" : "Back Contestant"}
              </span>
            </div>

            {/* selected player */}
            <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-1.5">Selected</div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full"
                  style={{ background: `linear-gradient(135deg, hsl(${market.players[selectedIdx].avatarHue ?? 0}, 90%, 65%), hsl(${(market.players[selectedIdx].avatarHue ?? 0) + 30}, 90%, 50%))` }}
                />
                <div className="flex-1">
                  <div className="text-[14px] font-medium">{market.players[selectedIdx].handle.replace(".sol", "")}</div>
                  <div className="text-[10.5px] font-mono text-white/40">share {sharePct.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* amount */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/35">Stake</label>
                <span className="text-[10px] font-mono text-white/35">USDC · devnet</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!tradingOpen}
                  className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-3 py-3 text-lg font-mono text-white tabular-nums outline-none focus:border-[#00f2ff]/40 disabled:opacity-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-white/35">
                  USDC
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {["10", "25", "50", "100"].map(v => (
                  <button
                    key={v}
                    disabled={!tradingOpen}
                    onClick={() => setAmount(v)}
                    className="flex-1 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] text-[11px] font-mono text-white/65 disabled:opacity-50"
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* projection */}
            <div className="mb-5 space-y-2 text-[12px] font-mono">
              <Row label="Pool entry" value={fmtUsd(amountNum)} />
              <Row label="Protocol fee" value={`${market.feeBps / 100}%`} dim />
              <Row label="Est. share of winning pool" value={`${(myShareOfWinningPool * 100).toFixed(2)}%`} dim />
              <div className="border-t border-white/[0.06] my-2" />
              <Row label="Est. payout if win" value={fmtUsd(estPayout)} accent />
              <Row label={`Est. profit (${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%)`} value={fmtUsd(profit)} className={profit >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"} />
            </div>

            {/* skill component required */}
            {market.players.length > 2 && tradingOpen && (
              <div className="mb-3 px-3 py-2.5 rounded-lg bg-[#7000ff]/[0.08] border border-[#7000ff]/30">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#7000ff] font-semibold mb-0.5">
                  Bracket pick required
                </div>
                <div className="text-[11px] text-white/55">
                  Submit your full {market.players.length}-contestant bracket to back. Skill component for sweepstakes safe harbor.
                </div>
              </div>
            )}

            <button
              disabled={!tradingOpen || amountNum <= 0}
              className="btn-primary w-full py-3 rounded-lg text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {!tradingOpen
                ? market.status === "settled" ? "Contest Settled" : market.status === "locked" ? "Trading Locked" : "Cancelled"
                : `Back ${market.players[selectedIdx].handle.replace(".sol", "")}`}
            </button>

            <div className="mt-3 text-[10px] font-mono text-white/30 text-center">
              No counterparty bookmaker · pool splits among winners
            </div>
          </div>

          {/* what you get */}
          <div className="glass rounded-xl p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-2.5">What you get</div>
            <ul className="space-y-1.5 text-[12px] text-white/55">
              <li className="flex gap-2">✓ <span>On-chain proof of contest entry</span></li>
              <li className="flex gap-2">✓ <span>Backer Rank update on settle</span></li>
              <li className="flex gap-2">✓ <span>Trustless payout if your contestant wins</span></li>
              <li className="flex gap-2">✓ <span>Full refund if contest is cancelled</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, warning }: { label: string; value: string; accent?: boolean; warning?: boolean }) {
  return (
    <div className="bg-black/40 px-5 py-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 font-medium">{label}</span>
      <span className={`text-xl font-mono font-semibold tabular-nums ${
        accent ? "gradient-text" : warning ? "text-[#ffb800]" : "text-white"
      }`}>
        {value}
      </span>
    </div>
  );
}

function Row({ label, value, accent, dim, className = "" }: { label: string; value: string; accent?: boolean; dim?: boolean; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${dim ? "text-white/40" : "text-white/65"}`}>{label}</span>
      <span className={`tabular-nums font-semibold ${accent ? "gradient-text" : "text-white"} ${className}`}>{value}</span>
    </div>
  );
}
