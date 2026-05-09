import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppWalletProvider from "./AppWalletProvider";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://contention.markets"),
  title: "Contention.markets — On-chain Skill Contests",
  description:
    "Pari-mutuel skill contests on fully on-chain games — Magic Chess, Cyber Snake Duel, Blockwords. Back a contestant, settle trustlessly against the game program itself. No counterparty bookmaker, no oracle committee, no dispute window.",
  applicationName: "Contention.markets",
  keywords: ["solana", "skill contest", "magic chess", "on-chain", "DFS", "backer", "pari-mutuel"],
  openGraph: {
    title: "Contention.markets",
    description: "On-chain skill contests on fully on-chain games. Trustless settlement.",
    type: "website",
    url: "https://contention.markets",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="notranslate" translate="no">
      <body className="font-sans antialiased">
        <AppWalletProvider>
          <div className="content min-h-screen flex flex-col">
            <TopNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppWalletProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[12px]">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center">
              <span className="font-mono font-bold text-[11px] text-black">C</span>
            </div>
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/65">CONTENTION.MARKETS</span>
          </div>
          <p className="text-white/40 leading-relaxed max-w-md">
            The backer surface for fully on-chain games. Pari-mutuel skill contests, settled trustlessly against the game programs themselves. <a href="https://gamerplex.com" target="_blank" rel="noopener" className="text-white/70 hover:text-white">Want to play instead? →</a> <span className="text-white/30">(separate operator)</span>
          </p>
        </div>
        <div>
          <div className="text-white/35 uppercase tracking-widest text-[10px] mb-3 font-mono">Surface</div>
          <ul className="space-y-1.5 text-white/55">
            <li><a href="/markets" className="hover:text-white">Skill Contests</a></li>
            <li><a href="/leaderboard" className="hover:text-white">Backer Rank</a></li>
            <li><a href="/portfolio" className="hover:text-white">Portfolio</a></li>
          </ul>
        </div>
        <div>
          <div className="text-white/35 uppercase tracking-widest text-[10px] mb-3 font-mono">Resources</div>
          <ul className="space-y-1.5 text-white/55">
            <li><a href="/docs" className="hover:text-white">Documentation</a></li>
            <li><a href="https://gamerplex.com" className="hover:text-white" target="_blank" rel="noopener">Player surface ↗</a></li>
            <li><a href="https://solscan.io" className="hover:text-white" target="_blank" rel="noopener">Solscan</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between text-[10.5px] font-mono text-white/35">
          <span>© 2026 contention.markets · Operating entity TBA · Software MIT-licensed · Built on Solana</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb800] animate-pulse" />
            DEVNET · skill-contest pre-counsel · play-money only
          </span>
        </div>
      </div>
    </footer>
  );
}
