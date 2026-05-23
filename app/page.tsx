import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center">
      
      {/* Subtle Premium Background Mesh */}
      <div className="absolute top-[15%] left-[25%] w-[35%] h-[45%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Main Glassmorphic Hero Panel */}
        <div className="bg-panel border border-borderLine rounded-[40px] p-10 md:p-16 shadow-premium dark:shadow-premium-dark backdrop-blur-xl w-full max-w-4xl text-center flex flex-col items-center transition-all">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-8 border border-accent/20">
            Automated Delta-Neutral Yields
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold tracking-tighter text-foreground leading-[1.1] mb-6">
            Institutional-grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet-500">funding rate arbitrage</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-10">
            Automated market-neutral perpetual strategies capturing funding rate spreads across top exchanges. Consistent, risk-mitigated APY secured natively on the Arc Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/app" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accentHover shadow-premium hover:shadow-premium-hover transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/docs" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-black/5 dark:bg-[#09090b] text-foreground font-semibold text-lg border border-borderLine hover:border-slate-300 dark:hover:border-slate-700 transition-all text-center"
            >
              Read Docs
            </Link>
          </div>
        </div>

        {/* Abstract Metrics - Floating Info Cards Below Hero */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm flex items-center justify-between backdrop-blur-md">
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Protocol TVL</div>
              <div className="text-3xl font-heading font-bold text-foreground">$148.9M</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm flex items-center justify-between backdrop-blur-md">
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">30D Yield</div>
              <div className="text-3xl font-heading font-bold text-emerald-500">28.9%</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Out Product Highlights Grid */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-center mb-16 text-foreground">
          Why Secure Arbitrage via Janus?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">Consistent Delta-Neutral Yield</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Positions are mathematically balanced. Janus hedges spot assets against perpetual shorts, letting you safely harvest interest spreads in all bull, bear, or sideways trends.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">Institutional Custody Safety</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Complete decentralized architecture. Assets reside in standard audited ERC-4626 multi-sig vaults, ensuring absolute withdrawal transparency and governance.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">24/7 Automated Rebalancing</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              No manual migrations needed. Distributed keeper loops evaluate rates across exchanges around the clock, deploying trades at optimal intervals.
            </p>
          </div>
        </div>
      </section>

      {/* Proof of validation ledger Spotlight */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-foreground mb-6">
            Cryptographically Audited Relayer Spreads
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Every transaction routed through our arbitrage vaults is audited by cryptographic Proof of Validation logs. Distributed keeper nodes log state execution on-chain, proving rates and spreads transparently.
          </p>
          <div className="flex gap-4">
            <Link
              href="/analytics"
              className="px-6 py-3 border border-borderLine hover:border-slate-400 dark:hover:border-slate-600 bg-panel rounded-xl text-sm font-semibold transition-all cursor-pointer text-foreground shadow-sm"
            >
              Analyze Live Ledger
            </Link>
          </div>
        </div>

        <div className="bg-panel border border-borderLine p-6 rounded-3xl backdrop-blur-xl relative shadow-premium dark:shadow-premium-dark">
          <h3 className="font-bold font-heading text-sm text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            Proof of Validation Feed
          </h3>

          <div className="space-y-4">
            {[
              { 
                status: "Arbitraged", 
                tx: "Binance ➔ dYdX", 
                detail: "Gain: +0.084% spread", 
                time: "12s ago",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#FCD535">
                    <path d="M12.001 5.289l2.894 2.893 2.257-2.256L12.001.775 6.85 5.926l2.257 2.256 2.894-2.893zm0 13.422l-2.894-2.893-2.257 2.256 5.151 5.151 5.151-5.151-2.257-2.256-2.894 2.893zM3.468 9.544l-2.693 2.693 2.693 2.693 2.257-2.257-2.693-2.693-2.257-2.257L3.468 9.544zm17.064 0l-2.257 2.257 2.693 2.693-2.693 2.693 2.257 2.257 2.693-2.693-2.693-2.693 2.693-2.693-2.693-2.693zm-8.531 6.136l3.682-3.682-3.682-3.681-3.681 3.681 3.681 3.682z"/>
                  </svg>
                )
              },
              { 
                status: "Arbitraged", 
                tx: "OKX ➔ GMX", 
                detail: "Gain: +0.122% spread", 
                time: "45s ago",
                icon: (
                  <svg viewBox="0 0 32 32" className="w-4 h-4">
                    <path fill="#fff" d="M16 2.667a13.333 13.333 0 100 26.666A13.333 13.333 0 0016 2.667zm-3.333 18.666L8 16l4.667-5.333h2.666L10.667 16l4.666 5.333h-2.666zm9.333 0l-4.667-5.333L22 10.667h-2.666L14.667 16l4.666 5.333H22z" />
                  </svg>
                )
              },
              { 
                status: "Monitoring", 
                tx: "Bybit ➔ Arc Portal", 
                detail: "Rate Delta: 0.045% spread", 
                time: "Active",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F7A600">
                    <path d="M12 0l4.316 7.474L24 12l-7.684 4.526L12 24l-4.316-7.474L0 12l7.684-4.526z" />
                  </svg>
                )
              },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-borderLine hover:border-accent/20 transition-colors">
                <div className={`p-1.5 rounded-lg bg-black dark:bg-[#1a1a1a] shadow-sm flex items-center justify-center`}>
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-heading text-foreground">{tx.tx}</span>
                    <span className="text-[10px] font-mono text-slate-500">{tx.time}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 truncate">{tx.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
