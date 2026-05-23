"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function KeeperApiPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">

      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-12 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tighter mb-6 text-foreground">
            Keeper API & Automation
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Run decentralized keeper nodes to earn execution rewards by automating Janus Protocol's delta-neutral arbitrage and funding rate harvests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl hover:border-accent/30 transition-colors">
            <h3 className="text-xl font-bold font-heading mb-3 text-foreground">Run a Node</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Deploy our open-source keeper bot via Docker to automatically monitor on-chain state and execute profitable arbitrage opportunities. Keepers are essential infrastructure that keep the protocol running efficiently.
            </p>
          </div>

          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl hover:border-accent/30 transition-colors">
            <h3 className="text-xl font-bold font-heading mb-3 text-foreground">Earn Rewards</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Keepers are compensated with a percentage of the yield harvested during rebalancing and liquidations. Guaranteed payout via atomic transactions ensures you are always rewarded for successful executions.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-8 md:p-12 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          <h2 className="text-2xl font-bold font-heading mb-8 text-foreground">How Keepers Work</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold font-heading text-sm">1</div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Monitor Funding Rates</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Keeper nodes continuously poll funding rates across supported exchanges (Binance, Bybit, Hyperliquid, KuCoin, MEXC) to detect spread opportunities that exceed the protocol's minimum profit threshold.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold font-heading text-sm">2</div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Execute Harvest</h4>
                <p className="text-sm text-slate-500 leading-relaxed">When a profitable opportunity is detected, the keeper submits a harvest transaction to the Janus Vault smart contract. The contract atomically rebalances positions and captures the funding rate spread.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold font-heading text-sm">3</div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Receive Compensation</h4>
                <p className="text-sm text-slate-500 leading-relaxed">A portion of the harvested yield is automatically distributed to the keeper as a reward. This incentivizes a decentralized network of operators to keep the protocol running 24/7 without any central dependency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-6">Interested in running a keeper node? Reach out to the core team for access to the SDK and deployment guides.</p>
          <Link
            href="https://discord.gg/janus"
            target="_blank"
            className="inline-flex px-8 py-4 rounded-2xl bg-accent text-white font-semibold hover:bg-accentHover shadow-premium hover:shadow-premium-hover transition-all active:scale-[0.98]"
          >
            Join Discord for Access
          </Link>
        </div>

      </div>
    </div>
  );
}
