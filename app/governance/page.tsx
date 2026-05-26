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
      <div className="relative min-h-screen bg-background py-32 flex justify-center px-4">
        <div className="w-full max-w-6xl space-y-8 animate-pulse mt-12">
          <div className="h-12 w-64 bg-black/5 dark:bg-white/5 rounded-2xl" />
          <div className="h-16 w-full bg-panel border border-borderLine rounded-2xl" />
          <div className="h-96 w-full bg-panel border border-borderLine rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-foreground mb-4">
            Governance & Risk
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Depositor protection is built natively into our contract pipeline. Janus enforces automated timelocked multi-sigs, withdrawal delays, capital caps, and exploit insurance funds to achieve institutional resilience.
          </p>
        </div>

        {/* Floating Glassmorphic Container */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-6 md:p-10 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          
          {/* Tab Navigation Menu */}
          <div className="flex gap-2 mb-8 bg-black/5 dark:bg-white/5 p-2 rounded-2xl border border-borderLine overflow-x-auto scrollbar-none -mx-2 px-2">
            {[
              { id: 'overview', label: 'Multi-Sig & Timelock', icon: Lock },
              { id: 'insurance', label: 'Insurance Fund', icon: Shield },
              { id: 'withdrawals', label: 'Withdrawal Queue', icon: Clock },
              { id: 'audit', label: 'Audit Trail', icon: FileSpreadsheet },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-white dark:bg-[#1a1a1a] text-foreground shadow-sm border border-borderLine'
                      : 'text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
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
    </div>
  );
}
