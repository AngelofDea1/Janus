"use client";

import React, { useState, useEffect } from "react";
import { BrainCircuit, Activity, Zap, Layers, RefreshCw, ChevronRight } from "lucide-react";

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
    <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background AI Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                ML Predictive Engine
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time deep learning model predicting funding rate spreads before they occur across major CEXs and DEXs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
              Model: <span className="text-fuchsia-500">{activeModel}</span>
            </div>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-fuchsia-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Alpha...
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
              className={`p-5 rounded-2xl border transition-all duration-500 ${
                isAnalyzing 
                  ? "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 opacity-50"
                  : idx === 0 
                    ? "bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/5"
                    : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80"
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                
                {/* Left: Route Path */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      idx === 0 ? "bg-fuchsia-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}>
                      {idx === 0 ? "Highest Alpha" : "Alternative Route"}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      route.asset === "BTC" ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400" :
                      route.asset === "ETH" ? "bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400" :
                      route.asset === "SOL" ? "bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400" :
                      route.asset === "AVAX" ? "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400" :
                      "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {route.asset}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {route.id}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {route.venues.map((venue, vIdx) => (
                      <React.Fragment key={vIdx}>
                        <span className="px-3 py-1.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
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
                <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                      Predicted Spread
                    </div>
                    <div className="text-lg font-black text-cyan-500">
                      {route.spread.toFixed(3)}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                      Model Confidence
                    </div>
                    <div className="text-lg font-black text-emerald-500">
                      {route.confidence}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                      Est. Profit
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {route.estimatedProfit}
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
