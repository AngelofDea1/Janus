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

  const formatNumber = (value: bigint | undefined, decimals: number = 6) => {
    if (!value) return "0.00";
    const parsed = parseFloat(value.toString()) / 10 ** decimals;
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center font-mono text-black dark:text-white">
        <div className="border border-black dark:border-white p-8 max-w-sm text-center">
          <Activity className="w-8 h-8 mb-4 mx-auto animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2">
            Loading_Neural_Metrics
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Awaiting data stream...
          </p>
          <div className="w-full h-1 bg-black/10 dark:bg-white/10 relative">
            <div className="absolute top-0 left-0 h-full bg-black dark:bg-white w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white font-mono p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="border-b border-black/10 dark:border-white/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase mb-2">
            Analytics_Dashboard
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
            Protocol historical compound metrics & live ML neural engine
          </p>
        </div>

        {/* AI Predictive Engine */}
        <PredictiveEngine />

        {/* Big spacious chart card */}
        <div className="border border-black/10 dark:border-white/10 bg-white dark:bg-black p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Compound Arbitrage Volume</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Weekly volume routed by Janus keeper bots</p>
            </div>
            <span className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest">
              USD Principal
            </span>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 120, 120, 0.2)" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} tickFormatter={(val) => val.toUpperCase()} />
                <YAxis 
                  stroke="#888" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#000", 
                    border: "1px solid #333", 
                    borderRadius: "0px", 
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    textTransform: "uppercase"
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Area type="step" dataKey="volume" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spacious Stats Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* APY Metrics Card */}
          <div className="p-8 border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-4">
              Yield_Statistics
            </h4>
            <div className="space-y-0 text-xs">
              {[
                { period: "Live Estimated APY", value: `${estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(1) : "0.0"}%`, highlight: true },
                { period: "Last 7 Days Average APY", value: "32.4%" },
                { period: "Last 30 Days Average APY", value: "28.9%" },
                { period: "All-Time Highest Peak APY", value: "54.2%" },
                { period: "Keeper Daily Multiplier", value: "0.088%" },
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-2">
                  <span className="text-zinc-500 uppercase tracking-widest">{stat.period}</span>
                  <span className={`font-bold ${stat.highlight ? "text-emerald-500 text-sm" : ""}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vault Mechanics Card */}
          <div className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-4">
                Vault_Mechanics
              </h4>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase tracking-widest">
                Janus Vault holds stable assets such as USDC. When deposits are requested, our keeper contract automatically allocates funds across low-risk, delta-neutral pools to lock in highest available yield.
              </p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase tracking-widest">
                The vault standard conforms strictly to the ERC-4626 Tokenized Vaults standard. When depositing USDC, users receive JANUS vault shares. The exchange rate between USDC and JANUS shares grows linearly over time as yield is compounded back into the vault assets.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-black/10 dark:border-white/10 mt-6">
              <span className="px-3 py-1.5 border border-black/20 dark:border-white/20 text-emerald-500">
                ERC-4626 Valid
              </span>
              <span className="px-3 py-1.5 border border-black/20 dark:border-white/20 text-emerald-500">
                Delta-Neutral
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
