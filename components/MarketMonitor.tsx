"use client";

import React, { useEffect, useState } from "react";
import { Activity, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

interface Opportunity {
  asset: string;
  exchangeARate: string;
  exchangeBRate: string;
  spread: string;
  projectedAPY: string;
  longExchange: string;
  shortExchange: string;
  exA: string;
  exB: string;
}

const CryptoLogo = ({ asset }: { asset: string }) => {
  const symbol = asset.toLowerCase();
  const sources = [
    `https://assets.coincap.io/assets/icons/${symbol}@2x.png`,
    `https://www.gate.io/images/coin_icon/64/${symbol}.png`,
    `https://assets.kucoin.com/www/coin/pc/${asset.toUpperCase()}.png`,
    `https://ui-avatars.com/api/?name=${asset}&background=10b981&color=fff&rounded=true&bold=true&font-size=0.4`
  ];
  const [srcIndex, setSrcIndex] = useState(0);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={sources[srcIndex]} 
      alt={asset}
      className="w-full h-full object-cover z-10"
      onError={() => {
        if (srcIndex < sources.length - 1) {
          setSrcIndex(srcIndex + 1);
        }
      }}
    />
  );
};

export default function MarketMonitor() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/funding-rates");
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data);
        setLastUpdated(new Date());
        setError("");
      } else {
        setError(json.error || "Failed to load data");
      }
    } catch (err) {
      setError("Network error. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-panel border border-borderLine rounded-[32px] p-6 md:p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl mb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-2xl text-foreground">Live Market Monitor</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time funding arbitrage across Binance, Bybit, KuCoin, MEXC & Hyperliquid
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-borderLine">
          {loading && !lastUpdated ? (
            <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Syncing network...</span>
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 opacity-50" /> 
              Updated {lastUpdated?.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 p-3 rounded-xl mb-4 border border-rose-500/20 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderLine text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-4 font-semibold">Asset</th>
              <th className="py-4 font-semibold text-right">Highest Rate (Short)</th>
              <th className="py-4 font-semibold text-right">Lowest Rate (Long)</th>
              <th className="py-4 font-semibold text-right">Spread</th>
              <th className="py-4 font-semibold text-right text-accent">Proj. APY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLine/50 text-sm">
            {loading && opportunities.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                  <td className="py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                  <td className="py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                  <td className="py-4"><div className="h-4 w-16 bg-accent/20 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : opportunities.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No active spreads found meeting minimum threshold.
                </td>
              </tr>
            ) : (
              opportunities.map((opp, idx) => (
                <tr key={opp.asset} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="py-4 font-bold text-foreground flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 shadow-sm border border-borderLine/50 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <CryptoLogo asset={opp.asset} />
                    </div>
                    {opp.asset}
                  </td>
                  <td className="py-4 text-right">
                    <div className="font-mono text-slate-600 dark:text-slate-300">{opp.exchangeARate}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">{opp.exA}</div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="font-mono text-slate-600 dark:text-slate-300">{opp.exchangeBRate}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">{opp.exB}</div>
                  </td>
                  <td className="py-4 text-right font-mono font-medium text-foreground">{opp.spread}%</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold font-mono text-sm border border-accent/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                      {opp.projectedAPY}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
