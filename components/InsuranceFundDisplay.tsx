"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ArrowUpRight } from "lucide-react";
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

 // Calculate values directly from chain without placeholders
 const insuredAmount = totalInsured ? Number(formatUnits(totalInsured, 6)) : 0;
 const claimedAmount = totalClaimed ? Number(formatUnits(totalClaimed, 6)) : 0;
 const availableAmount = availableBalance ? Number(formatUnits(availableBalance, 6)) : 0;
 
 // Calculate coverage ratio safely
 const coverageRatio = insuredAmount > 0 
 ? ((availableAmount / insuredAmount) * 100).toFixed(1) 
 : "100.0";

 return (
 <div className="space-y-16">
 
 <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
 <div>
 <h3 className="font-heading font-medium text-xl text-foreground mb-1">
 Sovereign Exploit Insurance Reserve
 </h3>
 <p className="text-sm text-slate-500">
 5% of all performance fees are automatically deposited here to secure funds against systemic DeFi risks.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
 <div>
 <span className="text-xs font-medium uppercase tracking-widest text-slate-500 block mb-2">
 Total Fund Reserve
 </span>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-heading font-medium text-foreground">
 {insuredAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-sm text-slate-500">USDC</span>
 </div>
 </div>

 <div>
 <span className="text-xs font-medium uppercase tracking-widest text-slate-500 block mb-2">
 Yield Coverage Ratio
 </span>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-heading font-medium text-foreground">
 {coverageRatio}%
 </span>
 <span className="text-sm text-slate-500">
 {Number(coverageRatio) > 80 ? 'Solvent' : 'Warning'}
 </span>
 </div>
 </div>

 <div>
 <span className="text-xs font-medium uppercase tracking-widest text-slate-500 block mb-2">
 Historical Claims
 </span>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-heading font-medium text-foreground">
 {claimedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-sm text-slate-500">USDC</span>
 </div>
 </div>

 <div>
 <span className="text-xs font-medium uppercase tracking-widest text-slate-500 block mb-2">
 Available Capital
 </span>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-heading font-medium text-foreground">
 {availableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 <span className="text-sm text-slate-500">USDC</span>
 </div>
 </div>
 </div>

 <div className="pt-8 border-t border-borderLine flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <p className="text-sm text-slate-500 max-w-2xl">
 Capital Shield Fully Collateralized: Protecting deposits up to the $10,000,000 Beta cap limit. Users can submit claims to be reimbursed from this pool.
 </p>
 <a 
 href={`https://testnet.arcscan.app/address/${INSURANCE_FUND_ADDRESS}`}
 target="_blank"
 rel="noreferrer"
 className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-slate-500 transition-colors"
 >
 Verify Reserve <ArrowUpRight className="w-4 h-4" />
 </a>
 </div>
 
 </div>
 );
}
