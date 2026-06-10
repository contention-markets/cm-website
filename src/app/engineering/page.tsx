"use client";

import Link from "next/link";

export default function EngineeringPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16">
      <div className="mb-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mb-1">// Engineering reference</div>
        <h1 className="text-3xl font-semibold mb-2">Engineering: CM v2.1 + Battle Mode</h1>
        <p className="text-white/50 text-[14px] max-w-2xl">
          Technical reference for the Contention Markets v2.1 program and the 1v1 wagered Battle Mode it supports.
          Not user-facing — for developers building CM consumers, auditors reviewing the contract, and operators
          evaluating the mainnet readiness gate. User docs live at <Link href="/docs" className="text-[#00f2ff] hover:underline">/docs</Link>.
        </p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-1 text-[13px]">
          {[
            { href: "#cm-v2", label: "CM v2 upgrades" },
            { href: "#orchestrator", label: "Orchestrator" },
            { href: "#battle-mode", label: "Battle Mode (1v1)" },
            { href: "#fee-math", label: "Fee math" },
            { href: "#mainnet-gate", label: "Mainnet gate (64 items)" },
            { href: "#roadmap", label: "Roadmap" },
          ].map(l => (
            <a key={l.href} href={l.href} className="block px-3 py-1.5 rounded-md text-white/55 hover:text-white hover:bg-white/[0.03]">
              {l.label}
            </a>
          ))}
        </aside>

        <div className="prose space-y-12 max-w-3xl">

          <Section id="cm-v2" title="Contention Markets v2 — surgical upgrade">
            <p>
              In-place upgrade (same program ID via BPFLoaderUpgradeable). Five surgical changes:
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li><code>resolve_market_from_game_pda</code> — <strong>permissionless resolve</strong>. Any keeper can settle a match if a registered game program says it&rsquo;s over. No partner key required.</li>
              <li><code>ProtocolConfig.pool_backer</code> — new optional field routes a slice of every fee to the free-play pool.</li>
              <li>Fee split: <strong>0.80% protocol / 1.00% partner / 0.20% PoolBacker</strong>. Winner still nets 98%.</li>
              <li>Idempotency guards — prevents double-payout from concurrent resolve races.</li>
              <li><code>close_market_permissionless</code> — rent reclaim on expired/resolved markets (24hr cooldown, rent to creator not caller).</li>
            </ul>
          </Section>

          <Section id="orchestrator" title="Gamerplex Orchestrator — signed-URL challenges">
            <p>
              Sibling program (~300 lines Anchor) for challenge-link flow and on-chain game registry.
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li><code>claim_challenge</code> — ed25519 precompile verifies creator&rsquo;s signed URL payload. Zero on-chain cost to <em>create</em> a challenge; first player opens the link and triggers the only on-chain tx. PoolBacker pays ephemeral rent.</li>
              <li><code>revoke_challenge</code> — creator-only. Mark own nonce used.</li>
              <li><code>replenish_pool_backer</code> — keeper-callable. Routes protocol treasury slice to PoolBacker. Small bounty covers tx fees.</li>
              <li><code>register_game</code> — permissionless on-chain game registry. Any frontend can <code>getProgramAccounts</code> to list games.</li>
            </ul>
            <p>
              Combined with CM v2: new games deploy sovereign by default — challenges are free signed URLs, settlement is
              permissionless, the free-play pool self-funds from volume, and any frontend can surface any game.
            </p>
          </Section>

          <Section id="battle-mode" title="Battle Mode (1v1 head-to-head)">
            <p>
              Battle Mode is a CM consumer pattern, not a separate program. Two parties each stake, play a skill match
              (chess / snake / blockwords / etc.), winner takes 98%, loser&rsquo;s stake is forfeited.
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong>Lifecycle:</strong> <code>init_market_v21</code> → both parties <code>deposit</code> → game runs (on ER or L1) → <code>resolve_market</code> with outcome (P1_WINS / P2_WINS / CANCELLED) → <code>close_market</code> for rent reclaim.</li>
              <li><strong>Live state:</strong> sub-second per-move sync via MagicBlock Ephemeral Rollup. ~$0.0001 per move vs ~$0.0005 on L1. Final state commits to L1 with the resolve call.</li>
              <li><strong>Trust model:</strong> the game program is the oracle. CM v2.1 reads the registered game PDA at resolve time — no third-party oracle, no dispute window.</li>
              <li><strong>SDK:</strong> developers building Battle Mode games should consume the <code>@contention-markets/sdk</code> package (in progress at <code>/Users/johnny/Code/contention-gg/cm-sdk</code>). The arcade-only <code>@gamerplex/sdk</code> does NOT include CM primitives by design.</li>
              <li><strong>Operator legal frame:</strong> a frontend operating Battle Mode bears its own legal responsibility. See <Link href="/docs#legal" className="text-[#00f2ff] hover:underline">/docs#legal</Link> for the skill-contest framing this site uses for the backer surface — Battle Mode operators should secure their own opinion (Skillz / DraftKings precedent is the closest fit).</li>
            </ul>
          </Section>

          <Section id="fee-math" title="Fee math — Battle Mode">
            <p>
              On settlement, a <strong>2% protocol rake</strong> splits four ways. Winner nets 98% of the pot.
            </p>
            <Code>{`Component        Rate    Destination
Protocol         0.80%   CM operator entity (offshore-future)
Game creator     1.00%   Creator's wallet (arms-length dev rev share)
PoolBacker       0.20%   CM-owned PDA (self-funding ER infrastructure)
Winner payout   98.00%   Winner's wallet`}</Code>
            <p>
              <strong>Self-sustaining economics:</strong> each match contributes 0.20% to PoolBacker while costing ~33k
              lamports in ephemeral rent. At any pot size above ~$1, PoolBacker inflow &gt; outflow. The free-play pool
              grows with volume instead of being topped up manually.
            </p>
            <p className="text-white/45 text-[13px]">
              Break-even on Battle Mode infrastructure: ~25 matches/day at $5 stake.
            </p>
          </Section>

          <Section id="mainnet-gate" title="Mainnet Readiness Gate — 64 items">
            <p>
              Three sub-gates testing PROVEN (it works at scale), PROFITABLE (unit economics positive on devnet first),
              and CYBERSECURE (independent attacker can&rsquo;t extract value).
            </p>
            <p>
              Includes 100-concurrent-match load, 24-hour soak, fee-split audit to 1-lamport precision, double-resolve
              attack, forged game PDA, replayed nonce, multisig, timelock, independent code review, wash-trade detector,
              treasury operations, creator-program defenses.
            </p>
            <p>
              <strong>Mainnet only after the gate is green AND the offshore CM entity is formed.</strong> Until then,
              every surface stays on devnet with play-money.
            </p>
          </Section>

          <Section id="roadmap" title="Roadmap">
            <h4 className="text-white/85 font-semibold mt-2 mb-1">Track A — Backer surface (this site)</h4>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>contention.markets dashboard live on devnet — 166 markets, real on-chain reads</li>
              <li>cm-website + cm-contract repos split (cm-website public, cm-contract devnet-hardening)</li>
              <li>Pari-mutuel skill-contest markets (5% protocol fee — see /docs)</li>
              <li>Mainnet pending offshore entity formation</li>
            </ul>
            <h4 className="text-white/85 font-semibold mt-2 mb-1">Track B — Battle Mode (1v1)</h4>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>gamerplex-battle shell program (skeleton shipped, settlement orchestration via CM v2.1 CPI)</li>
              <li>Per-game rules engines (magic-chess-rules, snake-duel-rules, blockwords-rules) — 3-ix CPI ABI</li>
              <li>Full devnet integration test: lobby → ER session → settle → winner paid</li>
              <li>Cost saving: new battle game ~$60 instead of ~$510 — 8.5× cheaper than standalone programs</li>
              <li>Stays devnet-only until offshore entity forms</li>
            </ul>
            <h4 className="text-white/85 font-semibold mt-2 mb-1">Mainnet — when entity ✅ AND gate ✅</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Offshore CM operating entity formed (Cayman / BVI / UAE FZE TBD)</li>
              <li>Independent security audit complete</li>
              <li>Two-Squads multisig live (Gamerplex Pty Ltd ↔ CM operator entity)</li>
              <li>48hr admin timelock on CM v2.1</li>
              <li>All 64 items in the Wagered Readiness Gate green</li>
            </ul>
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
