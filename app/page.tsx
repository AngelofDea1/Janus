"use client";

import React from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import {
  ArrowRight,
  ShieldAlert,
  Terminal,
  Zap,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

export default function Home() {
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
    <div className="min-h-screen bg-transparent text-black dark:text-white pb-20">

      {/* Hero Header Block */}
      <section className="border-b border-black/10 dark:border-white/10">
        <div className="grid lg:grid-cols-2">
          
          <div className="p-8 md:p-16 lg:p-24 border-r border-black/10 dark:border-white/10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] uppercase tracking-widest font-bold self-start mb-8">
              <Terminal className="w-3 h-3" />
              <span>System Operational</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter leading-[0.9] uppercase mb-8">
              Yield <br />
              <span className="text-zinc-400 dark:text-zinc-600">Arbitrage</span><br />
              Protocol
            </h1>
            
            <p className="font-mono text-sm leading-relaxed max-w-md text-zinc-600 dark:text-zinc-400 mb-12 uppercase tracking-wide">
              Automated market-neutral perpetual strategies capturing funding rate spreads across global exchanges. Risk-mitigated execution secured natively on the Arc Network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/app"
                className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Initialize Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 border border-black dark:border-white font-mono text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center text-center"
              >
                View Documentation
              </Link>
            </div>
          </div>
          
          <div className="grid grid-rows-4 border-t lg:border-t-0 border-black/10 dark:border-white/10">
            {[
              { label: "Total Value Locked (TVL)", val: `$${formatNumber(totalAssets)}`, sub: "Direct from Vault smart contract" },
              { label: "Current Est. APY", val: `${estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(2) : "0.00"}%`, sub: "Algorithmic perpetual spread" },
              { label: "Distributed Yield", val: "$0.00", sub: "Harvested & auto-compounded" },
              { label: "Network Security", val: "VERIFIED", sub: "Multi-Signature Custodial Vault" }
            ].map((metric, idx) => (
              <div key={idx} className="p-8 border-b border-black/10 dark:border-white/10 flex flex-col justify-center last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  {metric.label}
                </div>
                <div className="font-heading text-4xl lg:text-5xl font-black tracking-tighter">
                  {metric.val}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-2">
                  // {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Features Grid */}
      <section className="border-b border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950">
        <div className="p-8 border-b border-black/10 dark:border-white/10">
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
            System Capabilities
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3">
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-black transition-colors group">
            <div className="w-10 h-10 border border-black dark:border-white flex items-center justify-center mb-8 bg-black text-white dark:bg-white dark:text-black group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-2xl font-black uppercase mb-4 tracking-tight">Delta-Neutral</h3>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase">
              Positions are mathematically balanced. Hedged spot assets against perpetual shorts harvest interest spreads in all market trends.
            </p>
          </div>
          
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-black transition-colors group">
            <div className="w-10 h-10 border border-black dark:border-white flex items-center justify-center mb-8 bg-black text-white dark:bg-white dark:text-black group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-2xl font-black uppercase mb-4 tracking-tight">Custody Safety</h3>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase">
              Decentralized architecture. Assets reside in standard ERC-4626 multi-sig vaults, ensuring absolute withdrawal transparency.
            </p>
          </div>

          <div className="p-8 md:p-12 hover:bg-white dark:hover:bg-black transition-colors group">
            <div className="w-10 h-10 border border-black dark:border-white flex items-center justify-center mb-8 bg-black text-white dark:bg-white dark:text-black group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-2xl font-black uppercase mb-4 tracking-tight">Auto-Rebalance</h3>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase">
              No manual migrations. Distributed keeper loops evaluate rates across exchanges 24/7, deploying trades at optimal intervals.
            </p>
          </div>
        </div>
      </section>

      {/* Ledger Audit Section */}
      <section className="grid lg:grid-cols-2">
        <div className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-black/10 dark:border-white/10 flex flex-col justify-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6">
            Cryptographic<br />Validation Feed
          </h2>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 uppercase tracking-wide">
            Every transaction routed through our arbitrage vaults is audited by cryptographic Proof of Validation logs. Distributed keeper nodes log state execution on-chain, proving rates and spreads.
          </p>
          <Link
            href="/analytics"
            className="self-start px-6 py-3 border border-black dark:border-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
          >
            Access Ledger
          </Link>
        </div>

        <div className="bg-black text-white dark:bg-white dark:text-black p-8 md:p-12 font-mono flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8 border-b border-white/20 dark:border-black/20 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest">Live Execution Stream</span>
            <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-0 border border-white/20 dark:border-black/20">
            {[
              { status: "EXECUTED", tx: "BINANCE <> DYDX", detail: "GAIN_SPREAD_+0.084%", time: "T-12s", color: "text-emerald-500 dark:text-emerald-600" },
              { status: "EXECUTED", tx: "OKX <> GMX", detail: "GAIN_SPREAD_+0.122%", time: "T-45s", color: "text-emerald-500 dark:text-emerald-600" },
              { status: "SCANNING", tx: "BYBIT <> ARC_PORTAL", detail: "RATE_DELTA_0.045%", time: "ACTIVE", color: "text-zinc-400 dark:text-zinc-500" },
            ].map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between p-4 border-b border-white/20 dark:border-black/20 last:border-b-0 text-xs uppercase hover:bg-white/5 dark:hover:bg-black/5 transition-colors">
                <div className="flex gap-4 mb-2 sm:mb-0">
                  <span className={`font-bold ${log.color}`}>[{log.status}]</span>
                  <span className="tracking-wider">{log.tx}</span>
                </div>
                <div className="flex justify-between sm:gap-8 text-zinc-400 dark:text-zinc-500">
                  <span>{log.detail}</span>
                  <span className="text-right w-16">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
