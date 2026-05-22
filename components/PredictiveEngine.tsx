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
 <div className="space-y-12">
 
 <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-6 border-b border-borderLine pb-6">
 <div>
 <h3 className="font-heading font-medium text-xl text-foreground mb-1">
 ML Predictive Engine
 </h3>
 <p className="text-sm text-slate-500">
 Real-time deep learning model predicting funding rate spreads before they occur across major CEXs and DEXs.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
 <div className="text-xs font-medium text-slate-500">
 Model: <span className="text-foreground">{activeModel}</span>
 </div>
 <button
 onClick={runAnalysis}
 disabled={isAnalyzing}
 className="text-sm font-medium text-foreground hover:text-slate-500 transition-colors disabled:opacity-50 flex items-center gap-2"
 >
 {isAnalyzing ? (
 <>
 <RefreshCw className="w-4 h-4 animate-spin" />
 Generating...
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
 <div className="space-y-6">
 {routes.map((route, idx) => (
 <div 
 key={`${route.id}-${idx}`}
 className={`border-b border-borderLine pb-6 transition-all duration-500 ${
 isAnalyzing ? "opacity-50" : "opacity-100"
 }`}
 >
 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
 
 {/* Left: Route Path */}
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-2 text-xs uppercase tracking-widest font-medium">
 <span className={idx === 0 ? "text-foreground" : "text-slate-500"}>
 {idx === 0 ? "Highest Alpha" : "Alternative Route"}
 </span>
 <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
 <span className="text-slate-500">{route.asset}</span>
 <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
 <span className="text-slate-500 font-mono">ID: {route.id}</span>
 </div>
 
 <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
 {route.venues.map((venue, vIdx) => (
 <React.Fragment key={vIdx}>
 <span>{venue}</span>
 {vIdx < route.venues.length - 1 && (
 <ChevronRight className="w-4 h-4 text-slate-400" />
 )}
 </React.Fragment>
 ))}
 </div>
 </div>

 {/* Right: Stats */}
 <div className="flex items-center gap-8 w-full lg:w-auto pt-4 lg:pt-0">
 <div>
 <div className="text-xs uppercase tracking-widest font-medium text-slate-500 mb-1">
 Predicted Spread
 </div>
 <div className="text-xl font-heading font-medium text-foreground">
 {route.spread.toFixed(3)}%
 </div>
 </div>
 
 <div>
 <div className="text-xs uppercase tracking-widest font-medium text-slate-500 mb-1">
 Model Confidence
 </div>
 <div className="text-xl font-heading font-medium text-foreground">
 {route.confidence}%
 </div>
 </div>

 <div className="text-right">
 <div className="text-xs uppercase tracking-widest font-medium text-slate-500 mb-1">
 Est. Profit
 </div>
 <div className="text-2xl font-heading font-medium text-foreground">
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
