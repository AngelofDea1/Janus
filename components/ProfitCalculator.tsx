"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, TrendingUp, RefreshCw, DollarSign, ChevronDown } from "lucide-react";
import AssetLogo from "./AssetLogo";

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

const POSITION_PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];

export default function ProfitCalculator() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionSize, setPositionSize] = useState(10000);
  const [inputValue, setInputValue] = useState("10000");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/funding-rates");
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setOpportunities(json.data);
        // Auto-select the best opportunity (highest APY)
        setSelectedOpp(json.data[0]);
        setLastUpdated(new Date());
      }
    } catch {
      // silently fail, keep showing last data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const handlePositionInput = (val: string) => {
    setInputValue(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (!isNaN(num) && num > 0) setPositionSize(num);
  };

  const spread = selectedOpp ? parseFloat(selectedOpp.spread) / 100 : 0;
  const apy = selectedOpp ? parseFloat(selectedOpp.projectedAPY) / 100 : 0;

  // Funding happens 3x per day (every 8 hours)
  const fundingPerPeriod = positionSize * spread;
  const daily = fundingPerPeriod * 3;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const yearly = positionSize * apy;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

  return (
    <div className="w-full bg-panel border border-borderLine rounded-[32px] p-6 md:p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl mb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-2xl text-foreground">Profit Calculator</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real earnings based on live funding rate spreads, no estimates, no guessing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Position Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Position Size (USDC)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handlePositionInput(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white dark:bg-[#111] border border-borderLine rounded-2xl text-foreground font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                placeholder="10,000"
              />
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-2 mt-3">
              {POSITION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setPositionSize(preset);
                    setInputValue(preset.toString());
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${positionSize === preset
                    ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                    : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-borderLine hover:border-accent/50"
                    }`}
                >
                  ${preset >= 1000 ? `${preset / 1000}K` : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Selector */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                Select Arbitrage Pair
              </label>
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-borderLine rounded-xl text-sm font-medium text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {loading ? (
              <div className="h-64 space-y-2 animate-pulse mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 bg-black/5 dark:bg-white/5 rounded-xl border border-borderLine" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scroll mt-2 flex-1">
                {opportunities
                  .filter(opp => opp.asset.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((opp) => (
                  <button
                    key={opp.asset}
                    onClick={() => setSelectedOpp(opp)}
                    className={`w-full flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 rounded-xl border transition-all text-left gap-2 sm:gap-0 ${selectedOpp?.asset === opp.asset
                      ? "bg-accent text-white shadow-[0_4px_0_rgb(4,120,87)] border-transparent hover:brightness-110 active:translate-y-[4px] active:shadow-none"
                      : "bg-white dark:bg-[#111] border-borderLine hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <AssetLogo asset={opp.asset} size={20} className="border border-borderLine/50 bg-slate-100 dark:bg-slate-800" />
                      <span className={`font-bold text-sm ${selectedOpp?.asset === opp.asset ? "text-white" : "text-foreground"}`}>{opp.asset}</span>
                      <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${selectedOpp?.asset === opp.asset ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{opp.exB} → {opp.exA}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex flex-col sm:text-right">
                        <span className={`text-[10px] uppercase font-semibold ${selectedOpp?.asset === opp.asset ? "text-white/70" : "text-slate-400"}`}>Spread</span>
                        <span className={`text-xs font-mono font-bold ${selectedOpp?.asset === opp.asset ? "text-white" : "text-slate-500"}`}>{opp.spread}%</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className={`text-[10px] uppercase font-semibold ${selectedOpp?.asset === opp.asset ? "text-white/70" : "text-slate-400"}`}>APY</span>
                        <span className={`text-xs font-bold font-mono ${selectedOpp?.asset === opp.asset
                          ? "text-white"
                          : "text-accent"
                          }`}>
                          {opp.projectedAPY}%
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {opportunities.filter(opp => opp.asset.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-borderLine rounded-xl">
                    No matching pairs found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex flex-col gap-4">
          {/* Strategy Info */}
          {selectedOpp && (
            <div className="bg-white dark:bg-[#0d0d12] border border-borderLine rounded-2xl p-5 text-sm">
              <div className="flex items-center justify-between mb-4 border-b border-borderLine pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Strategy</span>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-borderLine/50">
                  <AssetLogo asset={selectedOpp.asset} size={16} />
                  <span className="font-bold text-xs text-foreground tracking-tight">{selectedOpp.asset}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Short Position</span>
                  <span className="font-mono text-foreground">
                    {selectedOpp.exA} <span className="text-slate-500 ml-1">@ {selectedOpp.exchangeARate}%</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Long Position</span>
                  <span className="font-mono text-foreground">
                    {selectedOpp.exB} <span className="text-slate-500 ml-1">@ {selectedOpp.exchangeBRate}%</span>
                  </span>
                </div>
                <div className="h-px w-full bg-borderLine my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Net Spread (8h)</span>
                  <span className="font-mono font-medium text-foreground">{selectedOpp.spread}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: "Per Funding Period", sublabel: "Every 8 hours", value: fundingPerPeriod, highlight: false },
              { label: "Daily", sublabel: "3 funding periods", value: daily, highlight: false },
              { label: "Weekly", sublabel: "7 days", value: weekly, highlight: false },
              { label: "Monthly", sublabel: "30 days", value: monthly, highlight: false },
            ].map(({ label, sublabel, value, highlight }) => (
              <div
                key={label}
                className="bg-white dark:bg-[#111] border border-borderLine rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">{sublabel}</div>
                </div>
                <div className="text-xl font-heading font-bold text-foreground mt-2">
                  {loading || !selectedOpp ? "—" : fmt(value)}
                </div>
              </div>
            ))}
          </div>

          {/* Annual Highlight */}
          <div className="relative overflow-hidden bg-white dark:bg-[#09090b] border border-borderLine rounded-2xl p-6">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-2">Projected Annual Earnings</div>
                <div className="text-4xl font-heading font-semibold text-foreground tracking-tight">
                  {loading || !selectedOpp ? "—" : fmt(yearly)}
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  on {fmt(positionSize)} at <span className="font-medium text-foreground">{selectedOpp?.projectedAPY ?? "—"}% APY</span>
                </div>
              </div>
              {selectedOpp && (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-borderLine/50 shadow-sm">
                  <AssetLogo asset={selectedOpp.asset} size={28} />
                </div>
              )}
            </div>
            <div className="mt-5 text-xs text-slate-400 dark:text-slate-500">
              Projections assume consistent spread. Actual returns vary with market conditions, fees, and slippage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
