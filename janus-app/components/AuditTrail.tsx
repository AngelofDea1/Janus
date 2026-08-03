"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

// Sub-component securely encapsulating the `useReadContract` hook per row
function AuditLogRow({ index }: { index: number }) {
 const { data: logData, isLoading } = useReadContract({
 address: VAULT_ADDRESS,
 abi: VAULT_ABI,
 functionName: "getAuditLog",
 args: [BigInt(index)],
 });

 if (isLoading) {
 return (
 <tr className="border-b border-borderLine animate-pulse">
 <td className="py-4 pr-4"><div className="h-4 bg-borderLine rounded w-16"></div></td>
 <td className="py-4 pr-4"><div className="h-4 bg-borderLine rounded w-48"></div></td>
 <td className="py-4 pr-4"><div className="h-4 bg-borderLine rounded w-32"></div></td>
 <td className="py-4 pr-4"><div className="h-4 bg-borderLine rounded w-24"></div></td>
 <td className="py-4 text-right"><div className="h-4 bg-borderLine rounded w-20 ml-auto"></div></td>
 </tr>
 );
 }

 if (!logData) return null;

 const [timestamp, action, actor, amount] = logData as [bigint, string, string, bigint];
 const date = new Date(Number(timestamp) * 1000);
 const amountDisplay = Number(formatUnits(amount, 6));

 return (
 <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors border-b border-borderLine last:border-0">
 <td className="py-4 pr-4 text-sm font-medium text-foreground">
 LOG-{index}
 </td>
 <td className="py-4 pr-4 text-sm text-slate-500">
 {action}
 </td>
 <td className="py-4 pr-4 text-sm font-mono text-slate-500">
 {actor.slice(0, 6)}...{actor.slice(-4)}
 </td>
 <td className="py-4 pr-4 text-sm text-foreground">
 {amountDisplay > 0 ? (
 <span>{amountDisplay.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">USDC</span></span>
 ) : (
 <span className="text-slate-400 text-xs italic">N/A</span>
 )}
 </td>
 <td className="py-4 text-right text-sm text-slate-500">
 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
 </td>
 </tr>
 );
}

export default function AuditTrail() {
 const { data: auditLogCount } = useReadContract({
 address: VAULT_ADDRESS,
 abi: VAULT_ABI,
 functionName: "getAuditLogCount",
 });

 // Calculate the most recent up to 10 logs
 const count = Number(auditLogCount || 0);
 const logsToFetch = Math.min(count, 10);
 
 // Create an array of indices counting backwards from the newest log
 const logIndices = Array.from({ length: logsToFetch }).map((_, i) => count - 1 - i);

 return (
 <div className="space-y-8">
 
 <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4 mb-2">
 <div>
 <h3 className="font-heading font-medium text-xl text-foreground mb-1">
 On-Chain Compliance Audit Trail
 </h3>
 <p className="text-sm text-slate-500">
 Complete, immutable record of all verified vault parameter adjustments, deposits, and harvests.
 </p>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="border-b border-borderLine text-xs font-medium uppercase tracking-widest text-slate-500">
 <th className="pb-3 pr-4">Log ID</th>
 <th className="pb-3 pr-4">Action Event</th>
 <th className="pb-3 pr-4">Authorized Actor</th>
 <th className="pb-3 pr-4">Volume / Amount</th>
 <th className="pb-3 text-right">Verified Timestamp</th>
 </tr>
 </thead>
 <tbody>
 {logIndices.length > 0 ? (
 logIndices.map((index) => (
 <AuditLogRow key={index} index={index} />
 ))
 ) : (
 <tr>
 <td colSpan={5} className="py-8 text-center text-sm text-slate-500 italic">
 No verified on-chain audit logs available yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
