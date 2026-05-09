"use client";

import { useEffect, useRef, useState } from "react";

interface PriceTickerProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
  flashOnChange?: boolean;
}

export default function PriceTicker({
  value,
  format = (n) => n.toLocaleString(),
  className = "",
  flashOnChange = true,
}: PriceTickerProps) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    if (flashOnChange) {
      setFlash(value > prev.current ? "up" : "down");
      setTimeout(() => setFlash(null), 700);
    }
    setDisplay(value);
    prev.current = value;
  }, [value, flashOnChange]);

  return (
    <span
      className={`tabular-nums font-mono ${className} ${
        flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""
      }`}
    >
      {format(display)}
    </span>
  );
}
