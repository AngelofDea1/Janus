"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Code2, Cpu, Zap, Activity } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6 border border-accent/20">
            Developer Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tighter mb-6 text-foreground">
            Keeper API & Automation
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Run decentralized keeper nodes to earn MEV and execution rewards by automating Janus Protocol's delta-neutral arbitrage and funding rate harvests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-foreground">Run a Node</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Deploy our open-source keeper bot via Docker to automatically monitor on-chain state and execute profitable arbitrage opportunities.
            </p>
            <button className="px-6 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground font-semibold rounded-xl text-sm transition-colors border border-borderLine">
              View on GitHub
            </button>
          </div>

          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-foreground">Earn Bounties</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Keepers are compensated with a percentage of the yield harvested during rebalancing and liquidations. Guaranteed payout via atomic transactions.
            </p>
            <button className="px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-600 font-semibold rounded-xl text-sm transition-colors shadow-sm">
              View Bounty Structure
            </button>
          </div>
        </div>

        {/* API Endpoint Preview */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#161B22]">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-sm font-semibold text-slate-300">janus-keeper-sdk</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              <code>
<span className="text-purple-400">import</span> &#123; JanusKeeper &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'@janus-protocol/keeper-sdk'</span>;<br/><br/>
<span className="text-slate-500">{"// Initialize the keeper client connected to Arc Network"}</span><br/>
<span className="text-purple-400">const</span> keeper = <span className="text-purple-400">new</span> <span className="text-blue-400">JanusKeeper</span>(&#123;<br/>
&nbsp;&nbsp;rpcUrl: process.env.<span className="text-orange-400">ARC_RPC_URL</span>,<br/>
&nbsp;&nbsp;privateKey: process.env.<span className="text-orange-400">KEEPER_PK</span><br/>
&#125;);<br/><br/>
<span className="text-slate-500">{"// Listen for optimal rebalancing events"}</span><br/>
keeper.<span className="text-blue-400">on</span>(<span className="text-emerald-400">'ArbitrageOpportunity'</span>, <span className="text-purple-400">async</span> (event) =&gt; &#123;<br/>
&nbsp;&nbsp;<span className="text-purple-400">if</span> (event.expectedYield &gt; keeper.minProfitThreshold) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">{"// Execute atomic harvest"}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">const</span> tx = <span className="text-purple-400">await</span> keeper.<span className="text-blue-400">executeHarvest</span>(event.vaultId);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;console.<span className="text-blue-400">log</span>(<span className="text-emerald-400">`Harvest successful! TX: $&#123;tx.hash&#125;`</span>);<br/>
&nbsp;&nbsp;&#125;<br/>
&#125;);<br/><br/>
keeper.<span className="text-blue-400">start</span>();
              </code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
