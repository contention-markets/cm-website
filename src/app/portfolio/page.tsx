"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PORTFOLIO_POSITIONS, getMarket, fmtUsd, BACKERS } from "@/lib/mockData";
import StatusPill from "@/components/StatusPill";
import Sparkline from "@/components/Sparkline";

export default function PortfolioPage() {
  const { publicKey } = useWallet();

  const totalBacked = PORTFOLIO_POSITIONS.reduce((s, p) => s + p.amount, 0);
  const totalWon = PORTFOLIO_POSITIONS.filter(p => p.status === "won").reduce((s, p) => s + p.est, 0);
  const totalOpen = PORTFOLIO_POSITIONS.filter(p => p.status === "open").reduce((s, p) => s + p.est, 0);
  const won = PORTFOLIO_POSITIONS.filter(p => p.status === "won").length;
  const total = PORTFOLIO_POSITIONS.length;
  const winRate = total > 0 ? (won / total) * 100 : 0;
  const myRank = BACKERS[3];

  // mock pnl curve
  const pnlCurve = [0, 12, 28, 18, 35, 42, 38, 56, 71, 65, 82, 96, 108, 124, 138, 142];

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Your account</div>
        <h1 className="text-3xl font-semibold mb-2">Portfolio</h1>
        <p className="text-white/50 text-[14px]">Active backings, settled history, and Backer Rank.</p>
      </div>

      {!publicKey ? (
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Connect wallet</h2>
          <p className="text-white/50 text-[13px] mb-6">View your active backings and Backer Rank.</p>
          <div className="inline-block"><WalletMultiButton /></div>
        </div>
      ) : (
        <>
          {/* stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.07] rounded-xl overflow-hidden mb-6">
            <PortStat label="Total Backed" value={fmtUsd(totalBacked)} sub={`across ${total} contests`} />
            <PortStat label="Open Positions" value={fmtUsd(totalOpen)} sub={`${PORTFOLIO_POSITIONS.filter(p => p.status === "open").length} active`} accent />
            <PortStat label="Total Won" value={fmtUsd(totalWon)} sub={`win rate ${winRate.toFixed(0)}%`} success />
            <PortStat label="Backer Rank" value={`#${myRank.rank}`} sub={`${myRank.contestsCorrect}/${myRank.contestsEntered} correct`} />
          </div>

          {/* PnL chart */}
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">Cumulative P&L</div>
                <div className="text-2xl font-mono font-semibold gradient-text">+{fmtUsd(pnlCurve[pnlCurve.length - 1])}</div>
              </div>
              <div className="flex gap-1 text-[10px] font-mono">
                {["1D", "1W", "1M", "MAX"].map((p, i) => (
                  <button key={p} className={`px-2.5 py-1 rounded ${i === 2 ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white"}`}>{p}</button>
                ))}
              </div>
            </div>
            <Sparkline data={pnlCurve} width={1200} height={120} fill strokeWidth={1.8} className="w-full" />
          </div>

          {/* positions */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-[14px] font-semibold uppercase tracking-widest text-white/85">Positions</h2>
              <span className="text-[10px] font-mono text-white/30">{total} total · {PORTFOLIO_POSITIONS.filter(p => p.status === "open").length} open</span>
            </div>
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-widest text-white/35 text-left border-b border-white/[0.04]">
                  <th className="px-5 py-3 font-medium">Contest</th>
                  <th className="px-5 py-3 font-medium">Backed</th>
                  <th className="px-5 py-3 font-medium text-right">Stake</th>
                  <th className="px-5 py-3 font-medium text-right">Pool Share</th>
                  <th className="px-5 py-3 font-medium text-right">Est. Payout</th>
                  <th className="px-5 py-3 font-medium text-right">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {PORTFOLIO_POSITIONS.map((p, i) => {
                  const m = getMarket(p.marketId)!;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <Link href={`/markets/${p.marketId}`} className="hover:text-[#00f2ff]">
                          <div className="text-white truncate max-w-[280px]">{m.title}</div>
                          <div className="text-[10px] font-mono text-white/35">{m.gameLabel}</div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-white/85">{p.playerHandle.replace(".sol", "")}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-white tabular-nums">{fmtUsd(p.amount)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-white/55 tabular-nums">{p.sharePct.toFixed(2)}%</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold tabular-nums text-white">{fmtUsd(p.est)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusPill status={
                          p.status === "won" ? "settled"
                            : "locked" in p && p.locked ? "locked"
                            : "trading"
                        } />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.status === "won" ? (
                          <button className="px-3 py-1.5 rounded-md bg-[#00ff88]/[0.08] border border-[#00ff88]/30 text-[#00ff88] text-[11px] font-semibold hover:bg-[#00ff88]/[0.12]">
                            Claim
                          </button>
                        ) : (
                          <Link href={`/markets/${p.marketId}`} className="text-[11px] font-mono text-white/45 hover:text-white">view →</Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PortStat({ label, value, sub, accent, success }: { label: string; value: string; sub?: string; accent?: boolean; success?: boolean }) {
  return (
    <div className="bg-black/40 px-5 py-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 font-medium">{label}</span>
      <span className={`text-2xl font-mono font-semibold tabular-nums ${accent ? "gradient-text" : success ? "text-[#00ff88]" : "text-white"}`}>{value}</span>
      {sub && <span className="text-[11px] font-mono text-white/35">{sub}</span>}
    </div>
  );
}
