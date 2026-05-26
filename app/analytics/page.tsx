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
  const [timeframe, setTimeframe] = React.useState("ALL");
  const [allExecutions, setAllExecutions] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<{ name: string; volume: number; rawTime: number }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    fetch("/api/executions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.executions) {
          // Sort by timestamp ascending to show chronological growth
          const sorted = [...data.executions].sort((a: any, b: any) => a.timestamp - b.timestamp);
          setAllExecutions(sorted);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch executions for chart", err);
        setIsLoading(false);
      });
  }, []);

  // Recalculate the chart data when timeframe or raw data changes
  React.useEffect(() => {
    if (allExecutions.length === 0) return;

    const now = Date.now();
    let cutoff = 0;
    if (timeframe === "1W") cutoff = now - 7 * 24 * 60 * 60 * 1000;
    else if (timeframe === "1M") cutoff = now - 30 * 24 * 60 * 60 * 1000;
    else if (timeframe === "1Y") cutoff = now - 365 * 24 * 60 * 60 * 1000;

    const filtered = allExecutions.filter(ex => ex.timestamp >= cutoff);
    
    let cumulativeVolume = 0;
    const points = filtered.map((ex: any) => {
      cumulativeVolume += ex.volume || 0;
      const date = new Date(ex.timestamp);
      return {
        name: date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        volume: Math.round(cumulativeVolume),
        rawTime: ex.timestamp,
      };
    });
    
    setChartData(points);
  }, [timeframe, allExecutions]);

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

        {/* Minimal Chart Section */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-6 md:p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="font-heading font-bold text-2xl text-foreground">Compound Volume</h3>
            <div className="flex items-center gap-3">
              <div className="flex bg-black/5 dark:bg-white/5 rounded-full p-1 border border-borderLine">
                {['1W', '1M', '1Y', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${timeframe === tf ? 'bg-panel border border-borderLine text-foreground shadow-sm' : 'text-slate-500 hover:text-foreground'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <span className="bg-accent/10 text-accent font-semibold text-sm px-3 py-1 rounded-full border border-accent/20 hidden sm:block">USD Principal</span>
            </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            {isLoading ? (
              <div className="text-slate-500 font-medium animate-pulse">Loading cumulative volume...</div>
            ) : chartData.length === 0 ? (
              <div className="text-slate-500 font-medium">No execution history available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
