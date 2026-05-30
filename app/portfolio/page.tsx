"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  Wallet,
  Activity,
  TrendingUp,
  PieChart,
  History,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";
import { VAULT_ADDRESS, EURC_VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";
import Link from "next/link";
import { fetchGraphQL, GET_USER_ACTIVITY } from "@/lib/graphql";

interface TransactionActivity {
  id: string;
  type: "Deposit" | "Withdraw";
  assets: string;
  shares: string;
  timestamp: string;
  transactionHash: string;
  vault: string;
}

export default function PortfolioDashboard() {
  const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();
  const [localConnected, setLocalConnected] = useState(false);
  const [localAddress, setLocalAddress] = useState("");
  const [mounted, setMounted] = useState(false);

  const [history, setHistory] = useState<TransactionActivity[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedConnected = localStorage.getItem("janus_wallet_connected") === "true";
      const savedAddress = localStorage.getItem("janus_wallet_address") || "";
      setLocalConnected(savedConnected);
      setLocalAddress(savedAddress);
    }
  }, []);

  const isConnected = wagmiIsConnected || localConnected;
  const address = (wagmiAddress || localAddress) as `0x${string}` | undefined;

  useEffect(() => {
    if (!isConnected || !address) {
      setHistory([]);
      setLoadingHistory(false);
      return;
    }

    async function loadHistory() {
      setLoadingHistory(true);
      try {
        const data = await fetchGraphQL<{
          deposits: Omit<TransactionActivity, "type">[];
          withdraws: Omit<TransactionActivity, "type">[];
        }>(GET_USER_ACTIVITY, { owner: address!.toLowerCase() });

        if (data) {
          const merged: TransactionActivity[] = [
            ...(data.deposits || []).map(d => ({ ...d, type: "Deposit" as const })),
            ...(data.withdraws || []).map(w => ({ ...w, type: "Withdraw" as const }))
          ];

          // Sort by timestamp descending
          merged.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
          setHistory(merged);
        }
      } catch (err) {
        console.error("Error fetching user history from Goldsky:", err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [isConnected, address]);

  // Real USDC Contract Data
  const { data: userSharesUsdc } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: userValueUsdc } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "userValue",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: estimatedAPYUsdc } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 10000 },
  });

  // Real EURC Contract Data
  const { data: userSharesEurc } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: userValueEurc } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "userValue",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 5000 },
  });

  const { data: estimatedAPYEurc } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 10000 },
  });

  if (!mounted) {
    return (
      <div className="relative min-h-screen bg-background py-32 flex justify-center px-4">
        <div className="w-full max-w-6xl space-y-8 animate-pulse mt-12">
          <div className="h-12 w-64 bg-black/5 dark:bg-white/5 rounded-2xl" />
          <div className="h-80 w-full bg-panel border border-borderLine rounded-3xl" />
          <div className="h-48 w-full bg-panel border border-borderLine rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32 pb-24 px-4">
        <div className="bg-panel border border-borderLine rounded-3xl p-12 shadow-premium dark:shadow-premium-dark backdrop-blur-xl text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3">Connect Wallet</h2>
          <p className="text-slate-500 mb-8">
            Connect your wallet to view your personalized Janus portfolio, current TVL, and yield projections.
          </p>
          <Link
            href="/app"
            className="w-full inline-flex justify-center items-center py-4 rounded-2xl bg-foreground text-background font-bold shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90 transition-all"
          >
            Go to Terminal
          </Link>
        </div>
      </div>
    );
  }

  const formatNumber = (value: bigint | undefined, decimals: number = 6) => {
    if (!value) return "0.00";
    return parseFloat(formatUnits(value, decimals)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getUSDFloat = (value: bigint | undefined) => {
    if (!value) return 0;
    return parseFloat(formatUnits(value, 6));
  };

  // APY calculations
  const apyUsdc = estimatedAPYUsdc ? Number(estimatedAPYUsdc) / 100 : 0;
  const apyEurc = estimatedAPYEurc ? Number(estimatedAPYEurc) / 100 : 0;

  // Values
  const valueUsdcFloat = getUSDFloat(userValueUsdc);
  const valueEurcFloat = getUSDFloat(userValueEurc);

  // EUR to USD conversion rate
  const EUR_USD_RATE = 1.08;
  const totalValueInUSD = valueUsdcFloat + (valueEurcFloat * EUR_USD_RATE);

  // Yield calculations
  const dailyYieldUsdc = (valueUsdcFloat * (apyUsdc / 100)) / 365;
  const monthlyYieldUsdc = dailyYieldUsdc * 30;

  const dailyYieldEurc = (valueEurcFloat * (apyEurc / 100)) / 365;
  const monthlyYieldEurc = dailyYieldEurc * 30;

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors py-32 overflow-hidden flex justify-center">

      {/* Background Mesh */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter text-foreground mb-4">
              Your Portfolio
            </h1>
          </div>
          <Link
            href="/app"
            className="hidden md:flex px-6 py-3 rounded-xl bg-foreground text-background font-bold items-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90 transition-all"
          >
            Deposit / Withdraw <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-xl border-t border-borderLine z-50 md:hidden pb-safe">
          <Link
            href="/app"
            className="w-full px-6 py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90 transition-all text-lg"
          >
            Deposit / Withdraw <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Total Value Locked Header */}
        <div className="bg-panel border border-borderLine rounded-3xl p-8 mb-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Total Portfolio Value (USD)
          </div>
          <div className="text-5xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
            ${totalValueInUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-slate-500 mt-2 font-medium flex flex-wrap gap-x-4 gap-y-1">
            <span>USDC Position: <strong className="text-foreground font-mono">${formatNumber(userValueUsdc)}</strong></span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span>EURC Position: <strong className="text-foreground font-mono">€{formatNumber(userValueEurc)}</strong> <span className="text-xs text-slate-500 font-normal">(~${(valueEurcFloat * EUR_USD_RATE).toFixed(2)})</span></span>
          </div>
        </div>

        {/* Dual Vault Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* USDC Vault Card */}
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500 text-lg">
                  $
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">USDC Savings Vault</h3>
                  <p className="text-xs text-slate-500 font-semibold font-mono">{VAULT_ADDRESS.slice(0, 6)}...{VAULT_ADDRESS.slice(-4)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Balance</div>
              <div className="text-3xl font-bold font-mono text-foreground">${formatNumber(userValueUsdc)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Shares: <span className="font-semibold font-mono">{formatNumber(userSharesUsdc)}</span> Janus USDC Shares
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-borderLine/50">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">APY</div>
                <div className="text-lg font-bold text-emerald-500">{apyUsdc.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Daily</div>
                <div className="text-lg font-bold text-foreground">+${dailyYieldUsdc.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Monthly</div>
                <div className="text-lg font-bold text-foreground">+${monthlyYieldUsdc.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* EURC Vault Card */}
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-premium dark:shadow-premium-dark backdrop-blur-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500 text-lg">
                  €
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">EURC Savings Vault</h3>
                  <p className="text-xs text-slate-500 font-semibold font-mono">{EURC_VAULT_ADDRESS.slice(0, 6)}...{EURC_VAULT_ADDRESS.slice(-4)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Balance</div>
              <div className="text-3xl font-bold font-mono text-foreground">€{formatNumber(userValueEurc)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Shares: <span className="font-semibold font-mono">{formatNumber(userSharesEurc)}</span> Janus EURC Shares
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-borderLine/50">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">APY</div>
                <div className="text-lg font-bold text-emerald-500">{apyEurc.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Daily</div>
                <div className="text-lg font-bold text-foreground">+€{dailyYieldEurc.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Monthly</div>
                <div className="text-lg font-bold text-foreground">+€{monthlyYieldEurc.toFixed(2)}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Side Info / Protection Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-xl">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Delta-Neutral Arbitrage
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Your deposits in both USDC and EURC vaults are actively deployed into delta-neutral funding rate arbitrage loops. This optimizes yields under all market conditions while eliminating asset price exposure.
            </p>
            <Link href="/analytics" className="text-sm font-semibold text-accent flex items-center gap-1 hover:underline">
              View Active Positions <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-panel border border-borderLine rounded-3xl p-6 shadow-sm backdrop-blur-xl">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Security & Insurance
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Both vaults utilize strict smart contract parameters, automated slippage checks, and access to a shared protocol insurance fund backing all deposit-related executions.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-bold font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Activity
            </div>
          </div>

          {loadingHistory ? (
            <div className="text-center py-12 animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Syncing with Arc Testnet...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-borderLine text-slate-500">
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">Asset</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Shares</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLine/50">
                  {history.map((tx) => {
                    const isEurc = tx.vault.toLowerCase() === EURC_VAULT_ADDRESS.toLowerCase();
                    const currencySymbol = isEurc ? "€" : "$";
                    const assetLabel = isEurc ? "EURC" : "USDC";

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 font-medium">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tx.type === "Deposit"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                            }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-slate-500">{assetLabel}</td>
                        <td className="py-4 font-mono text-foreground">
                          {currencySymbol}{formatNumber(BigInt(tx.assets))}
                        </td>
                        <td className="py-4 font-mono text-slate-500">
                          {formatNumber(BigInt(tx.shares))}
                        </td>
                        <td className="py-4 text-right">
                          <a
                            href={`https://testnet.arcscan.app/tx/${tx.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-accent transition-colors underline decoration-transparent hover:decoration-accent"
                          >
                            {new Date(Number(tx.timestamp) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No recent activity found for this wallet.</p>
              <Link href="/app" className="text-accent font-semibold hover:underline">
                Make your first deposit
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
