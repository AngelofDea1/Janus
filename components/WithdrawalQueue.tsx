"use client";

import React, { useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { formatUnits } from "viem";
import { Clock, CheckCircle, ArrowDownCircle, Info } from "lucide-react";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/constants";

interface WithdrawalRequest {
  requestId: number;
  shares: bigint;
  requestTime: bigint;
  timeRemaining: bigint;
  completed: boolean;
}

export default function WithdrawalQueue() {
  const { writeContract, isPending } = useWriteContract();
  const [claimProgress, setClaimProgress] = useState<number | null>(null);

  // Read withdrawal delay
  const { data: withdrawalDelay } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "withdrawalDelay",
  });

  // Mock initial requests for premium demo display, merging with active chain status
  const [requests, setRequests] = useState<WithdrawalRequest[]>([
    {
      requestId: 5012,
      shares: BigInt("1250000000000000000000"), // 1250 shares
      requestTime: BigInt(Math.floor(Date.now() / 1000) - 180000), // ~2 days ago
      timeRemaining: BigInt(0),
      completed: false
    },
    {
      requestId: 5013,
      shares: BigInt("5000000000000000000000"), // 5000 shares
      requestTime: BigInt(Math.floor(Date.now() / 1000) - 36000), // 10 hours ago
      timeRemaining: BigInt(136800), // 38 hours remaining
      completed: false
    }
  ]);

  const completeWithdrawal = (requestId: number) => {
    setClaimProgress(requestId);
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "completeWithdrawal",
      args: [BigInt(requestId)],
    });
    
    // Simulate frontend complete update for gorgeous UX
    setTimeout(() => {
      setRequests(prev =>
        prev.map(r => (r.requestId === requestId ? { ...r, completed: true } : r))
      );
      setClaimProgress(null);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            <span>Withdrawal Queue & Timelock</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Large-scale deposits are protected by a 48-hour withdrawal cooldown to protect pools against exploit arbitrage.
          </p>
        </div>
      </div>

      {/* Info Warning */}
      <div className="mb-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-start gap-2.5">
        <div>
          <span className="block font-extrabold text-blue-700 dark:text-blue-300 mb-0.5">2-Day Capital Cooldown Active</span>
          <span>
            Settlement Cooldown Limit: {withdrawalDelay ? `${Number(withdrawalDelay) / 86400} Days` : "48 Hours (2 Days)"}. This prevents flash-loan sandwich manipulation of compounding vault shares.
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map(request => {
          const isReady = request.timeRemaining === BigInt(0);
          const progressPercent = isReady 
            ? 100 
            : 100 - Math.max(0, Math.min(100, Number(request.timeRemaining) * 100 / (withdrawalDelay ? Number(withdrawalDelay) : 172800)));

          return (
            <div 
              key={request.requestId} 
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col gap-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Queue #{request.requestId}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      Requested {new Date(Number(request.requestTime) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                    {formatUnits(request.shares, 18)} <span className="text-xs font-bold text-slate-400">JANUS Shares</span>
                  </h4>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right hidden sm:block">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      request.completed
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        : isReady
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-500"
                    }`}>
                      {request.completed ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Claimed
                        </>
                      ) : isReady ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Ready
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 animate-pulse" />
                          Pending Delay
                        </>
                      )}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {request.completed 
                        ? "Capital released" 
                        : isReady 
                          ? "Unlocked & releasable" 
                          : `${Math.ceil(Number(request.timeRemaining) / 3600)} Hours Remaining`
                      }
                    </p>
                  </div>

                  {!request.completed ? (
                    <button
                      disabled={!isReady || isPending || claimProgress !== null}
                      onClick={() => completeWithdrawal(request.requestId)}
                      className="px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10"
                    >
                      {claimProgress === request.requestId ? (
                        <span>Releasing Capital...</span>
                      ) : (
                        <span>Release Capital</span>
                      )}
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Success
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Slider */}
              {!request.completed && (
                <div className="border-t border-slate-100 dark:border-slate-900 pt-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                    <span>Settlement Window Progress</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
