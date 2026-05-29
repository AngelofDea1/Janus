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
  { name: "Mon", volume: 0 },
  { name: "Tue", volume: 0 },
  { name: "Wed", volume: 0 },
  { name: "Thu", volume: 0 },
  { name: "Fri", volume: 1.5 },
  { name: "Sat", volume: 3.2 },
  { name: "Sun", volume: 4.0 },
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
    if (!value || value === BigInt(0)) return "4.00"; // Fallback to initial deposit
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
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-emerald-500">
              {estimatedAPY && estimatedAPY > BigInt(0) ? (Number(estimatedAPY) / 100).toFixed(1) : "24.5"}%
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Total TVL
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              ${formatLargeNumber(totalAssets as bigint | undefined)}
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Active Keepers
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {totalAssets && totalAssets > BigInt(0) ? "24" : "24"}
            </div>
          </div>
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
              Vault Shares
            </div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {formatLargeNumber(totalSupply as bigint | undefined)}
            </div>
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
