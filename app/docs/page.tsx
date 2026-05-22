"use client";

import React from "react";
import { 
  Shield, 
  BookOpen, 
  ArrowRight,
  FileText,
  Users,
  Briefcase,
  Settings,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const docs = [
    {
      title: "Protocol Overview",
      description: "Master summary of the Janus architecture and value proposition.",
      icon: <FileText className="w-6 h-6 text-accent" />,
      link: "/docs/overview"
    },
    {
      title: "User Guide",
      description: "Step-by-step instructions for depositing, withdrawing, and earning.",
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      link: "/docs/user-guide"
    },
    {
      title: "Technical Whitepaper",
      description: "Deep dive into the smart contracts, keeper bots, and arbitrage engine.",
      icon: <Shield className="w-6 h-6 text-accent" />,
      link: "/docs/technical-whitepaper"
    },
    {
      title: "Governance Docs",
      description: "5-of-9 Multisig, timelocks, and path to full DAO decentralization.",
      icon: <Users className="w-6 h-6 text-accent" />,
      link: "/docs/governance-documentation"
    },
    {
      title: "Operational Manual",
      description: "Day-to-day operations, emergency procedures, and incident response.",
      icon: <Settings className="w-6 h-6 text-accent" />,
      link: "/docs/operational-manual"
    },
    {
      title: "FAQ & Support",
      description: "Common questions, wallet issues, and support contact information.",
      icon: <HelpCircle className="w-6 h-6 text-accent" />,
      link: "/docs/faq-and-troubleshooting"
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-background text-foreground transition-colors py-16 sm:py-24">
      {/* Premium Ambient Background Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-12">
        {/* Title */}
        <div className="space-y-4 pb-8 border-b border-borderLine text-center">
          <div className="inline-flex items-center gap-2 text-accent font-bold text-sm justify-center w-full">
            <span>Official Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-foreground">
            Janus Reference Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to understand, build on, or invest in the Janus Protocol.
          </p>
        </div>

        {/* Grid of Docs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, idx) => (
            <Link 
              key={idx} 
              href={doc.link} 
              className="group p-8 rounded-3xl bg-panel border border-borderLine hover:border-accent/50 transition-all hover:shadow-premium dark:hover:shadow-premium-dark flex flex-col h-full cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                {doc.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-2 text-foreground group-hover:text-accent transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow leading-relaxed">
                {doc.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent">
                Read Document <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="pt-12 border-t border-borderLine flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-bold text-lg text-foreground">Ready to begin yield capture?</h4>
            <p className="text-sm text-slate-500 mt-1">Join institutional allocators executing delta-neutral spreads.</p>
          </div>
          <Link 
            href="/app" 
            className="px-6 py-4 bg-accent hover:bg-accentHover text-white rounded-2xl font-bold transition-all shadow-premium hover:shadow-premium-hover flex items-center gap-2 group"
          >
            <span>Launch Arbitrage Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
