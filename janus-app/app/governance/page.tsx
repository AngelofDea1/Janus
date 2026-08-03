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
            Institutional-grade depositor protection. Powered by timelocked multi-sigs, withdrawal delays, capital caps, and dedicated insurance funds.
          </p>
        </div>

        {/* Floating Glassmorphic Container */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-6 md:p-10 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          
          {/* Coming Soon Message */}
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Lock className="w-16 h-16 text-slate-700 dark:text-slate-300 mb-6" />
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Governance is Coming Soon</h2>
            <p className="text-slate-500 max-w-md">
              Full decentralization and governance controls will be activated following the official launch on the Arc Mainnet.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
