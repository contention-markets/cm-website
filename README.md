# cm-website

The dashboard frontend for **[Contention Markets](https://contention.markets)** — pari-mutuel skill-contest markets on Solana.

> *Back the player. Settle on-chain.*

---

## ⚠️ Devnet only

**This is a devnet preview. Nothing on this site involves real money.**

- All markets settle in **devnet USDC** (faucet token, no economic value).
- All wallets connect to **Solana devnet** by default.
- **Mainnet deploy is gated** behind: independent code review and full Mainnet Readiness Gate sign-off.
- This UI is published as **infrastructure / reference code** — not an offer of service in any jurisdiction.

If you arrived here expecting a live wagering product: it's not one yet. Bookmark and check back when mainnet ships.

---

## Live (devnet)

- Web: https://contention.markets *(Solana devnet)*
- Network: Solana **devnet** (mainnet ships post-audit)
- Data layer: a separately-operated public resolver (devnet RPC; default URL set in `src/lib/cmApi.ts`, override via `NEXT_PUBLIC_RESOLVER_URL`)

## What it does

Renders live state from on-chain markets registered with Contention Markets v2.1:

- `/` — dashboard hero, live ticker, top contestants, stats strip
- `/markets` — browse all markets (currently 166 indexed on devnet)
- `/markets/[pda]` — single-market detail
- `/leaderboard` — backer ranks
- `/portfolio` — wallet-gated personal positions
- `/docs` — protocol documentation

All reads go through the resolver — Helius RPC keys never reach the browser.

## Stack

- Next.js 16.1 (App Router)
- React 19
- TypeScript 5
- `@solana/wallet-adapter-react` (Phantom-only — other adapters intentionally trimmed for security)
- `@coral-xyz/anchor` 0.32
- Tailwind / vanilla CSS

## Local development

```bash
git clone https://github.com/contention-markets/cm-website
cd cm-website
npm install
npm run dev
# Open http://localhost:3030
```

The frontend reads from a public resolver by default. To point at a different resolver:

```bash
NEXT_PUBLIC_RESOLVER_URL=http://localhost:8080 npm run dev
```

## Architecture

```
[ Browser ]
     │
     │  HTTPS
     ▼
[ Vercel — this repo ]
     │
     │  fetch /cm/markets, /cm/stats, /arcade/leaderboard/...
     ▼
[ Resolver — separately-operated Cloud Run ]
     │
     │  Helius RPC (server-side)
     ▼
[ Solana devnet ]
     ├── Contention Markets v2.1   (settlement program — see cm-contract repo, currently private)
     ├── Magic Chess                (game program — separately-operated player surface)
     ├── Cyber Snake Duel           (game program — separately-operated player surface)
     └── Blockwords                 (game program — separately-operated player surface)
```

The settlement program (`cm-contract`) is currently private during pre-mainnet hardening. Source will be made public alongside the mainnet launch.

## Deploy

Auto-deployed on every push to `main` via Vercel. Custom domain `contention.markets` points at the Vercel project. **The deployed site is devnet-only** — `NEXT_PUBLIC_SOLANA_NETWORK=devnet` is the default and only currently-supported value.

## Disclaimer

This repository is published for transparency and review. It is **not** an offer of any service in any jurisdiction. Forking or operating this code is the operator's responsibility. The dashboard renders public on-chain data; it does not custody user funds. Wagering settlement is performed by the separate [`cm-contract`](https://github.com/contention-markets/cm-contract) Anchor program, currently private during pre-mainnet hardening. No mainnet deployment exists at the time of this commit.

## License

MIT

## Related

- [contention-markets/cm-contract](https://github.com/contention-markets/cm-contract) — the Anchor settlement program (private until mainnet)
- A separately-operated player surface where the underlying matches are played: https://gamerplex.com — different operator, different product, different repo. The two surfaces share only the on-chain oracle layer (the same game programs).
- Built for the [Colosseum Frontier hackathon](https://colosseum.com/frontier), May 2026.
