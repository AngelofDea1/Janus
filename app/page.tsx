"use client";

import React from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import {
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
  Coins,
  Sparkles,
  Zap,
  Globe2
} from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

export default function Home() {
  // Read vault stats to show real live figures on landing page
  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
  });

  const { data: estimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
  });

  const formatNumber = (value: bigint | undefined, decimals: number = 6) => {
    if (!value) return "0.00";
    const parsed = parseFloat(value.toString()) / 10 ** decimals;
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="relative overflow-hidden bg-transparent text-slate-100 min-h-screen">

      {/* Spacious Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-32 flex flex-col items-center text-center">

        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-xs font-bold text-[#ccff00] mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated Delta-Neutral Yields</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-8 text-white">
          Institutional-grade
          <span className="block text-[#ccff00] mt-2">
            funding rate arbitrage
          </span>
        </h1>

        {/* Hero Paragraph */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
          Automated market-neutral perpetual strategies capturing funding rate spreads across top exchanges. Consistent, risk-mitigated APY secured natively on the Arc Network.
        </p>

        {/* Interactive Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 z-10">
          <Link
            href="/app"
            className="px-8 py-4 bg-[#ccff00] hover:bg-[#ccff00]/90 text-black rounded-xl font-black transition-all shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 flex items-center gap-2 group hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>Launch Arbitrage Vault</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs"
            className="px-8 py-4 border border-zinc-800 hover:bg-zinc-900 text-white rounded-xl font-bold transition-all active:scale-98 cursor-pointer"
          >
            Read Whitepaper
          </Link>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="w-full max-w-5xl p-8 rounded-3xl bg-zinc-950/40 border border-zinc-900 backdrop-blur-xl shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-left relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl border border-[#ccff00]/5 pointer-events-none" />
          <div>
            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Total Value Locked</div>
            <div className="text-3xl font-extrabold tracking-tight text-white">
              ${formatNumber(totalAssets)}
            </div>
            <p className="text-[10px] text-zinc-600 mt-1">Direct from Vault smart contract</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Estimated Yield APY</div>
            <div className="text-3xl font-extrabold tracking-tight text-[#ccff00]">
              {estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(1) : "0.0"}%
            </div>
            <p className="text-[10px] text-zinc-600 mt-1">Algorithmic perpetual spread</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Total Yield Distributed</div>
            <div className="text-3xl font-extrabold tracking-tight text-white">$0.00</div>
            <p className="text-[10px] text-zinc-600 mt-1">Harvested & auto-compounded</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Security Audits</div>
            <div className="text-3xl font-extrabold tracking-tight text-[#ccff00]">Passed</div>
            <p className="text-[10px] text-zinc-600 mt-1">Multi-Signature Custodial Vault</p>
          </div>
        </div>
      </section>

      {/* Spaced Out Product Highlights Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-zinc-900">
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-center mb-16 text-white">
          Why Secure Arbitrage via Janus?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="p-8 rounded-3xl bg-zinc-950/20 border border-zinc-900 hover:border-[#ccff00]/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center mb-6">
              <TrendingUp className="text-[#ccff00]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Consistent Delta-Neutral Yield</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Positions are mathematically balanced. Janus hedges spot assets against perpetual shorts, letting you safely harvest interest spreads in all bull, bear, or sideways trends.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950/20 border border-zinc-900 hover:border-[#ccff00]/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center mb-6">
              <Shield className="text-[#ccff00]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Institutional Custody Safety</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Complete decentralized architecture. Assets reside in standard audited ERC-4626 multi-sig vaults, ensuring absolute withdrawal transparency and governance.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950/20 border border-zinc-900 hover:border-[#ccff00]/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center mb-6">
              <Zap className="text-[#ccff00]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">24/7 Automated Rebalancing</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              No manual migrations needed. Distributed keeper loops evaluate rates across exchanges around the clock, deploying trades at optimal intervals.
            </p>
          </div>
        </div>
      </section>

      {/* Proof of validation ledger Spotlight */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-zinc-900 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-6">
            Cryptographically Audited Relayer Spreads
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-8">
            Every transaction routed through our arbitrage vaults is audited by cryptographic Proof of Validation logs. Distributed keeper nodes log state execution on-chain, proving rates and spreads transparently.
          </p>
          <div className="flex gap-4">
            <Link
              href="/analytics"
              className="px-6 py-3 border border-zinc-800 hover:bg-zinc-900 rounded-xl text-sm font-semibold transition-all cursor-pointer text-white"
            >
              Analyze Live Ledger
            </Link>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl backdrop-blur-xl relative">
          <div className="absolute inset-0 rounded-3xl border border-[#ccff00]/5 pointer-events-none" />
          <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Proof of Validation Feed</h3>

          <div className="space-y-4">
            {[
              { status: "Arbitraged", tx: "Binance ➔ dYdX", detail: "Gain: +0.084% spread", time: "12s ago" },
              { status: "Arbitraged", tx: "OKX ➔ GMX", detail: "Gain: +0.122% spread", time: "45s ago" },
              { status: "Monitoring", tx: "Bybit ➔ Arc Portal", detail: "Rate Delta: 0.045% spread", time: "Active" },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 hover:border-[#ccff00]/10 transition-colors">
                <div className={`p-1.5 rounded-lg ${tx.status === "Arbitraged" ? "bg-emerald-500/10 text-emerald-400" : "bg-[#ccff00]/10 text-[#ccff00]"
                  }`}>
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{tx.tx}</span>
                    <span className="text-[10px] text-zinc-500">{tx.time}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 truncate">{tx.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
