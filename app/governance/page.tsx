"use client";

import React, { useState } from "react";
import GovernancePanel from "@/components/GovernancePanel";
import InsuranceFundDisplay from "@/components/InsuranceFundDisplay";
import WithdrawalQueue from "@/components/WithdrawalQueue";
import AuditTrail from "@/components/AuditTrail";
import { Shield, Lock, Clock, FileSpreadsheet } from "lucide-react";

export default function GovernancePage() {
 const [activeTab, setActiveTab] = useState<"overview" | "insurance" | "withdrawals" | "audit">("overview");
 const [mounted, setMounted] = useState(false);

 React.useEffect(() => {
 setMounted(true);
 }, []);

 if (!mounted) {
 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col items-center justify-center py-24">
 <div className="relative flex flex-col items-center max-w-sm text-center px-6">
 <div className="relative w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 animate-pulse">
 <Shield className="w-8 h-8 text-indigo-500" />
 <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 animate-ping opacity-75" />
 </div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
 Loading Sovereign Safety Portal
 </h2>
 <p className="text-xs text-slate-500 leading-relaxed">
 Establishing secure pipeline with Arc Testnet validators and verifying collateral reserves...
 </p>
 <div className="mt-6 w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
 
 {/* Background aesthetics */}
 <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

 <div className="max-w-6xl mx-auto relative z-10">
 
 {/* Header Section */}
 <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
 <div>

 <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
 Sovereign Governance & Risk Portal
 </h1>
 <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
 Depositor protection is built natively into our contract pipeline. Janus enforces automated timelocked multi-sigs, withdrawal delays, capital caps, and exploit insurance funds to achieve institutional resilience.
 </p>
 </div>
 </div>

 {/* Tab Navigation Menu */}
 <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
 {[
 { id: 'overview', label: 'Multi-Sig & Timelock', icon: Lock },
 { id: 'insurance', label: 'Exploit Insurance Fund', icon: Shield },
 { id: 'withdrawals', label: 'Withdrawal Queue Settlement', icon: Clock },
 { id: 'audit', label: 'On-Chain Audit Trail', icon: FileSpreadsheet },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`snap-start px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
 isActive
 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-100'
 : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 scale-95 hover:scale-100'
 }`}
 >
 {tab.label}
 </button>
 );
 })}
 </div>

 {/* Dynamic Tab Rendering Content */}
 <div className="transition-all duration-300">
 {activeTab === 'overview' && <GovernancePanel />}
 {activeTab === 'insurance' && <InsuranceFundDisplay />}
 {activeTab === 'withdrawals' && <WithdrawalQueue />}
 {activeTab === 'audit' && <AuditTrail />}
 </div>

 </div>
 </div>
 );
}
