"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/leaderboard", label: "Backers" },
  { href: "/docs", label: "Docs" },
];

export default function TopNav() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#00f2ff] to-[#7000ff] group-hover:scale-105 transition-transform" />
            <div className="absolute inset-[1px] rounded-md bg-black flex items-center justify-center">
              <span className="font-mono font-bold text-sm gradient-text">C</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/50">CONTENTION</span>
            <span className="font-mono text-[11px] tracking-[0.18em] gradient-text font-bold">.MARKETS</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium tracking-wide transition-all ${
                  active
                    ? "text-white bg-white/[0.06] border border-white/[0.08]"
                    : "text-white/55 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#ffb800]/[0.08] border border-[#ffb800]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffb800] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#ffb800] font-semibold">DEVNET</span>
          </div>
          {mounted && <WalletMultiButton />}
        </div>
      </div>
    </header>
  );
}
