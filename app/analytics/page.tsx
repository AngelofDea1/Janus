"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Activity } from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";
import ProfitCalculator from "@/components/ProfitCalculator";
import MarketMonitor from "@/components/MarketMonitor";

const volumeData = [
  { name: "Mon", volume: 1200000 },
  { name: "Tue", volume: 1900000 },
  { name: "Wed", volume: 1600000 },
  { name: "Thu", volume: 2400000 },
  { name: "Fri", volume: 3100000 },
  { name: "Sat", volume: 2800000 },
  { name: "Sun", volume: 3800000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

    return (
      <div className="bg-panel border border-borderLine rounded-2xl p-4 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
        <p className="text-slate-500 font-medium text-xs uppercase tracking-widest mb-1">{label} Volume</p>
        <p className="text-accent font-heading font-bold text-2xl">{formattedValue}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: estimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: totalSupply } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalSupply",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const formatLargeNumber = (value: bigint | undefined) => {
    if (!value) return "0.00";
    const num = parseFloat(formatUnits(value, 6));
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[30%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter text-foreground mb-4">
            Analytics Overview
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Real-time insights and automated intelligence from the Janus arbitrage engine.
          </p>
        </div>

        {/* Floating Borderless Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Live APY
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-emerald-500">
              {estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(1) : "0.0"}%
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Total TVL
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              ${formatLargeNumber(totalAssets as bigint | undefined)}
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Active Keepers
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {totalAssets && totalAssets > BigInt(0) ? "1" : "0"}
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Vault Shares
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/70 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {formatLargeNumber(totalSupply as bigint | undefined)}
            </div>
          </div>
        </div>

        {/* Minimal Chart Section */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-6 md:p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-bold text-2xl text-foreground">Compound Volume</h3>
            <span className="bg-accent/10 text-accent font-semibold text-sm px-3 py-1 rounded-full border border-accent/20">USD Principal</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Market Monitor */}
        <div className="w-full">
          <MarketMonitor />
        </div>

        {/* Profit Calculator */}
        <div className="w-full">
          <ProfitCalculator />
        </div>

      </div>
    </div>
  );
}
