"use client";

interface PoolDepthBarProps {
  pools: number[];
  hues?: number[];
  height?: number;
  showLabels?: boolean;
}

const DEFAULT_HUES = [200, 320, 140, 30, 270, 60, 180, 0];

export default function PoolDepthBar({ pools, hues = DEFAULT_HUES, height = 6, showLabels = false }: PoolDepthBarProps) {
  const total = pools.reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden flex"
        style={{ height, background: "rgba(255,255,255,0.05)" }}
      >
        {pools.map((p, i) => {
          const pct = (p / total) * 100;
          const hue = hues[i % hues.length];
          return (
            <div
              key={i}
              className="h-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, hsla(${hue}, 95%, 55%, 0.95), hsla(${hue}, 95%, 65%, 0.7))`,
                borderRight: i < pools.length - 1 ? "1px solid rgba(0,0,0,0.4)" : "none",
              }}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-mono text-white/50">
          {pools.map((p, i) => {
            const pct = (p / total) * 100;
            const hue = hues[i % hues.length];
            return (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${hue}, 95%, 60%)` }} />
                <span>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
