"use client";

import React from "react";
import { 
  Shield, 
  Zap, 
  Coins, 
  BookOpen, 
  ArrowRight,
  TrendingUp 
} from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 transition-colors py-16 sm:py-24">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/5 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/5 dark:bg-violet-900/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Title */}
        <div className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800/60">
          <div className="inline-flex items-center gap-2 text-indigo-500 font-extrabold text-sm uppercase tracking-wider">
            <span>Developer Documentation Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Janus Technical Specification
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Institutional Delta-Neutral Funding Rate Arbitrage on Arc Network.
          </p>
        </div>

        {/* Spacious Alert Box */}
        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/10 text-indigo-800 dark:text-indigo-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>Audit State: Fully Passed & Mainnet Ready</span>
          </div>
          <p className="text-xs text-indigo-900/70 dark:text-indigo-400/80 leading-relaxed">
            The standard ERC-4626 multi-sig vault contracts have passed security auditing, validating custodian protection, trade engine balancing, and withdrawal guarantees.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4 pt-4">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            1. Core Arbitrage Engine Strategy
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            The protocol exploits funding rate premium anomalies between Spot assets and Perpetual derivatives contracts. When perpetual markets trade at a premium, long perpetual positions pay short perpetual positions an interest fee every 1-8 hours. By hedging the underlying spot asset using short perpetual swaps, Janus secures net-positive interest spreads without price exposure.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            This delta-neutral design guarantees capital preservation during aggressive market trends, turning volatile price fluctuations into risk-mitigated compounding yields.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 pt-4">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            2. Algorithmic Keeper Bots
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            A globally distributed keeper relay actively monitors perpetual funding intervals around the clock. The automated keepers initiate rebalancing transactions to instantly migrate vault liquidity across dYdX, OKX, GMX, and Bybit whenever rate differentials open up, securing maximal compound rewards dynamically.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 pt-4">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            3. ERC-4626 Vault Architecture
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            The pool conforms strictly to the standard **ERC-4626 Tokenized Vaults Standard**. Upon deposit of USDC principal, users are minted `JANUS` shares. As interest gains are harvested and compounded back into the pool assets, the conversion rate grows linearly, ensuring transparent liquidity and withdrawal parity.
          </p>
        </section>

        {/* CTA Banner */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Ready to begin yield capture?</h4>
            <p className="text-xs text-slate-500 mt-1">Join institutional allocators executing delta-neutral spreads.</p>
          </div>
          <Link 
            href="/app" 
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group text-sm"
          >
            <span>Launch Arbitrage Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
