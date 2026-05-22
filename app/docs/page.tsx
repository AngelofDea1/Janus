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
    <div className="relative min-h-screen bg-background transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[10%] left-[20%] w-[35%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-4 md:px-6">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to understand, build on, or invest in the Janus Protocol.
          </p>
        </div>

        {/* Floating Glassmorphic Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc, idx) => (
            <Link 
              key={idx} 
              href={doc.link} 
              className="group bg-panel border border-borderLine rounded-3xl p-8 shadow-sm backdrop-blur-md hover:border-accent/30 transition-all hover:shadow-premium"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-accent transition-colors mb-3">
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center text-sm font-semibold text-accent opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Read documentation <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
