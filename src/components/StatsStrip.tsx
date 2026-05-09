"use client";

import { useEffect, useState } from "react";
import { fmtUsd, fmtNum } from "@/lib/mockData";
import { fetchCmStats, type CmStatsDto } from "@/lib/cmApi";
import PriceTicker from "./PriceTicker";

const microToUsd = (s: string) => Number(BigInt(s) / BigInt(1000)) / 1000;

interface Card {
  label: string;
  value: number;
  format: (n: number) => string;
}

function buildCards(s: CmStatsDto): Card[] {
  const wager = microToUsd(s.totalWagerVolume);
  const spec = microToUsd(s.totalBackerVolume);
  return [
    { label: "Total Value Locked", value: wager + spec, format: (n) => fmtUsd(n, 0) },
    { label: "Wager Volume", value: wager, format: (n) => fmtUsd(n, 0) },
    { label: "Active Markets", value: s.trading, format: (n) => fmtNum(n, 0) },
    { label: "Contestants", value: s.uniqueContestants, format: (n) => fmtNum(n, 0) },
    { label: "Settled", value: s.resolved, format: (n) => fmtNum(n, 0) },
    { label: "Total Markets", value: s.totalMarkets, format: (n) => fmtNum(n, 0) },
  ];
}

export default function StatsStrip() {
  const [stats, setStats] = useState<Card[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchCmStats()
        .then((s) => { if (!cancelled) setStats(buildCards(s)); })
        .catch(() => { /* keep prior state */ });
    load();
    // Resolver caches for 30s; refresh every 30s on the client.
    const id = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.05] border border-white/[0.07] rounded-xl overflow-hidden">
      {(stats ?? Array.from({ length: 6 }).map(() => null)).map((s, i) => (
        <div key={i} className="bg-black/40 px-5 py-4 flex flex-col gap-1.5 hover:bg-white/[0.02] transition">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 font-medium">
            {s?.label ?? "—"}
          </span>
          {s ? (
            <PriceTicker
              value={s.value}
              format={s.format}
              className="text-xl font-semibold text-white"
            />
          ) : (
            <span className="text-xl font-semibold text-white/20">…</span>
          )}
        </div>
      ))}
    </div>
  );
}
