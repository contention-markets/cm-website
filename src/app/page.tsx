"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BACKERS, fmtUsd } from "@/lib/mockData";
import type { Market } from "@/lib/mockData";
import { fetchCmMarkets } from "@/lib/cmApi";
import HeroTicker from "@/components/HeroTicker";
import StatsStrip from "@/components/StatsStrip";
import MarketCard from "@/components/MarketCard";
import ActivityFeed from "@/components/ActivityFeed";
import { ArrowRight, Trophy, Zap } from "lucide-react";

export default function Home() {
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCmMarkets({ status: "all", limit: 200 })
      .then((m) => { if (!cancelled) setAllMarkets(m); })
      .catch(() => { /* silent — featured cards just won't render */ });
    return () => { cancelled = true; };
  }, []);

  const featured = allMarkets.filter(m => m.status === "trading" || m.status === "locked").slice(0, 3);
  const recentSettled = allMarkets.filter(m => m.status === "settled").slice(0, 3);
  const featuredFallback = allMarkets.length > 0 && featured.length === 0
    ? allMarkets.slice(0, 3)
    : featured;

  return (
    <>
      <HeroTicker />

      {/* HERO */}
      <section className="relative max-w-[1400px] mx-auto px-6 pt-16 pb-12">
        {/* glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[320px] bg-[#00f2ff]/[0.07] blur-[120px] pointer-events-none float-glow" />
        <div className="absolute top-12 right-12 w-[400px] h-[400px] bg-[#7000ff]/[0.08] blur-[120px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] mb-6">
              <Zap className="w-3 h-3 text-[#00f2ff]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                Live · skill contests on fully on-chain games
              </span>
            </div>
            <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.02] tracking-tight mb-5">
              Back the player.
              <br />
              <span className="gradient-text">Settle on-chain.</span>
            </h1>
            <p className="text-[16px] text-white/55 leading-relaxed max-w-xl mb-8">
              Pari-mutuel skill contests on Magic Chess, Cyber Snake Duel, and Blockwords.
              Outcome reads from the game program itself — no oracle committee, no bookmaker, no dispute window.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/markets" className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2 text-[13px]">
                Explore Markets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/leaderboard" className="btn-ghost px-6 py-3 rounded-lg inline-flex items-center gap-2 text-[13px]">
                <Trophy className="w-4 h-4" /> Backer Rank
              </Link>
            </div>
          </div>

          {/* live-stats card — top contestants from real on-chain markets */}
          <div className="lg:col-span-5">
            <div className="gradient-border p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/45">Live · CM v2.1</span>
                <span className="text-[10px] font-mono text-white/30">{allMarkets.length} markets indexed</span>
              </div>
              {allMarkets.length === 0 ? (
                <div className="text-[12px] text-white/40 py-8 text-center">
                  Loading live markets from devnet…
                </div>
              ) : (
                <>
                  <div className="space-y-1.5 mb-4">
                    {(() => {
                      // Build a quick "top contestants by appearance" list from
                      // the first real markets. Lets the hero card show real
                      // wallet names instead of mock tournament players.
                      const counts = new Map<string, { handle: string; rating?: number; hue: number; n: number }>();
                      for (const m of allMarkets.slice(0, 30)) {
                        for (const p of m.players) {
                          const cur = counts.get(p.handle) ?? { handle: p.handle, rating: p.rating, hue: p.avatarHue ?? 0, n: 0 };
                          cur.n++;
                          counts.set(p.handle, cur);
                        }
                      }
                      return [...counts.values()]
                        .sort((a, b) => b.n - a.n)
                        .slice(0, 4)
                        .map((p, i) => (
                          <div key={p.handle} className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
                            <span className="font-mono text-[10px] text-white/30 w-4">{(i + 1).toString().padStart(2, "0")}</span>
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{ background: `linear-gradient(135deg, hsl(${p.hue}, 90%, 65%), hsl(${p.hue + 30}, 90%, 50%))` }}
                            />
                            <span className="text-[13px] text-white/85 flex-1 truncate">{p.handle.replace(".bot", "")}</span>
                            {p.rating ? <span className="text-[11px] font-mono text-white/40 tabular-nums">elo {p.rating}</span> : null}
                            <span className="text-[12px] font-mono font-semibold text-white tabular-nums w-12 text-right">
                              {p.n}m
                            </span>
                          </div>
                        ));
                    })()}
                  </div>
                  <Link href="/markets" className="block w-full text-center py-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition text-[12px] font-medium">
                    Browse all markets · {fmtUsd(allMarkets.reduce((s, m) => s + m.totalPool, 0))} pool
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <StatsStrip />
      </section>

      {/* FEATURED MARKETS */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Live now</div>
            <h2 className="text-2xl font-semibold">Featured Markets</h2>
          </div>
          <Link href="/markets" className="text-[12px] font-mono text-white/55 hover:text-white inline-flex items-center gap-1.5">
            All markets <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredFallback.map(m => (
            <MarketCard key={m.id} market={m} variant="featured" />
          ))}
          {featuredFallback.length === 0 && allMarkets.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-white/40 text-sm text-center py-12">
              Loading markets from devnet…
            </div>
          )}
        </div>
      </section>

      {/* GRID: ACTIVITY + LEADERBOARD PREVIEW */}
      <section className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Activity</h3>
            <span className="text-[11px] font-mono text-white/30">last 24h · all markets</span>
          </div>
          <ActivityFeed limit={10} />
        </div>

        <div>
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Backers</h3>
            <Link href="/leaderboard" className="text-[11px] font-mono text-white/55 hover:text-white">view all</Link>
          </div>
          <div className="glass rounded-xl divide-y divide-white/[0.04] overflow-hidden">
            {BACKERS.slice(0, 7).map(f => (
              <div key={f.rank} className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.02]">
                <span className="font-mono text-[11px] font-semibold w-5 text-white/55 tabular-nums">
                  {f.rank.toString().padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-white truncate">{f.handle}</div>
                  <div className="text-[10px] font-mono text-white/35">
                    {f.contestsCorrect}/{f.contestsEntered} · streak {f.streak >= 0 ? "+" : ""}{f.streak}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[12px] font-mono font-semibold tabular-nums ${f.pnlPct >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"}`}>
                    {f.pnlPct >= 0 ? "+" : ""}{f.pnlPct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] font-mono text-white/30 tabular-nums">{fmtUsd(f.totalWon)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT SETTLED */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Settled · trustless · final</div>
            <h2 className="text-2xl font-semibold">Recent Settlements</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSettled.map(m => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Pick a contest",
              body: "Live and upcoming Magic Chess, Cyber Snake Duel, and Blockwords matches with verifiable contestant history.",
            },
            {
              num: "02",
              title: "Back a contestant",
              body: "Pari-mutuel pool — no order book, no bookmaker. Your share scales with what others stake. Bracket / move-prediction skill component required to enter.",
            },
            {
              num: "03",
              title: "Settle on-chain",
              body: "When the match resolves on-chain, the contest reads the game program directly. Winners claim their slice of the losing pools, minus a 5% protocol fee.",
            },
          ].map((s) => (
            <div key={s.num} className="glass-card p-6">
              <div className="font-mono text-[11px] tracking-[0.16em] text-white/30 mb-3">/ {s.num}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
