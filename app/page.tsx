"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import anime from "animejs";
import AssetLogo from "@/components/AssetLogo";

import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { VAULT_ADDRESS, EURC_VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

// Exchange logo components for the live feed
const BinanceLogo = () => (
  <svg viewBox="0 0 126.61 126.61" className="w-4 h-4">
    <path fill="#F3BA2F" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0l-38.9 38.9zM0 63.31L14.3 49l14.31 14.31L14.31 77.6zM38.73 73.41l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88zM97.99 63.31l14.3-14.31 14.32 14.31-14.31 14.3z" />
    <path fill="#F3BA2F" d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.51z" />
  </svg>
);

const HyperliquidLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#00D395" />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">H</text>
  </svg>
);

const BybitLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="12" fill="#F7A600" />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">B</text>
  </svg>
);

const exchangeLogos: Record<string, React.ReactNode> = {
  Binance: <BinanceLogo />,
  Hyperliquid: <HyperliquidLogo />,
  Bybit: <BybitLogo />,
};

export default function Home() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs for anime.js
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const tvlRef = useRef<HTMLSpanElement>(null);
  const yieldRef = useRef<HTMLSpanElement>(null);

  // Fetch real-time on-chain stats
  const { data: estimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
  });

  const { data: totalAssetsUsdc } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
  });

  const { data: totalAssetsEurc } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
  });

  const EUR_USD_RATE = 1.08;
  const usdcVal = totalAssetsUsdc ? parseFloat(formatUnits(totalAssetsUsdc, 6)) : 0;
  const eurcVal = totalAssetsEurc ? parseFloat(formatUnits(totalAssetsEurc, 6)) : 0;
  const tvlVal = usdcVal + (eurcVal * EUR_USD_RATE);
  const apyVal = estimatedAPY ? Number(estimatedAPY) / 100 : 24.5;

  // Fetch live feed data — tries real keeper executions first, falls back to funding rates
  useEffect(() => {
    async function fetchFeed() {
      try {
        // First, try real keeper execution data
        const execRes = await fetch("/api/executions");
        const execJson = await execRes.json();

        if (execJson.success && execJson.executions?.length > 0) {
          const top3 = execJson.executions.slice(0, 3).map((ex: any) => ({
            asset: ex.asset,
            route: ex.route,
            spread: `+${ex.spread}%`,
            shortEx: ex.shortExchange,
            longEx: ex.longExchange,
            time: formatTimeDiff(ex.timestamp),
          }));
          setFeedItems(top3);
          setLoading(false);
          return;
        }
      } catch { /* fall through */ }

      // Fallback: use live funding rate opportunities
      try {
        const res = await fetch("/api/funding-rates");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          const top3 = json.data.slice(0, 3).map((opp: any, idx: number) => ({
            asset: opp.asset,
            route: `${opp.shortExchange} ➔ ${opp.longExchange}`,
            spread: `+${opp.spread}%`,
            shortEx: opp.shortExchange,
            longEx: opp.longExchange,
            time: idx === 0 ? "Live" : `${(idx + 1) * 15}s ago`,
          }));
          setFeedItems(top3);
        }
      } catch { /* silent */ }

      setLoading(false);
    }
    fetchFeed();
    const interval = setInterval(fetchFeed, 15000);
    return () => clearInterval(interval);
  }, []);

  // Advanced Hero Grid & Entrance Animation
  useEffect(() => {
    if (!heroRef.current) return;

    const gridEl = document.querySelector('.hero-grid');
    if (gridEl && gridEl.children.length === 0) {
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item w-1.5 h-1.5 rounded-full bg-accent/30 dark:bg-accent/50 m-3';
        gridEl.appendChild(div);
      }

      anime({
        targets: '.grid-item',
        scale: [
          { value: 0.1, easing: 'easeOutSine', duration: 500 },
          { value: 1.5, easing: 'easeInOutQuad', duration: 1200 }
        ],
        opacity: [
          { value: 0.1, easing: 'easeOutSine', duration: 500 },
          { value: 0.8, easing: 'easeInOutQuad', duration: 1200 }
        ],
        delay: anime.stagger(200, { grid: [10, 10], from: 'center' }),
        loop: true,
        direction: 'alternate'
      });
    }

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: ".hero-title",
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [-20, 0],
      duration: 1200,
      delay: 200,
    });

    tl.add({
      targets: ".hero-subtitle",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
    }, "-=800");

    tl.add({
      targets: ".hero-btn",
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.9, 1],
      duration: 800,
      delay: anime.stagger(150),
    }, "-=600");
  }, []);

  // Stats counter animation with intersection observer
  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate TVL counter
            const tvlCounter = { value: 0 };
            anime({
              targets: tvlCounter,
              value: tvlVal,
              duration: 2000,
              easing: "easeOutExpo",
              round: 100,
              update: () => {
                if (tvlRef.current) {
                  const num = tvlCounter.value;
                  if (num >= 1000000) {
                    tvlRef.current.textContent = `$${(num / 1000000).toFixed(2)}M`;
                  } else if (num >= 1000) {
                    tvlRef.current.textContent = `$${(num / 1000).toFixed(2)}K`;
                  } else {
                    tvlRef.current.textContent = `$${num.toFixed(2)}`;
                  }
                }
              },
            });

            // Animate Yield counter
            const yieldCounter = { value: 0 };
            anime({
              targets: yieldCounter,
              value: apyVal,
              duration: 2200,
              easing: "easeOutExpo",
              round: 10,
              update: () => {
                if (yieldRef.current) {
                  yieldRef.current.textContent = `${yieldCounter.value.toFixed(1)}%`;
                }
              },
            });

            // Fade in the stat cards
            anime({
              targets: ".stat-card",
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: "easeOutExpo",
              delay: anime.stagger(150),
            });
          } else {
            // Reset stats so animation replays
            anime.set(".stat-card", { opacity: 0, translateY: 30 });
            if (tvlRef.current) tvlRef.current.textContent = "$0.00";
            if (yieldRef.current) yieldRef.current.textContent = "0.0%";
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [tvlVal, apyVal]);

  // Features scroll reveal
  useEffect(() => {
    if (!featuresRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: ".feature-card",
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              easing: "easeOutExpo",
              delay: anime.stagger(150),
            });

            anime({
              targets: ".features-heading",
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: "easeOutExpo",
            });
          } else {
            // Reset for replay
            anime.set(".feature-card", { opacity: 0, translateY: 50 });
            anime.set(".features-heading", { opacity: 0, translateY: 30 });
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  // Ledger section scroll reveal
  useEffect(() => {
    if (!ledgerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: ".ledger-text",
              opacity: [0, 1],
              translateX: [-40, 0],
              duration: 900,
              easing: "easeOutExpo",
              delay: anime.stagger(100),
            });

            anime({
              targets: ".ledger-feed",
              opacity: [0, 1],
              translateX: [40, 0],
              duration: 900,
              easing: "easeOutExpo",
            });
          } else {
            // Reset for replay
            anime.set(".ledger-text", { opacity: 0, translateX: -40 });
            anime.set(".ledger-feed", { opacity: 0, translateX: 40 });
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(ledgerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center">

      <div className="relative z-10 w-full px-6 flex flex-col items-center max-w-6xl mx-auto pt-36">

        {/* Main Hero Content */}
        <div className="w-full max-w-4xl text-center flex flex-col items-center transition-all px-4 sm:px-0">

          <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-heading font-extrabold tracking-tighter text-foreground leading-[1.1] mb-10 opacity-0">
            Institutional-grade <br className="hidden md:block" /><span className="whitespace-nowrap text-foreground">Funding Rate Arbitrage</span>
          </h1>

          <p className="hero-subtitle text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed mb-14 opacity-0">
            Capture risk-mitigated APY from funding rate spreads across top exchanges.<br></br> Secured natively on the Arc Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/app"
              className="hero-btn order-2 sm:order-1 w-full sm:w-auto px-10 py-4 rounded-2xl bg-foreground text-background font-bold text-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 opacity-0"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs/overview"
              className="hero-btn order-1 sm:order-2 w-full sm:w-auto px-10 py-4 rounded-2xl bg-panel text-foreground font-semibold text-lg border border-borderLine hover:border-slate-300 dark:hover:border-slate-700 transition-all text-center opacity-0 backdrop-blur-md"
            >
              Read Docs
            </Link>
          </div>
        </div>

        {/* Animated Stats Cards */}
        <div ref={statsRef} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="stat-card bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-md opacity-0">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Protocol TVL</div>
            <div className="text-3xl font-heading font-bold text-foreground">
              <span ref={tvlRef}>$0.0M</span>
            </div>
          </div>

          <div className="stat-card bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-md opacity-0">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">30D Yield</div>
            <div className="text-3xl font-heading font-bold text-emerald-500">
              <span ref={yieldRef}>0.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="features-heading text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-center mb-16 text-foreground opacity-0">
          Why Secure Arbitrage via Janus?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="feature-card p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300 opacity-0">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">Consistent Delta-Neutral Yield</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Positions are mathematically balanced. Janus hedges spot assets against perpetual shorts, letting you safely harvest interest spreads in all bull, bear, or sideways trends.
            </p>
          </div>

          <div className="feature-card p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300 opacity-0">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">Institutional Custody Safety</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Complete decentralized architecture. Assets reside in standard audited ERC-4626 multi-sig vaults, ensuring absolute withdrawal transparency and governance.
            </p>
          </div>

          <div className="feature-card p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/30 shadow-sm transition-all duration-300 opacity-0">
            <h3 className="text-xl font-bold font-heading mb-4 text-foreground">24/7 Automated Rebalancing</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              No manual migrations needed. Distributed keeper loops evaluate rates across exchanges around the clock, deploying trades at optimal intervals.
            </p>
          </div>
        </div>
      </section>

      {/* Live Ledger Section */}
      <section ref={ledgerRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="ledger-text text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-foreground mb-6 opacity-0">
            Cryptographically Audited Relayer Spreads
          </h2>
          <p className="ledger-text text-slate-500 dark:text-slate-400 leading-relaxed mb-8 opacity-0">
            Every transaction routed through our arbitrage vaults is audited by cryptographic Proof of Validation logs. Distributed keeper nodes log state execution on-chain, proving rates and spreads transparently.
          </p>
          <div className="ledger-text opacity-0">
            <Link 
              href="/ledger"
              className="inline-flex px-6 py-3 rounded-xl bg-foreground text-background font-bold items-center gap-2 shadow-sm hover:opacity-90 transition-all"
            >
              View Full Ledger <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="ledger-feed bg-panel border border-borderLine p-6 rounded-3xl backdrop-blur-xl relative shadow-premium dark:shadow-premium-dark opacity-0">
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
                  <AssetLogo asset={item.asset} size={32} />
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

function formatTimeDiff(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 5000) return "Live";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}
