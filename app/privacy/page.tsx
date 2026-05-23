"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">
      <div className="max-w-3xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-8 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            As a decentralized application (dApp) operating on the Arc Network blockchain, the Janus Protocol inherently operates transparently. We do not require you to create an account, nor do we collect personal data such as names, email addresses, or phone numbers.
          </p>

          <h2>2. On-Chain Data</h2>
          <p>
            When you interact with the Janus Protocol, your wallet address and transaction history become part of the public blockchain ledger. This information is completely public and immutable. We do not control this public network, and we cannot delete or alter any data that has been broadcasted to the blockchain.
          </p>

          <h2>3. Cookies and Local Storage</h2>
          <p>
            Our interface may use local storage or cookies solely to enhance your user experience, such as remembering your theme preferences (light/dark mode) or UI states. We do not use these tools for tracking or analytics purposes.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            The interface relies on third-party infrastructure (such as RPC providers or wallet providers like MetaMask, WalletConnect). These third parties may have their own privacy policies regarding the collection of IP addresses or other metadata. We encourage you to review their policies.
          </p>

          <h2>5. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last Updated" date.
          </p>
        </div>
      </div>
    </div>
  );
}
