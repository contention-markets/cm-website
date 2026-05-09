"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Market } from "@/lib/mockData";
import { fmtUsd, fmtCountdown, fmtPct } from "@/lib/mockData";
import PoolDepthBar from "./PoolDepthBar";
import StatusPill from "./StatusPill";
import Sparkline from "./Sparkline";

interface Props {
  market: Market;
  variant?: "compact" | "featured";
}

export default function MarketCard({ market, variant = "compact" }: Props) {
  const [countdown, setCountdown] = useState(market.startsInSec);
  useEffect(() => {
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, []);

  const featured = variant === "featured";
  const total = market.totalPool;
  const players = market.players;

  return (
    <Link
      href={`/markets/${market.id}`}
      className={`group relative block ${
        featured ? "gradient-border" : "glass-card"
      } p-5 ${featured ? "min-h-[280px]" : ""}`}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">
          {market.gameLabel}
        </span>
        <StatusPill status={market.status} />
      </div>

      {/* title */}
      <h3 className={`font-semibold text-white leading-tight ${featured ? "text-xl mb-2" : "text-base mb-2"}`}>
        {market.title}
      </h3>
      <p className="text-[12px] text-white/40 mb-4 line-clamp-1">{market.subtitle}</p>

      {/* players preview (top 2) */}
      {!featured && players.length <= 2 && (
        <div className="flex items-center gap-2 mb-3">
          {players.map((p, i) => {
            const sharePct = total > 0 ? (market.poolByPlayer[i] / total) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.025] border border-white/[0.05]">
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${p.avatarHue ?? 0}, 90%, 65%), hsl(${(p.avatarHue ?? 0) + 30}, 90%, 50%))` }}
                />
                <span className="text-[12px] font-medium text-white/85 truncate flex-1">
                  {p.handle.replace(".sol", "")}
                </span>
                <span className="text-[11px] font-mono font-semibold text-white tabular-nums">
                  {sharePct.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* multi-player N>2 — show stacked + count */}
      {!featured && players.length > 2 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-1.5">
            {players.slice(0, 5).map((p, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-black"
                style={{ background: `linear-gradient(135deg, hsl(${p.avatarHue ?? 0}, 90%, 65%), hsl(${(p.avatarHue ?? 0) + 30}, 90%, 50%))` }}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-white/50">
            {players.length} contestants
          </span>
        </div>
      )}

      {/* featured — full table */}
      {featured && (
        <div className="space-y-1 mb-4">
          {players.slice(0, 4).map((p, i) => {
            const sharePct = total > 0 ? (market.poolByPlayer[i] / total) * 100 : 0;
            const isLeader = sharePct === Math.max(...market.poolByPlayer.map(v => (v / total) * 100));
            return (
              <div key={i} className="flex items-center gap-3 px-2.5 py-1.5 rounded-md hover:bg-white/[0.02]">
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${p.avatarHue ?? 0}, 90%, 65%), hsl(${(p.avatarHue ?? 0) + 30}, 90%, 50%))` }}
                />
                <span className={`text-[13px] flex-1 truncate ${isLeader ? "text-white font-semibold" : "text-white/70"}`}>
                  {p.handle.replace(".sol", "")}
                </span>
                <span className="text-[11px] font-mono text-white/50 tabular-nums w-16 text-right">
                  {fmtUsd(market.poolByPlayer[i])}
                </span>
                <span className="text-[12px] font-mono font-semibold text-white tabular-nums w-12 text-right">
                  {sharePct.toFixed(0)}%
                </span>
              </div>
            );
          })}
          {players.length > 4 && (
            <div className="text-[11px] font-mono text-white/35 px-2.5 py-1">
              +{players.length - 4} more contestants
            </div>
          )}
        </div>
      )}

      <PoolDepthBar pools={market.poolByPlayer} hues={players.map(p => p.avatarHue ?? 0)} />

      {/* footer stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05]">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/35">Pool</span>
          <span className="text-[14px] font-mono font-semibold text-white tabular-nums">
            {fmtUsd(total)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/35">Backers</span>
          <span className="text-[14px] font-mono font-semibold text-white tabular-nums">
            {market.backerCount}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/35">
            {market.status === "trading" ? "Closes" : market.status === "locked" ? "Resolving" : market.status === "settled" ? "Ended" : "Status"}
          </span>
          <span className="text-[14px] font-mono font-semibold text-white tabular-nums">
            {fmtCountdown(countdown)}
          </span>
        </div>
      </div>

      {featured && market.sparkline.length > 1 && (
        <div className="absolute top-5 right-5 opacity-60">
          <Sparkline data={market.sparkline} width={88} height={28} fill={false} strokeWidth={1.4} />
        </div>
      )}
    </Link>
  );
}
