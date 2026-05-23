"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { 
  Wallet, 
  Activity, 
  TrendingUp,
  PieChart,
  History,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";
import Link from "next/link";

export default function PortfolioDashboard() {
  const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();
  const [localConnected, setLocalConnected] = useState(false);
  const [localAddress, setLocalAddress] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedConnected = localStorage.getItem("janus_wallet_connected") === "true";
      const savedAddress = localStorage.getItem("janus_wallet_address") || "";
      setLocalConnected(savedConnected);
      setLocalAddress(savedAddress);
    }
  }, []);

  const isConnected = wagmiIsConnected || localConnected;
  const address = (wagmiAddress || localAddress) as `0x${string}` | undefined;

  // Real Contract Data
  const { data: userShares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: userValue } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "userValue",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: estimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 10000 },
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32 pb-24 px-4">
        <div className="bg-panel border border-borderLine rounded-3xl p-12 shadow-premium dark:shadow-premium-dark backdrop-blur-xl text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3">Connect Wallet</h2>
          <p className="text-slate-500 mb-8">
            Connect your wallet to view your personalized Janus portfolio, current TVL, and yield projections.
          </p>
          <Link 
            href="/app"
            className="w-full inline-flex justify-center items-center py-4 rounded-2xl bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors"
          >
            Go to Terminal
          </Link>
        </div>
      </div>
    );
  }

  const formatNumber = (value: bigint | undefined, decimals: number = 6) => {
    if (!value) return "0.00";
    return parseFloat(formatUnits(value, decimals)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const apy = estimatedAPY ? Number(estimatedAPY) / 100 : 0;
  const valueFloat = userValue ? parseFloat(formatUnits(userValue, 6)) : 0;
  const dailyYield = (valueFloat * (apy / 100)) / 365;
  const monthlyYield = dailyYield * 30;

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter text-foreground mb-4">
              Your Portfolio
            </h1>
          </div>
          <Link 
            href="/app"
            className="px-6 py-3 rounded-xl bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accentHover transition-colors shadow-premium"
          >
            Deposit / Withdraw <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Main TVL Card */}
          <div className="lg:col-span-2 bg-panel border border-borderLine rounded-3xl p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Your Total Value Locked
                </div>
                <div className="text-5xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
                  ${formatNumber(userValue)}
                </div>
                <div className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                  Representing <span className="text-foreground font-mono font-bold">{formatNumber(userShares)}</span> Vault Shares
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-borderLine/50">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current APY</div>
                <div className="text-xl font-bold text-emerald-500">{apy.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Daily</div>
                <div className="text-xl font-bold text-foreground">+${dailyYield.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Monthly</div>
                <div className="text-xl font-bold text-foreground">+${monthlyYield.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                <div className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full inline-block mt-1">Earning</div>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-xl">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Strategy
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Your deposit is currently allocated across hyper-optimized delta-neutral funding rate arbitrage positions, capturing yield from continuous funding rounds.
              </p>
              <Link href="/analytics" className="text-sm font-semibold text-accent flex items-center gap-1 hover:underline">
                View Active Positions <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-xl">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Security & Insurance
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Your funds are protected by the Janus Protocol's automated risk management systems and a decentralized insurance fund backing all core vault assets.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History Placeholder */}
        <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-bold font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Activity
            </div>
          </div>
          
          {userShares && userShares > BigInt(0) ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-borderLine text-slate-500">
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Shares</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLine/50">
                  <tr>
                    <td className="py-4 font-medium text-foreground">Deposit</td>
                    <td className="py-4 font-mono text-slate-500">${formatNumber(userValue)}</td>
                    <td className="py-4 font-mono text-slate-500">{formatNumber(userShares)}</td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold">Confirmed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No recent activity found for this wallet.</p>
              <Link href="/app" className="text-accent font-semibold hover:underline">
                Make your first deposit
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
