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

// Mock historical volume data for charts
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
 <div className="min-h-screen bg-slate-50 dark:bg-[#060814] flex flex-col items-center justify-center py-24">
 <div className="relative flex flex-col items-center max-w-sm text-center px-6">
 <div className="relative w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 animate-pulse">
 <Activity className="w-8 h-8 text-indigo-500" />
 <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 animate-ping opacity-75" />
 </div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
 Loading Neural Metrics
 </h2>
 <p className="text-xs text-slate-500 leading-relaxed">
 Connecting to predictive AI engine feeds and harvesting perpetual exchange funding histories...
 </p>
 <div className="mt-6 w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 transition-colors py-16 sm:py-24">
 
 {/* Background Gradients */}
 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/5 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/5 dark:bg-violet-900/15 blur-[120px] pointer-events-none" />

 <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-12">
 
 {/* Title */}
 <div className="max-w-3xl">
 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
 Protocol Analytics & ML Engine
 </h1>
 <p className="text-slate-600 dark:text-slate-400">
 Analyze historical compound metrics and monitor the live predictive funding rate neural network.
 </p>
 </div>

 {/* AI Predictive Engine */}
 <PredictiveEngine />

 {/* Big spacious chart card */}
 <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl dark:shadow-none">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
 <div>
 <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Compound Arbitrage Volume</h3>
 <p className="text-xs text-slate-500 mt-1">Weekly volume secure-routed by Janus automated keeper bots</p>
 </div>
 <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
 USD Principal Value
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
 border: "1px solid rgba(51, 65, 85, 0.4)", 
 borderRadius: "16px", 
 color: "#fff" 
 }}
 labelStyle={{ fontWeight: "bold" }}
 />
 <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Spacious Stats Layout */}
 <div className="grid md:grid-cols-2 gap-8">
 
 {/* APY Metrics Card */}
 <div className="p-8 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-lg dark:shadow-none space-y-6">
 <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
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
 <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/40 text-sm">
 <span className="text-slate-500 dark:text-slate-400 font-medium">{stat.period}</span>
 <span className={`font-bold ${stat.bold ? "text-emerald-500 text-base" : "text-slate-800 dark:text-slate-200"}`}>
 {stat.value}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Vault Mechanics Card */}
 <div className="p-8 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-lg dark:shadow-none flex flex-col justify-between">
 <div className="space-y-6">
 <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
 Vault Mechanics Summary
 </h4>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
 Janus Vault holds stable assets such as USDC. When deposits are requested, our keeper contract automatically allocates funds across low-risk, delta-neutral pools to lock in highest available yield.
 </p>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
 The vault standard conforms strictly to the ERC-4626 Tokenized Vaults standard. When depositing USDC, users receive `JANUS` vault shares. The exchange rate between USDC and JANUS shares grows linearly over time as yield is compounded back into the vault assets.
 </p>
 </div>
 
 <div className="flex flex-wrap gap-2 text-xs font-bold pt-6 border-t border-slate-100 dark:border-slate-800/40 mt-6">
 <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
 ERC-4626 Standard
 </span>
 <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
 Delta-Neutral Principal
 </span>
 </div>
 </div>

 </div>

 </div>
 </div>
 );
}
