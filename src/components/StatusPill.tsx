import type { MarketStatus } from "@/lib/mockData";

const VARIANTS: Record<MarketStatus, { label: string; cls: string; dot: string }> = {
  trading: {
    label: "TRADING",
    cls: "bg-[#00ff88]/[0.08] border-[#00ff88]/30 text-[#00ff88]",
    dot: "bg-[#00ff88] animate-pulse",
  },
  locked: {
    label: "LOCKED",
    cls: "bg-[#ffb800]/[0.08] border-[#ffb800]/30 text-[#ffb800]",
    dot: "bg-[#ffb800] animate-pulse",
  },
  settled: {
    label: "SETTLED",
    cls: "bg-white/[0.04] border-white/15 text-white/60",
    dot: "bg-white/50",
  },
  cancelled: {
    label: "CANCELLED",
    cls: "bg-[#ff3366]/[0.08] border-[#ff3366]/30 text-[#ff3366]",
    dot: "bg-[#ff3366]",
  },
};

export default function StatusPill({ status }: { status: MarketStatus }) {
  const v = VARIANTS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold tracking-widest ${v.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {v.label}
    </span>
  );
}
