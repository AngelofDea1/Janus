"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Activity,
  Shield,
  RefreshCw,
  Lock,
  ChevronDown,
} from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import AssetLogo from "@/components/AssetLogo";

import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { VAULT_ADDRESS, EURC_VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

import { Pill } from "@/components/landing/Pill";

// Dynamically import GL to avoid SSR issues with Three.js
const GL = dynamic(() => import("@/components/gl").then((mod) => ({ default: mod.GL })), {
  ssr: false,
});

// --- Animated Counter Component ---
function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isM = false,
  decimals = 1,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isM?: boolean;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            if (isM) {
              const display =
                latest >= 1000000
                  ? (latest / 1000000).toFixed(2) + "M"
                  : latest >= 1000
                    ? (latest / 1000).toFixed(2) + "K"
                    : latest.toFixed(2);
              ref.current.textContent = `${prefix}${display}${suffix}`;
            } else {
              ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
            }
          }
        },
      });
    }
  }, [isInView, value, prefix, suffix, isM, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function Home() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
  const usdcVal = totalAssetsUsdc ? parseFloat(formatUnits(totalAssetsUsdc, 6)) : 3770;
  const eurcVal = totalAssetsEurc ? parseFloat(formatUnits(totalAssetsEurc, 6)) : 0;
  const tvlVal = usdcVal + eurcVal * EUR_USD_RATE;
  const apyVal = estimatedAPY ? Number(estimatedAPY) / 100 : 32.4;

  const cleanAssetSymbol = (symbol: string) => {
    return symbol
      .toUpperCase()
      .replace(/-PERP$/i, "")
      .replace(/^1000/i, "")
      .replace(/_?USDT$/i, "")
      .replace(/_?USDC$/i, "")
      .trim();
  };

  // Fetch live feed data
  useEffect(() => {
    async function fetchFeed() {
      try {
        const execRes = await fetch("/api/executions");
        const execJson = await execRes.json();
        if (execJson.success && execJson.executions?.length > 0) {
          const top3 = execJson.executions.slice(0, 3).map((ex: any) => ({
            asset: ex.asset,
            route: ex.route,
            spread: formatSpread(ex.spread),
            time: formatTimeDiff(ex.timestamp),
          }));
          setFeedItems(top3);
          setLoading(false);
          return;
        }
      } catch {
        /* fall through */
      }

      try {
        const res = await fetch("/api/funding-rates");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          const top3 = json.data.slice(0, 3).map((opp: any, idx: number) => ({
            asset: opp.asset,
            route: `${opp.shortExchange} ➔ ${opp.longExchange}`,
            spread: formatSpread(opp.spread),
            time: idx === 0 ? "Live" : `${(idx + 1) * 15}s ago`,
          }));
          setFeedItems(top3);
        }
      } catch {
        /* silent */
      }
      setLoading(false);
    }
    fetchFeed();
    const interval = setInterval(fetchFeed, 15000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } },
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-accent selection:text-white">
      {/* WebGL Particle Background */}
      <GL hovering={hovering} isDark={isDark} />

      {/* ══════════════════════════════════════════════════ */}
      {/*  HERO — Full viewport, content at bottom center  */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col h-svh justify-end items-center">
        <div className="pb-16 md:pb-20 text-center px-6 max-w-3xl mx-auto">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 flex justify-center"
          >
            <Pill>Live on Arc Testnet</Pill>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.15] text-foreground text-balance"
          >
            Institutional-grade Funding Rate Arbitrage
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed mt-6"
          >
            Capture risk-mitigated APY from funding rate spreads across top exchanges.<br />
            Secured natively on the Arc Network.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="flex flex-row gap-4 justify-center mt-12"
          >
            <Link href="/docs">
              <button className="px-6 py-3 bg-transparent border border-borderLine hover:bg-foreground/[0.03] text-foreground font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.05)] active:translate-y-[4px] active:shadow-none">
                Read Docs
              </button>
            </Link>
            <Link href="/app">
              <button
                className="group px-6 py-3 bg-foreground text-background font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90 flex items-center gap-2"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                Launch App
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="pb-8 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  BELOW THE FOLD — Stats, Features, Feed          */}
      {/* ══════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          {/* Bento Stats Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid md:grid-cols-2 gap-6 mb-24 max-w-2xl mx-auto w-full"
          >
            {/* TVL Card */}
            <motion.div
              variants={fadeUp}
              className="bg-panel border border-borderLine rounded-2xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col items-center justify-center text-center"
            >
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Protocol TVL
              </div>
              <div className="text-3xl font-heading font-bold text-foreground">
                <AnimatedCounter value={tvlVal} prefix="$" isM={true} />
              </div>
            </motion.div>

            {/* Yield Card */}
            <motion.div
              variants={fadeUp}
              className="bg-panel border border-borderLine rounded-2xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col items-center justify-center text-center"
            >
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                30D Yield
              </div>
              <div className="text-3xl font-heading font-bold text-emerald-500">
                <AnimatedCounter value={apyVal} suffix="%" decimals={1} />
              </div>
            </motion.div>
          </motion.div>

          {/* Why Secure Arbitrage Feature Section */}
          <div className="mb-28" id="why-janus">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Why Secure Arbitrage via Janus?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                Fully decentralized, mathematically balanced yields secured by
                audited ERC-4626 multi-sig vaults.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {/* Consistent Delta-Neutral Yield */}
              <div className="bg-panel border border-borderLine hover:border-accent/30 rounded-2xl p-7 transition-all duration-300 hover:shadow-premium dark:hover:shadow-premium-dark group">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2 sm:whitespace-nowrap">
                  Consistent Delta-Neutral Yield
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Positions are mathematically balanced. Janus hedges spot
                  assets against perpetual shorts, letting you safely harvest
                  interest spreads in all bull, bear, or sideways trends.
                </p>
              </div>

              {/* Institutional Custody Safety */}
              <div className="bg-panel border border-borderLine hover:border-accent/30 rounded-2xl p-7 transition-all duration-300 hover:shadow-premium dark:hover:shadow-premium-dark group">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2 sm:whitespace-nowrap">
                  Institutional Custody Safety
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Complete decentralized architecture. Assets reside in
                  standard audited ERC-4626 multi-sig vaults, ensuring
                  absolute withdrawal transparency and governance.
                </p>
              </div>

              {/* 24/7 Automated Rebalancing */}
              <div className="bg-panel border border-borderLine hover:border-accent/30 rounded-2xl p-7 transition-all duration-300 hover:shadow-premium dark:hover:shadow-premium-dark group">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2 sm:whitespace-nowrap">
                  24/7 Automated Rebalancing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  No manual migrations needed. Distributed keeper loops
                  evaluate rates across exchanges around the clock, deploying
                  trades at optimal intervals.
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Section: Relayer Spreads (Left) & Live Feed (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto mt-16">
            {/* Left Column: Cryptographically Audited Relayer Spreads */}
            <div className="flex flex-col justify-center h-full pr-0 md:pr-4">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Cryptographically Audited Relayer Spreads
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                Every transaction routed through our arbitrage vaults is
                audited by cryptographic Proof of Validation logs. Distributed
                keeper nodes log state execution on-chain, proving rates
                and spreads transparently.
              </p>
              <div>
                <Link href="/ledger">
                  <button className="px-6 py-3 bg-foreground text-background font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90">
                    View Full Ledger &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Arbitrage Feed Container */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="bg-panel border border-borderLine rounded-2xl p-6 shadow-premium dark:shadow-premium-dark w-full"
            >
              <div className="flex items-center justify-between mb-6 border-b border-borderLine pb-4">
                <div>
                  <h3 className="font-bold font-heading text-lg text-foreground">
                    Live Arbitrage Feed
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Real-time cross-exchange spreads captured by keeper loops.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-borderLine/50">
                {loading ? (
                  <div className="space-y-3 py-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse"
                      />
                    ))}
                  </div>
                ) : feedItems.length > 0 ? (
                  feedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-200 gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {(() => {
                          const exchanges = item.route.split("➔").map((ex: string) => ex.trim());
                          if (exchanges.length === 2) {
                            return (
                              <div className="flex items-center -space-x-2 shrink-0">
                                <AssetLogo
                                  asset={exchanges[0]}
                                  size={28}
                                  className="shadow-sm border border-white dark:border-slate-900 rounded-full relative z-10"
                                />
                                <AssetLogo
                                  asset={exchanges[1]}
                                  size={28}
                                  className="shadow-sm border border-white dark:border-slate-900 rounded-full relative z-0"
                                />
                              </div>
                            );
                          }
                          return <AssetLogo asset={item.asset} size={36} className="shadow-sm border border-slate-100 dark:border-white/5" />;
                        })()}
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            {item.asset}
                            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                              active
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
                            {item.route}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 text-right">
                        <div className="text-sm font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                          {item.spread}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-slate-500">
                    Loading live execution data...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
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

function formatSpread(spread: string | number): string {
  const s = String(spread).trim();
  const hasSign = s.startsWith("+") || s.startsWith("-");
  const hasPercent = s.endsWith("%");
  return `${hasSign ? "" : "+"}${s}${hasPercent ? "" : "%"}`;
}
