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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-24">
        <div className="relative flex flex-col items-center max-w-sm text-center px-6">
          <div className="relative w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 animate-pulse">
            <Shield className="w-8 h-8 text-accent" />
            <div className="absolute inset-0 rounded-2xl border border-accent/30 animate-ping opacity-75" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Loading Sovereign Safety Portal
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-accent/5 dark:bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-borderLine pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight mb-4">
              Sovereign Governance & Risk
            </h1>
            <p className="text-slate-500 max-w-3xl leading-relaxed">
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
                className={`snap-start px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-accent border-accent text-white shadow-premium'
                    : 'bg-panel border-borderLine text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Rendering Content */}
        <div className="transition-all duration-300">
          <div className="bg-panel rounded-3xl border border-borderLine shadow-sm overflow-hidden">
            {activeTab === 'overview' && <GovernancePanel />}
            {activeTab === 'insurance' && <InsuranceFundDisplay />}
            {activeTab === 'withdrawals' && <WithdrawalQueue />}
            {activeTab === 'audit' && <AuditTrail />}
          </div>
        </div>

      </div>
    </div>
  );
}
