"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DocumentationPage() {
  const docs = [
    {
      title: "Protocol Overview",
      description: "Master summary of the Janus architecture and value proposition.",
      link: "/docs/overview"
    },
    {
      title: "User Guide",
      description: "Step-by-step instructions for depositing, withdrawing, and earning.",
      link: "/docs/user-guide"
    },
    {
      title: "Technical Whitepaper",
      description: "Deep dive into the smart contracts, keeper bots, and arbitrage engine.",
      link: "/docs/technical-whitepaper"
    },
    {
      title: "Governance Docs",
      description: "5-of-9 Multisig, timelocks, and path to full DAO decentralization.",
      link: "/docs/governance-documentation"
    },
    {
      title: "Operational Manual",
      description: "Day-to-day operations, emergency procedures, and incident response.",
      link: "/docs/operational-manual"
    },
    {
      title: "FAQ & Support",
      description: "Common questions, wallet issues, and support contact information.",
      link: "/docs/faq-and-troubleshooting"
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Minimal Header */}
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading tracking-tighter text-foreground mb-6">
            Documentation.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to understand, build on, or invest in the Janus Protocol.
          </p>
        </div>

        {/* Minimalist List Layout */}
        <div className="space-y-4">
          {docs.map((doc, idx) => (
            <Link 
              key={idx} 
              href={doc.link} 
              className="group block py-6 border-b border-borderLine hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-accent transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {doc.description}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
