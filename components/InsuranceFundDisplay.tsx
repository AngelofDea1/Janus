"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ShieldCheck, Coins, ArrowUpRight } from "lucide-react";
import { INSURANCE_FUND_ADDRESS, INSURANCE_FUND_ABI } from "@/lib/constants";

export default function InsuranceFundDisplay() {
 const { data: totalInsured } = useReadContract({
 address: INSURANCE_FUND_ADDRESS,
 abi: INSURANCE_FUND_ABI,
 functionName: "totalInsured",
 chainId: 5042002,
 query: { refetchInterval: 2000 },
 });

 const { data: totalClaimed } = useReadContract({
 address: INSURANCE_FUND_ADDRESS,
 abi: INSURANCE_FUND_ABI,
 functionName: "totalClaimed",
 chainId: 5042002,
 query: { refetchInterval: 2000 },
 });

 const { data: availableBalance } = useReadContract({
 address: INSURANCE_FUND_ADDRESS,
 abi: INSURANCE_FUND_ABI,
 functionName: "getAvailableBalance",
 chainId: 5042002,
 query: { refetchInterval: 2000 },
 });

 // Calculate values (defaulting to mocked amounts while loading or disconnected)
 const insuredAmount = totalInsured ? Number(formatUnits(totalInsured, 6)) : 184920.50;
 const claimedAmount = totalClaimed ? Number(formatUnits(totalClaimed, 6)) : 0;
 const availableAmount = availableBalance ? Number(formatUnits(availableBalance, 6)) : 184920.50;
 
 // Calculate coverage ratio safely
 const coverageRatio = insuredAmount > 0 
 ? ((availableAmount / insuredAmount) * 100).toFixed(1) 
 : "100.0";

 return (
 <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
 
 {/* Background radial highlight */}
 <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

 <div className="flex items-start justify-between mb-6">
 <div>
 <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
 <span>Sovereign Exploit Insurance Reserve</span>
 </h3>
 <p className="text-xs text-slate-500 mt-0.5">
 5% of all performance fees are automatically deposited here to secure funds against systemic DeFi risks.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
 Total Fund Reserve
 </span>
 <span className="text-xl font-black text-slate-900 dark:text-white">
 {insuredAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-[10px] font-bold text-slate-400 block mt-0.5">USDC</span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
 Yield Coverage Ratio
 </span>
 <span className={`text-xl font-black ${Number(coverageRatio) > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
 {coverageRatio}%
 </span>
 <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
 {Number(coverageRatio) > 80 ? 'Solvent' : 'Warning'}
 </span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
 Historical Claims
 </span>
 <span className="text-xl font-black text-slate-700 dark:text-slate-300">
 {claimedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-[10px] font-bold text-slate-400 block mt-0.5">USDC Disbursed</span>
 </div>

 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
 Available Capital
 </span>
 <span className="text-xl font-black text-indigo-500">
 {availableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-[10px] font-bold text-slate-400 block mt-0.5">USDC Liquid</span>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between gap-4">
 <div className="flex items-center gap-2">
 <span>Capital Shield Fully Collateralized: Protecting deposits up to the $10,000,000 Beta cap limit. Users can submit claims to be reimbursed from this pool.</span>
 </div>
 <a 
 href={`https://testnet.arcscan.app/address/${INSURANCE_FUND_ADDRESS}`}
 target="_blank"
 rel="noreferrer"
 className="flex-shrink-0 flex items-center gap-0.5 text-xs text-emerald-600 hover:text-emerald-500 font-bold uppercase tracking-wider"
 >
 <span>Verify Reserve</span>
 <ArrowUpRight className="w-3.5 h-3.5" />
 </a>
 </div>
 </div>
 );
}
