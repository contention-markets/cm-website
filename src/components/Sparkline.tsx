"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  fill?: boolean;
  variant?: "default" | "win" | "loss" | "neutral";
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  className = "",
  strokeWidth = 1.5,
  fill = true,
  variant = "default",
}: SparklineProps) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);

  const trend = data[data.length - 1] - data[0];
  const auto = variant === "default" ? (trend >= 0 ? "win" : "loss") : variant;
  const stroke = auto === "win" ? "#00ff88" : auto === "loss" ? "#ff3366" : "#00f2ff";
  const gradId = `spark-${auto}-${data.length}-${data[0].toFixed(3)}`;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return { x, y };
  });

  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const fillD = `${lineD} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} className={className} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={fillD} fill={`url(#${gradId})`} />}
      <path d={lineD} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.4" fill={stroke}>
        <animate attributeName="r" values="2.4;4;2.4" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
