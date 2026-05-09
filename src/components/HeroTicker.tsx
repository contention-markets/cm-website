"use client";

import { useEffect, useState } from "react";
import type { Market } from "@/lib/mockData";
import { fmtUsd } from "@/lib/mockData";
import { fetchCmMarkets } from "@/lib/cmApi";

export default function HeroTicker() {
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCmMarkets({ status: "all", limit: 30 })
      .then((m) => { if (!cancelled) setMarkets(m); })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

  // Triple to keep scroll seamless. If markets is empty (still loading), the
  // ticker bar just shows nothing — better than mock data flickering in.
  const items = markets.length > 0 ? [...markets, ...markets, ...markets] : [];

  return (
    <div className="border-y border-white/[0.05] bg-black/30 overflow-hidden">
      <div className="ticker-track py-2.5 gap-8">
        {items.map((m, i) => {
          const leadIdx = m.poolByPlayer.indexOf(Math.max(...m.poolByPlayer));
          const leadPct = m.totalPool > 0 ? (m.poolByPlayer[leadIdx] / m.totalPool) * 100 : 50;
          const trend = m.sparkline[m.sparkline.length - 1] - m.sparkline[0];
          return (
            <div key={i} className="flex items-center gap-2.5 shrink-0 px-2 text-[11.5px] font-mono">
              <span className="text-white/35 uppercase tracking-widest text-[10px]">{m.gameLabel}</span>
              <span className="text-white/85">{m.title}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">{m.players[leadIdx].handle.replace(".bot", "")}</span>
              <span className="text-white">{leadPct.toFixed(0)}%</span>
              <span className={trend >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"}>
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend * 100).toFixed(1)}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-white/55">{fmtUsd(m.totalPool)}</span>
              <span className="mx-3 text-white/15">|</span>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-[11px] text-white/30 px-4">Loading live CM v2.1 markets from devnet…</div>
        )}
      </div>
    </div>
  );
}
