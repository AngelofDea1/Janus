"use client";

import React, { useState } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { FileSpreadsheet, ArrowUpRight, Eye } from "lucide-react";
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
      <tr className="border-b border-slate-100 dark:border-slate-800/40 animate-pulse">
        <td className="py-4 pr-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
        </td>
        <td className="py-4 pr-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
        </td>
        <td className="py-4 pr-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        </td>
        <td className="py-4 pr-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        </td>
        <td className="py-4 text-right">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto"></div>
        </td>
      </tr>
    );
  }

  if (!logData) return null;

  const [timestamp, action, actor, amount] = logData as [bigint, string, string, bigint];
  const date = new Date(Number(timestamp) * 1000);
  const amountDisplay = Number(formatUnits(amount, 6));

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors border-b border-slate-100 dark:border-slate-800/40 last:border-0">
      <td className="py-4 pr-4 font-extrabold text-slate-900 dark:text-slate-200">
        LOG-{index}
      </td>
      <td className="py-4 pr-4 text-slate-600 dark:text-slate-300 font-medium">
        {action}
      </td>
      <td className="py-4 pr-4 font-mono text-indigo-500 dark:text-indigo-400 font-semibold">
        {actor.slice(0, 6)}...{actor.slice(-4)}
      </td>
      <td className="py-4 pr-4 font-semibold text-slate-700 dark:text-slate-300">
        {amountDisplay > 0 ? (
          <span>{amountDisplay.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span className="text-[10px] text-slate-400 uppercase">USDC</span></span>
        ) : (
          <span className="text-slate-400 text-xs italic">N/A</span>
        )}
      </td>
      <td className="py-4 text-right text-slate-500 font-medium">
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
    <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            On-Chain Compliance Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Complete, immutable record of all verified vault parameter adjustments, deposits, and harvests.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 pr-4 font-bold">Log ID</th>
              <th className="pb-3 pr-4 font-bold">Action Event</th>
              <th className="pb-3 pr-4 font-bold">Authorized Actor</th>
              <th className="pb-3 pr-4 font-bold">Volume / Amount</th>
              <th className="pb-3 text-right font-bold">Verified Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logIndices.length > 0 ? (
              logIndices.map((index) => (
                <AuditLogRow key={index} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400 italic">
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
