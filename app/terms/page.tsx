"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">
      <div className="max-w-3xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-8 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using the Janus Protocol ("Protocol", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Protocol.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Janus Protocol is a decentralized, non-custodial smart contract system deployed on the Arc Network. It facilitates automated delta-neutral funding rate arbitrage. We do not have custody of your funds; all transactions are executed autonomously by smart contracts.
          </p>

          <h2>3. Risks and Disclaimers</h2>
          <p>
            The use of decentralized finance (DeFi) protocols involves significant risks, including but not limited to smart contract vulnerabilities, regulatory uncertainties, and extreme market volatility. The Janus Protocol is provided "as is" without any warranties of any kind. You acknowledge that you are solely responsible for evaluating the risks associated with using the Protocol and that you could lose some or all of your deposited assets.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>
            You are responsible for securing your own private keys and wallets. You agree not to use the Protocol for any illegal activities, including money laundering or terrorist financing.
          </p>

          <h2>5. Amendments</h2>
          <p>
            We reserve the right to amend these Terms at any time without prior notice. Your continued use of the Protocol following any changes indicates your acceptance of the new Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
