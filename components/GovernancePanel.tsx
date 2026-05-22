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
 <div className="space-y-16">
 {/* Main Governance UI */}
 <div>
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-8">
 <div>
 <h3 className="font-heading font-medium text-xl text-foreground mb-1">
 Timelocked Multi-Sig Governance
 </h3>
 <p className="text-sm text-slate-500">
 Enforcing 5-of-9 validator thresholds & 24h execution delay guards for all vault parameter updates.
 </p>
 </div>
 <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-medium">
 <span className={vaultPaused ? 'text-red-500' : 'text-slate-500'}>
 {vaultPaused ? 'Vault Paused' : 'Vault Active'}
 </span>
 <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
 <span className="text-slate-500">
 {proposalCount ? `Total Proposals: ${proposalCount.toString()}` : 'Active Multi-Sig: 5/9'}
 </span>
 </div>
 </div>

 <div className="space-y-6">
 {proposals.map(proposal => (
 <div 
 key={proposal.id} 
 className="border-b border-borderLine pb-6"
 >
 <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
 <div>
 <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-2">
 Proposal #{proposal.id}
 </span>
 <h4 className="text-base font-medium text-foreground mb-1">
 {proposal.type}
 </h4>
 <p className="text-sm text-slate-500 font-mono break-all">
 Target: {proposal.target} | Payload: {proposal.payload}
 </p>
 </div>

 <div className="md:text-right">
 <span className="text-xs uppercase tracking-widest font-medium text-slate-500 block mb-2">
 {proposal.status}
 </span>
 <p className="text-sm text-slate-500">
 ETA: {proposal.eta}
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
 <div className="h-[2px] w-full bg-borderLine overflow-hidden">
 <div 
 className="h-full bg-foreground transition-all duration-500" 
 style={{ width: `${(proposal.confirmations / proposal.required) * 100}%` }}
 />
 </div>
 </div>

 {proposal.status === "pending-approvals" && (
 <button
 onClick={() => handleConfirm(proposal.id)}
 className="shrink-0 px-4 py-2 text-sm text-foreground hover:text-slate-500 transition-colors flex items-center gap-2 font-medium"
 >
 <span>Approve</span>
 <ArrowRight className="w-4 h-4" />
 </button>
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
 
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
 {[
 { title: '5-of-9 Multi-Sig', desc: 'Critical decisions and emergency pauses require majority approval across distributed keys.' },
 { title: '24h Timelock', desc: 'All parameter changes enforce a rigid 24-hour execution delay.' },
 { title: 'Insurance Fund', desc: '5% of keeper performance yields are routed automatically to protect against systemic exploits.' },
 { title: '2-Day Withdrawal', desc: '48-hour settlement period queue prevents flash-loan sandwich bank runs.' },
 { title: 'Vault TVL Caps', desc: 'Maximum 10M USDC TVL cap explicitly limits concentration risk during the testnet beta.' },
 { title: 'Compliance Audit Trail', desc: 'Every administrative transaction and harvest is logged cryptographically on-chain.' },
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
