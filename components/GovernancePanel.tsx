"use client";

import React, { useState } from "react";
import { useReadContract } from "wagmi";
import { Shield, Clock, CheckCircle2, UserCheck, ArrowRight, Lock, Users, Check } from "lucide-react";
import { MULTISIG_ADDRESS, MULTISIG_ABI } from "@/lib/constants";

interface Proposal {
  id: number;
  type: string;
  target: string;
  payload: string;
  eta: string;
  status: "queued" | "executed" | "cancelled" | "pending-approvals";
  confirmations: number;
  required: number;
}

export default function GovernancePanel() {
  const { data: vaultPaused } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: "vaultPaused",
  });

  const { data: proposalCount } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: "getProposalCount",
  });

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 104,
      type: "Update Keeper Address",
      target: "JanusVault",
      payload: "0x59e2532e40982e4233b2cec2d074ad9e6a120f00",
      eta: "Within 24 Hours",
      status: "pending-approvals",
      confirmations: 4,
      required: 5
    },
    {
      id: 103,
      type: "Adjust Estimated APY Display",
      target: "JanusVault",
      payload: "Target Set: 35.2%",
      eta: "Expires in 4 days",
      status: "queued",
      confirmations: 5,
      required: 5
    },
    {
      id: 102,
      type: "Disburse Exploit Coverage",
      target: "JanusInsuranceFund",
      payload: "Recipient: 0x8a92... Amount: 2,500 USDC",
      eta: "Executed 2 hours ago",
      status: "executed",
      confirmations: 6,
      required: 5
    }
  ]);

  const handleConfirm = (id: number) => {
    setProposals(prev =>
      prev.map(p => {
        if (p.id === id && p.confirmations < p.required) {
          const nextConf = p.confirmations + 1;
          return {
            ...p,
            confirmations: nextConf,
            status: nextConf >= p.required ? "queued" : p.status
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Governance UI */}
      <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Timelocked Multi-Sig Governance
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enforcing 5-of-9 validator thresholds & 24h execution delay guards for all vault parameter updates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${
              vaultPaused 
                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}>
              {vaultPaused ? 'Vault Paused' : 'Vault Active'}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider">
              {proposalCount ? `Total Proposals: ${proposalCount.toString()}` : 'Active Multi-Sig: 5/9'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {proposals.map(proposal => (
            <div 
              key={proposal.id} 
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-800 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Proposal #{proposal.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {proposal.type}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                    Target: {proposal.target} | Payload: {proposal.payload}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    proposal.status === "executed"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                      : proposal.status === "queued"
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-500"
                        : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-500"
                  }`}>
                    {proposal.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    ETA: {proposal.eta}
                  </p>
                </div>
              </div>

              {/* Confirmation Progress */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center gap-4">
                <div className="flex-grow">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                    <span>Signer Confirmations</span>
                    <span>{proposal.confirmations} / {proposal.required} Approved</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: `${(proposal.confirmations / proposal.required) * 100}%` }}
                    />
                  </div>
                </div>

                {proposal.status === "pending-approvals" && (
                  <button
                    onClick={() => handleConfirm(proposal.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10 active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>Approve Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features Breakdown */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h3 className="text-lg font-extrabold mb-6 text-slate-900 dark:text-white">
          Institutional Security Architecture
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: '5-of-9 Multi-Sig', desc: 'Critical decisions and emergency pauses require majority approval across distributed keys.' },
            { title: '24h Timelock', desc: 'All parameter changes enforce a rigid 24-hour execution delay.' },
            { title: 'Insurance Fund', desc: '5% of keeper performance yields are routed automatically to protect against systemic exploits.' },
            { title: '2-Day Withdrawal', desc: '48-hour settlement period queue prevents flash-loan sandwich bank runs.' },
            { title: 'Vault TVL Caps', desc: 'Maximum 10M USDC TVL cap explicitly limits concentration risk during the testnet beta.' },
            { title: 'Compliance Audit Trail', desc: 'Every administrative transaction and harvest is logged cryptographically on-chain.' },
          ].map((feature) => (
            <div key={feature.title} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{feature.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
