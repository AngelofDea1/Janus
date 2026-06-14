"use client";

import React, { useState } from "react";
import { RefreshCw, ChevronRight } from "lucide-react";

interface TradeRoute {
 id: string;
 asset: "BTC" | "ETH" | "SOL" | "AVAX" | "LINK";
 venues: string[];
 spread: number;
 confidence: number;
 estimatedProfit: string;
 status: "analyzing" | "ready" | "executing";
}

export default function PredictiveEngine() {
 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [activeModel, setActiveModel] = useState("Alpha-V4 (Deep Learning)");
 
 const [routes, setRoutes] = useState<TradeRoute[]>([
 {
 id: "R-841A",
 asset: "SOL",
 venues: ["Binance (Short)", "Bybit (Long)", "Hyperliquid (Hedge)"],
 spread: 0.145,
 confidence: 94.2,
 estimatedProfit: "$4,250.00",
 status: "ready"
 },
 {
 id: "R-992B",
 asset: "ETH",
 venues: ["OKX (Short)", "Binance (Long)", "Aevo (Hedge)"],
 spread: 0.082,
 confidence: 88.5,
 estimatedProfit: "$1,840.50",
 status: "ready"
 },
 {
 id: "R-114C",
 asset: "BTC",
 venues: ["Hyperliquid (Short)", "dYdX (Long)", "Bybit (Hedge)"],
 spread: 0.112,
 confidence: 91.8,
 estimatedProfit: "$2,910.00",
 status: "ready"
 }
 ]);

 const runAnalysis = () => {
 setIsAnalyzing(true);
 setRoutes(prev => prev.map(r => ({ ...r, status: "analyzing" as const })));
 
 setTimeout(() => {
 const updatedRoutes: TradeRoute[] = [
 {
 id: "R-155X",
 asset: "LINK",
 venues: ["Binance (Short)", "Hyperliquid (Long)", "OKX (Hedge)"],
 spread: 0.188,
 confidence: 98.1,
 estimatedProfit: "$6,120.00",
 status: "ready"
 },
 ...routes.slice(0, 2).map(r => ({ ...r, status: "ready" as const }))
 ];
 setRoutes(updatedRoutes);
 setIsAnalyzing(false);
 }, 3000);
 };

 return (
 <div className="space-y-8 bg-panel border border-borderLine rounded-[32px] p-6 md:p-10 shadow-premium dark:shadow-premium-dark backdrop-blur-xl relative z-10">
 
 <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-6 mb-4">
 <div>
 <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
 ML Predictive Engine
 </h3>
 <p className="text-sm text-slate-500 max-w-md">
 Real-time deep learning model predicting funding rate spreads before they occur across major CEXs and DEXs.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 <div className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-borderLine text-xs font-medium text-slate-500 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
 {activeModel}
 </div>
 <button
 onClick={runAnalysis}
 disabled={isAnalyzing}
 className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-accent text-white hover:bg-accentHover shadow-premium hover:shadow-premium-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isAnalyzing ? (
 <>
 <RefreshCw className="w-4 h-4 animate-spin" />
 Analyzing...
 </>
 ) : (
 <>
 Run Prediction
 </>
 )}
 </button>
 </div>
 </div>

 {/* Prediction Results */}
 <div className="space-y-4">
 {routes.map((route, idx) => (
 <div 
 key={`${route.id}-${idx}`}
 className={`bg-black/5 dark:bg-[#09090b] border border-borderLine rounded-2xl p-6 transition-all duration-500 hover:border-accent/30 ${
 isAnalyzing ? "opacity-50 blur-[2px]" : "opacity-100 blur-0"
 }`}
 >
 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
 
 {/* Left: Route Path */}
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-widest font-medium">
 {idx === 0 && (
 <span className="px-2 py-1 rounded bg-accent/10 text-accent font-bold border border-accent/20">
 Highest Alpha
 </span>
 )}
 <span className="text-foreground">{route.asset}</span>
 <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
 <span className="text-slate-500 font-mono">ID: {route.id}</span>
 </div>
 
 <div className="flex flex-wrap items-center gap-2 text-sm text-foreground font-medium">
 {route.venues.map((venue, vIdx) => (
 <React.Fragment key={vIdx}>
 <span className="bg-white dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-borderLine shadow-sm">
 {venue}
 </span>
 {vIdx < route.venues.length - 1 && (
 <ChevronRight className="w-4 h-4 text-slate-400" />
 )}
 </React.Fragment>
 ))}
 </div>
 </div>

 {/* Right: Stats */}
 <div className="flex items-center gap-6 w-full lg:w-auto pt-4 lg:pt-0">
 <div className="px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-borderLine rounded-xl shadow-sm text-center min-w-[100px]">
 <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Spread</div>
 <div className="text-xl font-heading font-bold text-foreground">
 {route.spread.toFixed(3)}%
 </div>
 </div>
 
 <div className="px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-borderLine rounded-xl shadow-sm text-center min-w-[100px]">
 <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Confidence</div>
 <div className="text-xl font-heading font-bold text-[#4F46E5]">
 {route.confidence}%
 </div>
 </div>

 <div className="text-right ml-4">
 <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Est. Profit</div>
 <div className="text-3xl font-heading font-bold text-foreground">
 {route.estimatedProfit}
 </div>
 </div>
 </div>
 
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
