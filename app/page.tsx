"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Exchange logo components
const BinanceLogo = () => (
  <svg viewBox="0 0 126.61 126.61" className="w-4 h-4">
    <path fill="#F3BA2F" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0l-38.9 38.9zM0 63.31L14.3 49l14.31 14.31L14.31 77.6zM38.73 73.41l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88zM97.99 63.31l14.3-14.31 14.32 14.31-14.31 14.3z"/>
    <path fill="#F3BA2F" d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.51z"/>
  </svg>
);

const HyperliquidLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#00D395"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">H</text>
  </svg>
);

const KuCoinLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#23AF91"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">K</text>
  </svg>
);

const BybitLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#F7A600"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">B</text>
  </svg>
);

const MEXCLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#2354E6"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">M</text>
  </svg>
);

const exchangeLogos: Record<string, React.ReactNode> = {
  Binance: <BinanceLogo />,
  Hyperliquid: <HyperliquidLogo />,
  KuCoin: <KuCoinLogo />,
  Bybit: <BybitLogo />,
  MEXC: <MEXCLogo />,
};

export default function Home() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch("/api/funding-rates");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          // Take the top 3 opportunities
          const top3 = json.data.slice(0, 3).map((opp: any, idx: number) => ({
            asset: opp.asset,
            route: `${opp.shortExchange} \u2794 ${opp.longExchange}`,
            spread: `+${opp.spread}%`,
            shortEx: opp.shortExchange,
            longEx: opp.longExchange,
            time: idx === 0 ? "Live" : `${(idx + 1) * 15}s ago`,
          }));
          setFeedItems(top3);
        }
      } catch (e) {
        // fallback silently
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-md">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Protocol TVL</div>
            <div className="text-3xl font-heading font-bold text-foreground">$148.9M</div>
          </div>
          
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-md">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">30D Yield</div>
            <div className="text-3xl font-heading font-bold text-emerald-500">28.9%</div>
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

      {/* Proof of Validation Ledger - LIVE Data */}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-heading text-sm text-foreground uppercase tracking-wider">
              Live Arbitrage Feed
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500">LIVE</span>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : feedItems.length > 0 ? (
              feedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-borderLine hover:border-accent/20 transition-colors">
                  <div className="p-1.5 rounded-lg bg-black dark:bg-[#1a1a1a] shadow-sm flex items-center justify-center shrink-0">
                    {exchangeLogos[item.shortEx] || <BinanceLogo />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-heading text-foreground">{item.asset}: {item.route}</span>
                      <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-500 mt-0.5">Spread: {item.spread}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-slate-500">Loading rates from exchanges...</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
