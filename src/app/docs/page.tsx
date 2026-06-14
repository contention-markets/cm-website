"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
      <div className="mb-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Documentation</div>
        <h1 className="text-3xl font-semibold mb-2">How Contention.markets works</h1>
        <p className="text-white/50 text-[14px] max-w-2xl">
          The backer surface for fully on-chain games. Skill Contests are pari-mutuel pools on the outcome of matches you don&rsquo;t play. To compete as a contestant instead, head to the <a href="https://gamerplex.com" target="_blank" rel="noopener" className="text-[#00f2ff] hover:underline">player surface ↗</a> (separate operator).
        </p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-1 text-[13px]">
          {[
            { href: "#contests", label: "Skill Contests" },
            { href: "#play", label: "Want to play instead?" },
            { href: "#oracle", label: "Oracle architecture" },
            { href: "#fees", label: "Fees & payouts" },
            { href: "#legal", label: "Legal frame" },
            { href: "#programs", label: "Programs / on-chain" },
          ].map(l => (
            <a key={l.href} href={l.href} className="block px-3 py-1.5 rounded-md text-white/55 hover:text-white hover:bg-white/[0.03]">
              {l.label}
            </a>
          ))}
        </aside>

        {/* content */}
        <div className="prose space-y-12 max-w-3xl">
          <Section id="contests" title="Skill Contests">
            <p>
              Skill Contests are <strong>pari-mutuel pools</strong> on the outcome of fully on-chain games. The
              underlying matches are played on a sibling player surface; backers here back a contestant, and if
              their contestant wins they split the prize pool with other backers of that contestant, pro-rata to their
              stake.
            </p>
            <p>
              No order book. No bookmaker. No counterparty. The protocol takes a 5% fee from the total pool;
              everything else flows to backers of the winning contestant.
            </p>
            <Code>
{`Total pool        = sum(stake[i] for all backers i)
Winning pool      = sum(stake[i] for backers of winner)
Distributable     = total pool × (1 − fee_bps / 10000)
Your payout       = your_stake / winning_pool × distributable`}
            </Code>
            <p>
              Each entry requires a <strong>skill component</strong> — a bracket pick (for tournaments) or a
              move-prediction memo (for 1v1). This anchors the legal frame as a "predominantly skill" contest under
              DFS precedent. Free entries via <strong>Skill Points</strong> (earned playing arcade games) cover the
              alternative-method-of-entry sweepstakes safe harbor.
            </p>
          </Section>

          <Section id="play" title="Want to play instead?">
            <p>
              Contention.markets is the <strong>backer surface</strong> — you back contestants in matches you don&rsquo;t play.
              If you want to compete <em>as</em> a contestant, head to the <a href="https://gamerplex.com" target="_blank" rel="noopener" className="text-[#00f2ff] hover:underline">player surface ↗</a>.
            </p>
            <p>
              The player surface is a separately-operated product where you challenge another player directly, accept
              their challenge, and compete in chess / snake / blockwords matches. The two surfaces share only the
              oracle layer — the same on-chain game programs that decide outcomes — and operate as
              <strong> separate products under separate legal entities</strong>. A regulator action against one does
              not put the other at risk.
            </p>
          </Section>

          <Section id="oracle" title="Oracle architecture">
            <p>
              Match outcomes are read from the game program's on-chain state. Three layers:
            </p>
            <Code>
{`Tier A — live ER state          → display "skill assessment" (no settlement)
Tier B — game program PDA       → authoritative settlement
Tier C — GPX1 SPL-memo on L1    → fallback if Tier B unavailable`}
            </Code>
            <p>
              Tier B is the binary differentiator. DraftKings reads stats from third-party feeds (Stats Inc.,
              SportRadar) — they trust an oracle. We read directly from the game program that produced the result.
              No oracle committee. No dispute window.
            </p>
            <p className="text-white/45 text-[13px]">
              Tier C ensures contests can still settle from on-chain transaction history even if every off-chain
              server disappears — on either surface.
            </p>
          </Section>

          <Section id="fees" title="Fees & payouts">
            <Code>
{`Protocol fee       5%   (default; configurable in ContestConfig)
Organizer fee      0–2%  (opt-in per contest; streamer kickback)
$GAMER buy-burn    0–1%  (post-launch; folds to treasury until token ships)
Total max          10%   (hard-capped in code)`}
            </Code>
            <p>
              Fees collect into a per-contest <code>FeeVault</code> PDA on each backing, then flush at settlement.
              <strong> No fee on cancelled contests</strong> — backers refund 100%.
            </p>
            <p>
              Settlement is permissionless — anyone can call <code>settle_contest</code> once the underlying match
              resolves. We run the first keeper but don't gate it.
            </p>
          </Section>

          <Section id="legal" title="Legal frame">
            <p>
              Skill Contests are framed as <strong>skill contests under DFS precedent</strong>, not as prediction
              markets. Three pillars:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-white/65">
              <li>Underlying games (Magic Chess, Cyber Snake, Blockwords) are skill-predominantly — chess is
                the textbook skill game in US case law.</li>
              <li>Skill component required to enter (bracket / move prediction) — anchors backer engagement
                in the same skill domain.</li>
              <li>Free-entry path via Skill Points — covers no-purchase-necessary sweepstakes safe harbor.</li>
            </ol>
            <p>
              Vocabulary discipline: we never call it betting, gambling, odds, wagering, or prediction in
              user-facing copy. The Robinhood-style chess market is a CFTC-regulated event contract through KalshiEX
              — we don't and won't compete in that lane.
            </p>
            <p className="text-white/45 text-[13px]">
              Devnet only with play-money. Mainnet ships when the regulatory frame is confirmed.
            </p>
          </Section>

          <Section id="programs" title="Programs / on-chain">
            <Code>
{`contention-markets    69Yfc...1Xo8   live on devnet  · CM v2.1 (backer pools)
contest-pools         TBD            in design       · Skill Contests program

oracles consumed (player-surface programs, separate operator):
  magic-chess         match result PDAs
  cyber-snake         bot duel PDAs
  blockwords          showdown PDAs`}
            </Code>
            <p>
              Source of truth for invariants is the program code in
              <code> programs/&lt;name&gt;/src/lib.rs</code>. IDLs are mirrored to the player-surface frontend for
              type-safe instruction builders; that's a read-only operational dependency, not a shared codebase.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://solscan.io" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[12px] text-[#00f2ff] hover:underline">
                Solscan <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://gamerplex.com" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[12px] text-[#00f2ff] hover:underline">
                Player surface ↗ <ExternalLink className="w-3 h-3" />
              </a>
              <Link href="/markets" className="inline-flex items-center gap-1.5 text-[12px] text-[#00f2ff] hover:underline">
                Browse markets →
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/30">/ {id}</span>
      </h2>
      <h3 className="text-[26px] font-semibold mb-4 -mt-3">{title}</h3>
      <div className="space-y-3.5 text-[14px] text-white/65 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-4 p-4 rounded-lg bg-black/50 border border-white/[0.06] overflow-x-auto text-[12px] font-mono text-white/75 leading-relaxed">
      {children}
    </pre>
  );
}
