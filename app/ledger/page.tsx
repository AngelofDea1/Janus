"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";
import AssetLogo from "@/components/AssetLogo";
import Link from "next/link";
import { fetchGraphQL, GET_LATEST_ARBITRAGE_EXECUTIONS } from "@/lib/graphql";
import { formatUnits } from "viem";

interface ArbitrageExecution {
  id: string;
  asset: string;
  route: string;
  volume: string;
  spread: string;
  yieldHarvested: string;
  timestamp: string;
  transactionHash: string;
}

export default function LedgerPage() {
  const [executions, setExecutions] = useState<ArbitrageExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"ALL" | "USDC" | "EURC">("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real execution data from Goldsky
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchGraphQL<{ arbitrageExecutions: ArbitrageExecution[] }>(
          GET_LATEST_ARBITRAGE_EXECUTIONS,
          { first: 100 }
        );
        if (data?.arbitrageExecutions) {
          setExecutions(data.arbitrageExecutions);
        }
      } catch (err) {
        console.error("Failed to fetch Goldsky data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getAssetDisplayName = (asset: string) => {
    const upper = asset.toUpperCase();
    if (upper === 'USV') return 'USDC';
    if (upper === 'ESV') return 'EURC';
    return upper;
  };

  // Filter executions based on selected tab
  const filteredExecutions = executions.filter((ex) => {
    if (selectedTab === "ALL") return true;
    return getAssetDisplayName(ex.asset) === selectedTab;
  });

  const totalItems = filteredExecutions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedExecutions = filteredExecutions.slice(startIndex, endIndex);

  const tableRows = slicedExecutions.map((ex) => {
    const assetName = getAssetDisplayName(ex.asset);
    const isEurc = assetName === "EURC";
    const currencySymbol = isEurc ? "€" : "$";
    const formattedVolume = parseFloat(formatUnits(BigInt(ex.volume), 6)).toLocaleString(undefined, { minimumFractionDigits: 2 });

    return {
      displayId: ex.transactionHash.length > 20 ? `${ex.transactionHash.slice(0, 10)}...${ex.transactionHash.slice(-4)}` : ex.transactionHash,
      fullId: ex.transactionHash,
      asset: assetName,
      route: ex.route,
      volume: `${currencySymbol}${formattedVolume}`,
      spread: `+${ex.spread}%`,
      status: "Executed", // Since it's on-chain in subgraph, it's executed
      time: formatTime(Number(ex.timestamp) * 1000), // convert subgraph seconds to MS
      txHash: ex.transactionHash,
    };
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mb-3">
            Relayer Ledger
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Arbitrage execution logs, fetched directly from the Arc Testnet.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-panel border border-borderLine p-1.5 rounded-2xl w-fit backdrop-blur-xl">
          {(["ALL", "USDC", "EURC"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedTab === tab
                  ? "bg-foreground text-background shadow-sm"
                  : "text-slate-500 hover:text-foreground hover:bg-slate-50/5 dark:hover:bg-white/5"
              }`}
            >
              {tab === "ALL" ? "All Executions" : `${tab} Vault`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-panel border border-borderLine rounded-[32px] overflow-hidden shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          <div className="p-6 md:p-8 border-b border-borderLine flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-foreground">Recent Executions</h2>
            <Link href="/analytics" className="text-sm font-medium text-accent hover:text-accentHover transition-colors flex items-center gap-1">
              View Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 font-medium">Tx Hash</th>
                  <th className="px-6 py-4 font-medium">Asset Pair</th>
                  <th className="px-6 py-4 font-medium">Route</th>
                  <th className="px-6 py-4 font-medium">Volume</th>
                  <th className="px-6 py-4 font-medium">Yield Spread</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLine">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-6 bg-black/5 dark:bg-white/5 rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                ) : tableRows.length > 0 ? (
                  tableRows.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-mono">
                        <a 
                          href={`https://testnet.arcscan.app/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accentHover underline decoration-accent/20 hover:decoration-accent transition-all flex items-center gap-1 group/link text-left w-fit"
                        >
                          {item.displayId}
                          <span className="text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity">↗</span>
                        </a>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <AssetLogo asset={item.asset} size={24} />
                          <span className="font-bold text-foreground">{item.asset}-PERP</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">
                        {item.route}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-foreground">
                        {item.volume}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono">
                          {item.spread}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {item.status === "Executed" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Executed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 text-right font-medium">
                        {item.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No recent {selectedTab !== "ALL" ? selectedTab : ""} executions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredExecutions.length > 0 && (
            <div className="p-4 md:p-6 border-t border-borderLine flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium relative" ref={dropdownRef}>
                <span>Show rows:</span>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2 bg-panel border border-borderLine rounded-lg px-3 py-1.5 text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="w-6 text-left">{rowsPerPage}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 md:left-auto w-24 bg-panel border border-borderLine rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                    {[10, 25, 50, 100].map(n => (
                      <button
                        key={n}
                        onClick={() => {
                          setRowsPerPage(n);
                          setCurrentPage(1);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          rowsPerPage === n 
                            ? 'bg-accent/10 text-accent font-bold' 
                            : 'text-foreground hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 md:px-3 md:py-2 rounded-lg border border-borderLine text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <ChevronsLeft className="w-4 h-4" />
                  <span className="hidden md:inline">First</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 md:p-2 rounded-lg border border-borderLine text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mx-1 md:mx-3 whitespace-nowrap">
                  Page <span className="text-foreground font-bold">{currentPage}</span> of <span className="text-foreground font-bold">{totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 md:p-2 rounded-lg border border-borderLine text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 md:px-3 md:py-2 rounded-lg border border-borderLine text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <span className="hidden md:inline">Last</span>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 5000) return "LIVE";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}
