"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ActivityEvent } from "@/lib/mockData";
import { getInitialActivity, generateActivityEvent, fmtUsd, shortAddr } from "@/lib/mockData";

const TYPE_LABEL: Record<ActivityEvent["type"], string> = {
  back: "BACK",
  settle: "SETTLE",
  claim: "CLAIM",
  create: "CREATE",
  lock: "LOCK",
};

const TYPE_COLOR: Record<ActivityEvent["type"], string> = {
  back: "text-[#00f2ff] bg-[#00f2ff]/[0.08] border-[#00f2ff]/20",
  settle: "text-white/70 bg-white/[0.04] border-white/15",
  claim: "text-[#00ff88] bg-[#00ff88]/[0.08] border-[#00ff88]/20",
  create: "text-[#7000ff] bg-[#7000ff]/[0.1] border-[#7000ff]/30",
  lock: "text-[#ffb800] bg-[#ffb800]/[0.08] border-[#ffb800]/30",
};

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 5) return "just now";
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

export default function ActivityFeed({ limit = 14, marketId }: { limit?: number; marketId?: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [seed, setSeed] = useState(1000);

  useEffect(() => {
    setEvents(getInitialActivity(limit + 4));
  }, [limit]);

  useEffect(() => {
    const id = setInterval(() => {
      const e = generateActivityEvent(seed);
      setEvents(prev => [{ ...e, ts: Date.now() }, ...prev].slice(0, limit + 4));
      setSeed(s => s + 17);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [seed, limit]);

  const visible = (marketId ? events.filter(e => e.marketId === marketId) : events).slice(0, limit);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
            Live Activity
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/30">streaming · devnet</span>
      </div>

      <div className="divide-y divide-white/[0.04] max-h-[480px] overflow-y-auto">
        {visible.map((e, i) => (
          <div
            key={e.id + i}
            className="px-5 py-2.5 flex items-center gap-3 hover:bg-white/[0.02] transition group"
            style={{
              animation: i === 0 ? "flash-up 0.7s ease-out" : undefined,
            }}
          >
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest border shrink-0 w-14 text-center ${TYPE_COLOR[e.type]}`}>
              {TYPE_LABEL[e.type]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] text-white/85 truncate">
                <span className="font-mono text-white/55">{shortAddr(e.actor)}</span>
                {e.type === "back" && (
                  <>
                    <span className="text-white/40"> backed </span>
                    <span className="font-medium">{e.player?.replace(".sol", "")}</span>
                  </>
                )}
                {e.type === "claim" && <span className="text-white/40"> claimed payout</span>}
                {e.type === "settle" && <span className="text-white/40"> resolved match</span>}
                {e.type === "create" && <span className="text-white/40"> created contest</span>}
              </div>
              <Link href={`/markets/${e.marketId}`} className="text-[10.5px] text-white/35 hover:text-white/55 truncate block">
                {e.marketTitle}
              </Link>
            </div>
            <div className="text-right shrink-0">
              {e.amount ? (
                <div className="font-mono text-[12px] font-semibold text-white tabular-nums">
                  {fmtUsd(e.amount)}
                </div>
              ) : null}
              <div className="font-mono text-[10px] text-white/30">{timeAgo(e.ts)}</div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-10 text-center text-[12px] text-white/30">
            No recent activity for this market.
          </div>
        )}
      </div>
    </div>
  );
}
