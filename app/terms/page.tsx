"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-12 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-panel border border-borderLine rounded-[32px] p-8 md:p-16 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-6 text-foreground">Terms of Service</h1>
          <p className="text-slate-500 font-mono text-sm mb-12 pb-8 border-b border-borderLine">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Janus Protocol ("Protocol", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Protocol.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">2. Description of Service</h2>
              <p>
                Janus Protocol is a decentralized, non-custodial smart contract system deployed on the Arc Network. It facilitates automated delta-neutral funding rate arbitrage. We do not have custody of your funds; all transactions are executed autonomously by open-source smart contracts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">3. Risks and Disclaimers</h2>
              <p>
                The use of decentralized finance (DeFi) protocols involves significant risks, including but not limited to smart contract vulnerabilities, regulatory uncertainties, and extreme market volatility. The Janus Protocol is provided "as is" without any warranties of any kind. You acknowledge that you are solely responsible for evaluating the risks associated with using the Protocol and that you could lose some or all of your deposited assets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">4. User Responsibilities</h2>
              <p>
                You are responsible for securing your own private keys and wallets. You agree not to use the Protocol for any illegal activities, including money laundering, terrorist financing, or circumventing sanctions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">5. Amendments</h2>
              <p>
                We reserve the right to amend these Terms at any time without prior notice. Your continued use of the Protocol following any changes indicates your acceptance of the new Terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
