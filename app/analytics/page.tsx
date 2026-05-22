"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  Lock, 
  Coins, 
  Shield, 
  Zap 
} from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";
import PredictiveEngine from "@/components/PredictiveEngine";

const volumeData = [
  { name: "Mon", volume: 1200000, transactions: 840 },
  { name: "Tue", volume: 1900000, transactions: 1200 },
  { name: "Wed", volume: 1600000, transactions: 980 },
  { name: "Thu", volume: 2400000, transactions: 1540 },
  { name: "Fri", volume: 3100000, transactions: 2100 },
  { name: "Sat", volume: 2800000, transactions: 1890 },
  { name: "Sun", volume: 3800000, transactions: 2600 },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: estimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 animate-pulse">
          <Activity className="w-8 h-8 text-accent" />
          <div className="absolute inset-0 rounded-full border border-accent/30 animate-ping opacity-75" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors py-16 sm:py-24 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Title */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold font-heading tracking-tight text-foreground mb-4">
            Protocol Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Analyze historical compound metrics and monitor the live predictive funding rate engine.
          </p>
        </div>

        {/* AI Predictive Engine */}
        <PredictiveEngine />

        {/* Big spacious chart card */}
        <div className="bg-panel border border-borderLine p-8 rounded-3xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-bold text-lg text-foreground">Compound Arbitrage Volume</h3>
              <p className="text-sm text-slate-500 mt-1">Weekly volume securely routed by Janus bots</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              USD Principal
            </span>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.95)", 
                    border: "none", 
                    borderRadius: "16px", 
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spacious Stats Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* APY Metrics Card */}
          <div className="p-8 bg-panel border border-borderLine rounded-3xl shadow-sm space-y-6">
            <h4 className="font-bold text-lg text-foreground">
              Historical Yield Stats
            </h4>
            <div className="space-y-4">
              {[
                { period: "Current Live Estimated APY", value: `${estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(1) : "0.0"}%`, bold: true },
                { period: "Last 7 Days Average APY", value: "32.4%" },
                { period: "Last 30 Days Average APY", value: "28.9%" },
                { period: "All-Time Highest Peak APY", value: "54.2%" },
                { period: "Keeper Daily Yield Multiplier", value: "0.088%" },
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-borderLine/50 text-sm">
                  <span className="text-slate-500 font-medium">{stat.period}</span>
                  <span className={`font-semibold ${stat.bold ? "text-emerald-500 text-lg" : "text-foreground"}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vault Mechanics Card */}
          <div className="p-8 bg-panel border border-borderLine rounded-3xl shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-foreground">
                Vault Mechanics Summary
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Janus Vault holds stable assets such as USDC. When deposits are requested, our keeper contract automatically allocates funds across low-risk, delta-neutral pools to lock in highest available yield.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                The vault standard conforms strictly to the ERC-4626 Tokenized Vaults standard. When depositing USDC, users receive JANUS vault shares. The exchange rate between USDC and JANUS shares grows linearly over time as yield is compounded back into the vault assets.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs font-semibold pt-6 border-t border-borderLine/50 mt-6">
              <span className="px-3 py-1.5 bg-accent/10 text-accent rounded-full">
                ERC-4626 Standard
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                Delta-Neutral Principal
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
