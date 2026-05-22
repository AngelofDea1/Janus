"use client";

import React from "react";
import { useReadContract } from "wagmi";
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
import PredictiveEngine from "@/components/PredictiveEngine";

const volumeData = [
  { name: "Mon", volume: 1200000 },
  { name: "Tue", volume: 1900000 },
  { name: "Wed", volume: 1600000 },
  { name: "Thu", volume: 2400000 },
  { name: "Fri", volume: 3100000 },
  { name: "Sat", volume: 2800000 },
  { name: "Sun", volume: 3800000 },
];

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-24">
        
        {/* Minimal Header */}
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tighter text-foreground mb-6">
            Analytics.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            Real-time insight into the Janus arbitrage engine.
          </p>
        </div>

        {/* Floating Borderless Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-borderLine pb-16">
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Live APY</div>
            <div className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              {estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(1) : "32.4"}%
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Volume</div>
            <div className="text-4xl md:text-5xl font-heading font-bold text-foreground">$16.8M</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Active Keepers</div>
            <div className="text-4xl md:text-5xl font-heading font-bold text-foreground">14</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Vault Shares</div>
            <div className="text-4xl md:text-5xl font-heading font-bold text-foreground">2.4M</div>
          </div>
        </div>

        {/* Minimal Chart Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-2xl text-foreground">Compound Volume</h3>
            <span className="text-accent font-medium text-sm">USD Principal</span>
          </div>

          <div className="h-96 w-full -mx-4 md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--theme-panel)", 
                    border: "1px solid var(--theme-borderLine)", 
                    borderRadius: "16px", 
                    color: "var(--theme-foreground)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)"
                  }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Engine (Stripped styling handled internally) */}
        <div className="pt-16 border-t border-borderLine">
          <PredictiveEngine />
        </div>

      </div>
    </div>
  );
}
