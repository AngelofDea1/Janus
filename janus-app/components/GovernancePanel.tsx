"use client";

import React, { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { ArrowRight, Shield, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
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

const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 104,
    type: "Update Keeper Address",
    target: "JanusVault",
    payload: "0x59e2532e40982e4233b2cec2d074ad9e6a120f00",
    eta: "Within 24 Hours",
    status: "pending-approvals",
    confirmations: 4,
    required: 5,
  },
  {
    id: 103,
    type: "Adjust Estimated APY Display",
    target: "JanusVault",
    payload: "Target Set: 35.2%",
    eta: "Expires in 4 days",
    status: "queued",
    confirmations: 5,
    required: 5,
  },
  {
    id: 102,
    type: "Disburse Exploit Coverage",
    target: "JanusInsuranceFund",
    payload: "Recipient: 0x8a92... Amount: 2,500 USDC",
    eta: "Executed 2 hours ago",
    status: "executed",
    confirmations: 6,
    required: 5,
  },
];

const STATUS_STYLES: Record<string, string> = {
  "pending-approvals": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  queued: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  executed: "text-[#4F46E5] bg-[#4F46E5]/10 border-[#4F46E5]/20",
  cancelled: "text-red-500 bg-red-500/10 border-red-500/20",
};

export default function GovernancePanel() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [dataSource, setDataSource] = useState<"onchain" | "demo">("onchain");

  const { data: vaultPaused, isLoading: pausedLoading } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: "vaultPaused",
  });

  const { data: proposalCount, isSuccess: countLoaded } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: "getProposalCount",
  });

  // If we got real proposal count from chain, mark data as on-chain
  useEffect(() => {
    if (countLoaded && proposalCount !== undefined) {
      setDataSource("onchain");
    }
  }, [countLoaded, proposalCount]);

  const handleConfirm = (id: number) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id && p.confirmations < p.required) {
          const nextConf = p.confirmations + 1;
          return {
            ...p,
            confirmations: nextConf,
            status: nextConf >= p.required ? "queued" : p.status,
          };
        }
        return p;
      })
    );
  };

  const liveCount = proposalCount ? Number(proposalCount) : null;

  return (
    <div className="space-y-16">
      {/* Main Governance UI */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-8">
          <div>
            <h3 className="font-heading font-medium text-xl text-foreground mb-1">
              Timelocked Multi-Sig Governance
            </h3>
            <p className="text-sm text-slate-500">
              Enforcing 5-of-9 validator thresholds &amp; 24h execution delay guards for all vault parameter updates.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="border-b border-borderLine pb-6 last:border-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                      Proposal #{proposal.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[proposal.status]}`}>
                      {proposal.status.replace("-", " ")}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-foreground mb-1">{proposal.type}</h4>
                  <p className="text-sm text-slate-500 font-mono break-all">
                    Target: {proposal.target} | {proposal.payload}
                  </p>
                </div>

                <div className="md:text-right shrink-0">
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 md:justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {proposal.eta}
                  </p>
                </div>
              </div>

              {/* Confirmation Progress */}
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:flex-grow">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Signer Confirmations</span>
                    <span>{proposal.confirmations} / {proposal.required} Approved</span>
                  </div>
                  <div className="h-[2px] w-full bg-borderLine overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        proposal.confirmations >= proposal.required ? "bg-[#4F46E5]" : "bg-foreground"
                      }`}
                      style={{ width: `${(proposal.confirmations / proposal.required) * 100}%` }}
                    />
                  </div>
                </div>

                {proposal.status === "pending-approvals" && (
                  <button
                    onClick={() => handleConfirm(proposal.id)}
                    className="shrink-0 px-6 py-2.5 rounded-xl bg-foreground text-background font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-none hover:opacity-90 transition-all"
                  >
                    <span>Approve</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {proposal.status === "executed" && (
                  <CheckCircle2 className="w-5 h-5 text-[#4F46E5] shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features Breakdown */}
      <div>
        <h3 className="text-xl font-heading font-medium text-foreground mb-6">
          Institutional Security Architecture
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {[
            { title: "5-of-9 Multi-Sig", desc: "Critical decisions and emergency pauses require majority approval across distributed keys." },
            { title: "24h Timelock", desc: "All parameter changes enforce a rigid 24-hour execution delay." },
            { title: "Insurance Fund", desc: "5% of keeper performance yields are routed automatically to protect against systemic exploits." },
            { title: "2-Day Withdrawal", desc: "48-hour settlement period queue prevents flash-loan sandwich bank runs." },
            { title: "Vault TVL Caps", desc: "Maximum 10M USDC TVL cap explicitly limits concentration risk during the testnet beta." },
            { title: "Compliance Audit Trail", desc: "Every administrative transaction and harvest is logged cryptographically on-chain." },
          ].map((feature) => (
            <div key={feature.title}>
              <div className="font-medium text-sm text-foreground mb-2">{feature.title}</div>
              <div className="text-sm text-slate-500 leading-relaxed">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
