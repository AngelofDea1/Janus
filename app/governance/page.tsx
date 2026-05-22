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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-foreground animate-spin mb-4" />
          <p className="text-xs font-medium text-slate-500">Loading Governance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-heading font-medium tracking-tight text-foreground mb-4">
            Governance & Risk
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
            Depositor protection is built natively into our contract pipeline. Janus enforces automated timelocked multi-sigs, withdrawal delays, capital caps, and exploit insurance funds to achieve institutional resilience.
          </p>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12 border-b border-borderLine pb-4">
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
                className={`relative pb-4 font-medium text-sm transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-slate-500 hover:text-foreground'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-foreground' : 'text-slate-400'}`} />
                {tab.label}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-[-1px] h-0.5 bg-foreground" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Rendering Content */}
        <div className="transition-all duration-300">
          <div>
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
