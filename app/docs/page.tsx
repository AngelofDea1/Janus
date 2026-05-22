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
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      link: "/docs/overview"
    },
    {
      title: "User Guide",
      description: "Step-by-step instructions for depositing, withdrawing, and earning.",
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
      link: "/docs/user-guide"
    },
    {
      title: "Technical Whitepaper",
      description: "Deep dive into the smart contracts, keeper bots, and arbitrage engine.",
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      link: "/docs/technical-whitepaper"
    },
    {
      title: "Investor Pitch Deck",
      description: "Financial models, TAM, competitive moat, and fundraising details.",
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      link: "/docs/investor-pitch-deck"
    },
    {
      title: "Governance Docs",
      description: "5-of-9 Multisig, timelocks, and path to full DAO decentralization.",
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      link: "/docs/governance-documentation"
    },
    {
      title: "Operational Manual",
      description: "Day-to-day operations, emergency procedures, and incident response.",
      icon: <Settings className="w-6 h-6 text-indigo-500" />,
      link: "/docs/operational-manual"
    },
    {
      title: "FAQ & Support",
      description: "Common questions, wallet issues, and support contact information.",
      icon: <HelpCircle className="w-6 h-6 text-indigo-500" />,
      link: "/docs/faq-and-troubleshooting"
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 transition-colors py-16 sm:py-24">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/5 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/5 dark:bg-violet-900/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-12">
        {/* Title */}
        <div className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800/60 text-center">
          <div className="inline-flex items-center gap-2 text-indigo-500 font-extrabold text-sm uppercase tracking-wider justify-center w-full">
            <span>Official Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Janus Reference Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to understand, build on, or invest in the Janus Protocol.
          </p>
        </div>

        {/* Grid of Docs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, idx) => (
            <Link 
              key={idx} 
              href={doc.link} 
              className="group p-6 rounded-3xl bg-white dark:bg-[#0b0e1e] border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {doc.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow leading-relaxed">
                {doc.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                Read Document <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Ready to begin yield capture?</h4>
            <p className="text-xs text-slate-500 mt-1">Join institutional allocators executing delta-neutral spreads.</p>
          </div>
          <Link 
            href="/app" 
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group text-sm"
          >
            <span>Launch Arbitrage Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
