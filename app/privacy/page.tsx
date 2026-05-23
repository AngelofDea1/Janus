"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
          
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-6 text-foreground">Privacy Policy</h1>
          <p className="text-slate-500 font-mono text-sm mb-12 pb-8 border-b border-borderLine">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">1. Information We Collect</h2>
              <p>
                As a decentralized application (dApp) operating on the Arc Network blockchain, the Janus Protocol inherently operates transparently. We do not require you to create an account, nor do we directly collect personal data such as names, email addresses, or phone numbers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">2. On-Chain Data</h2>
              <p>
                When you interact with the Janus Protocol, your wallet address, transaction history, and contract interactions become part of the public blockchain ledger. This information is completely public and immutable. We do not control this public network, and we cannot delete or alter any data that has been broadcasted to the blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">3. Cookies and Local Storage</h2>
              <p>
                Our interface uses local storage strictly to enhance your user experience, such as remembering your theme preferences (light/dark mode) or UI states (such as active slippage tolerance). We do not use these tools for tracking or analytics purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">4. Third-Party Services</h2>
              <p>
                The interface relies on third-party infrastructure (such as RPC providers and wallet providers like MetaMask, WalletConnect). These third parties may have their own privacy policies regarding the collection of IP addresses or other metadata. We encourage you to review their policies independently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">5. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Effective Date". Continued use of the platform implies acceptance of these terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
