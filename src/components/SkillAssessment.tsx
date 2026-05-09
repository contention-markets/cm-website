"use client";

import { useEffect, useState } from "react";
import type { Market } from "@/lib/mockData";
import { fmtPct } from "@/lib/mockData";

interface Props { market: Market }

export default function SkillAssessment({ market }: Props) {
  const initial = market.liveAssessment;
  const [conf, setConf] = useState(initial?.confidence ?? 0.5);
  const [leadIdx, setLeadIdx] = useState(initial?.leadingPlayerIndex ?? 0);

  useEffect(() => {
    if (!initial || market.status !== "trading" && market.status !== "locked") return;
    const id = setInterval(() => {
      setConf(c => {
        const drift = (Math.random() - 0.45) * 0.04;
        return Math.max(0.51, Math.min(0.97, c + drift));
      });
      // occasional lead swap
      if (Math.random() < 0.03 && market.players.length === 2) {
        setLeadIdx(prev => 1 - prev);
        setConf(0.52);
      }
    }, 2200);
    return () => clearInterval(id);
  }, [initial, market.status, market.players.length]);

  if (!initial) return null;

  const leader = market.players[leadIdx];
  const verb = conf > 0.85 ? "is dominating"
    : conf > 0.7 ? "has a clear advantage"
    : conf > 0.6 ? "has the edge"
    : "is slightly ahead";

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.005]">
      {/* glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#00f2ff]/10 blur-3xl pointer-events-none float-glow" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50">
            Live Skill Assessment
          </span>
          <span className="text-[10px] font-mono text-white/30 ml-auto">
            Stockfish + ER state · 10s
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-semibold text-white">
            {leader.handle.replace(".sol", "")}
          </span>
          <span className="text-sm text-white/55">{verb}.</span>
        </div>

        <p className="text-[12.5px] text-white/45 mb-4 leading-relaxed">
          {initial.rationale}
        </p>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-white/45">Confidence</span>
          <span className="text-[12px] font-mono font-semibold text-white tabular-nums">
            {fmtPct(conf, 0)}
          </span>
        </div>
        <div className="confidence-bar">
          <div className="fill" style={{ width: `${conf * 100}%` }} />
        </div>

        <div className="mt-3 text-[10px] text-white/30 leading-relaxed">
          Display only. Settlement reads from on-chain match result, not this assessment.
        </div>
      </div>
    </div>
  );
}
