"use client";

import { useEffect, useState } from "react";
import type { Market } from "@/lib/mockData";
import { fetchCmMarkets } from "@/lib/cmApi";
import MarketCard from "@/components/MarketCard";
import { Search } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "trading", label: "Trading" },
  { id: "settled", label: "Settled" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export default function MarketsPage() {
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCmMarkets({ status: "all", limit: 200 })
      .then((m) => {
        if (!cancelled) {
          setMarkets(m);
          setLoadError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e?.message || "failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = (markets ?? []).filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (
      q &&
      !m.title.toLowerCase().includes(q.toLowerCase()) &&
      !m.subtitle.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// All markets</div>
        <h1 className="text-3xl font-semibold mb-2">Skill Contests</h1>
        <p className="text-white/50 text-[14px] max-w-2xl">
          Pari-mutuel pools on fully on-chain games. Pool share = your stake / total stake on a contestant.
          Settlement reads from the game program itself.
        </p>
      </div>

      {/* filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 flex-1">
          <Search className="w-4 h-4 text-white/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search contestant or contest"
            className="bg-transparent border-none outline-none text-[13px] py-2.5 px-2 flex-1 text-white placeholder-white/30"
          />
        </div>

        <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-lg p-1 gap-0.5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition ${
                filter === f.id ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      <div className="text-[11px] font-mono text-white/40 mb-4">
        {markets === null
          ? "loading from on-chain…"
          : `${filtered.length} ${filtered.length === 1 ? "market" : "markets"} · sorted by pool size · live from CM v2.1 devnet`}
      </div>

      {loadError && (
        <div className="bg-[#ff3366]/[0.08] border border-[#ff3366]/30 rounded-lg p-4 text-[12px] text-[#ff3366] mb-4">
          Failed to load markets: {loadError}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered
          .sort((a, b) => b.totalPool - a.totalPool)
          .map(m => (
            <MarketCard key={m.id} market={m} />
          ))}
      </div>

      {markets !== null && filtered.length === 0 && (
        <div className="text-center py-16 text-white/40 text-sm">
          No markets match these filters.
        </div>
      )}
    </div>
  );
}
