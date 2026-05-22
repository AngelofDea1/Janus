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
      title: "FAQ & Support",
      description: "Common questions, wallet issues, and support contact information.",
      link: "/docs/faq-and-troubleshooting"
    }
  ];

  return (
    <div className="relative min-h-screen bg-background transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[10%] left-[20%] w-[35%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-4 md:px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Everything you need to understand, build on, or invest in the Janus Protocol.
          </p>
        </div>

        {/* Single Sleek Glassmorphic Container for all links */}
        <div className="bg-panel border border-borderLine rounded-[32px] p-2 sm:p-6 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          <div className="flex flex-col">
            {docs.map((doc, idx) => (
              <Link 
                key={idx} 
                href={doc.link} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <div className="mb-4 sm:mb-0 max-w-xl">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground group-hover:text-accent transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                <div className="flex items-center justify-end sm:justify-start">
                  <div className="w-10 h-10 rounded-full border border-borderLine flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
