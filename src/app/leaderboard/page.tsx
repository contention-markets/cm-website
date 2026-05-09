"use client";

import { useState } from "react";
import { BACKERS, fmtUsd } from "@/lib/mockData";
import { Trophy, TrendingUp } from "lucide-react";

const PERIODS = [
  { id: "all", label: "All-time" },
  { id: "30d", label: "30d" },
  { id: "7d", label: "7d" },
  { id: "24h", label: "24h" },
] as const;

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]["id"]>("all");
  const top3 = BACKERS.slice(0, 3);
  const rest = BACKERS.slice(3);

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Backer rank</div>
        <h1 className="text-3xl font-semibold mb-2">Leaderboard</h1>
        <p className="text-white/50 text-[14px] max-w-2xl">
          Verifiable cross-game prediction track record. Updated on every contest settlement.
          Only Skill Contest backers ranked here — player Elo rankings live on the{" "}
          <a href="https://gamerplex.com/leaderboard" target="_blank" rel="noopener" className="text-[#00f2ff] hover:underline">player surface ↗</a>.
        </p>
      </div>

      {/* period tabs */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 gap-0.5">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition ${
                period === p.id ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {top3.map((f, i) => (
          <div
            key={f.rank}
            className={`relative gradient-border p-6 ${i === 0 ? "md:order-2 md:scale-[1.04]" : i === 1 ? "md:order-1" : "md:order-3"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className={`w-4 h-4 ${i === 0 ? "text-[#ffb800]" : i === 1 ? "text-white/55" : "text-[#cd7f32]"}`} />
                <span className={`font-mono text-[11px] tracking-widest font-semibold ${
                  i === 0 ? "text-[#ffb800]" : i === 1 ? "text-white/55" : "text-[#cd7f32]"
                }`}>
                  RANK {f.rank.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/30">streak {f.streak >= 0 ? "+" : ""}{f.streak}</span>
            </div>
            <div className="text-xl font-semibold mb-0.5">{f.handle}</div>
            <div className="text-[10.5px] font-mono text-white/35 mb-5">{f.wallet}</div>

            <div className="grid grid-cols-2 gap-px bg-white/[0.04] rounded-lg overflow-hidden">
              <div className="bg-black/40 p-3">
                <div className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 mb-1">P&L</div>
                <div className={`text-xl font-mono font-semibold tabular-nums ${f.pnlPct >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"}`}>
                  {f.pnlPct >= 0 ? "+" : ""}{f.pnlPct.toFixed(1)}%
                </div>
              </div>
              <div className="bg-black/40 p-3">
                <div className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 mb-1">Won</div>
                <div className="text-xl font-mono font-semibold tabular-nums text-white">
                  {fmtUsd(f.totalWon)}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>{f.contestsCorrect}/{f.contestsEntered} correct</span>
              <span>{((f.contestsCorrect / f.contestsEntered) * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* full table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/55" />
            <h2 className="text-[14px] font-semibold uppercase tracking-widest text-white/85">All Backers</h2>
          </div>
          <span className="text-[10px] font-mono text-white/30">{BACKERS.length} ranked</span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-widest text-white/35 text-left border-b border-white/[0.04]">
              <th className="px-5 py-3 font-medium">Rank</th>
              <th className="px-5 py-3 font-medium">Backer</th>
              <th className="px-5 py-3 font-medium text-right">Contests</th>
              <th className="px-5 py-3 font-medium text-right">Hit %</th>
              <th className="px-5 py-3 font-medium text-right">Total Backed</th>
              <th className="px-5 py-3 font-medium text-right">Total Won</th>
              <th className="px-5 py-3 font-medium text-right">P&L</th>
              <th className="px-5 py-3 font-medium text-right">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rest.map(f => (
              <tr key={f.rank} className="hover:bg-white/[0.02] transition">
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[12px] font-semibold text-white/55 tabular-nums">{f.rank.toString().padStart(2, "0")}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-white">{f.handle}</div>
                  <div className="text-[10px] font-mono text-white/35">{f.wallet}</div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-white/55 tabular-nums">{f.contestsCorrect}/{f.contestsEntered}</td>
                <td className="px-5 py-3.5 text-right font-mono text-white tabular-nums">{((f.contestsCorrect / f.contestsEntered) * 100).toFixed(0)}%</td>
                <td className="px-5 py-3.5 text-right font-mono text-white/55 tabular-nums">{fmtUsd(f.totalBacked)}</td>
                <td className="px-5 py-3.5 text-right font-mono font-semibold text-white tabular-nums">{fmtUsd(f.totalWon)}</td>
                <td className={`px-5 py-3.5 text-right font-mono font-semibold tabular-nums ${f.pnlPct >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"}`}>
                  {f.pnlPct >= 0 ? "+" : ""}{f.pnlPct.toFixed(1)}%
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold tabular-nums ${
                    f.streak > 3 ? "bg-[#00ff88]/[0.1] text-[#00ff88]" :
                    f.streak < 0 ? "bg-[#ff3366]/[0.1] text-[#ff3366]" :
                    "bg-white/[0.04] text-white/55"
                  }`}>
                    {f.streak > 0 ? "+" : ""}{f.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
