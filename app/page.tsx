import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center">
      
      {/* Subtle Premium Background Mesh */}
      <div className="absolute top-[15%] left-[25%] w-[35%] h-[45%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Main Glassmorphic Hero Panel */}
        <div className="bg-panel border border-borderLine rounded-[40px] p-10 md:p-16 shadow-premium dark:shadow-premium-dark backdrop-blur-xl w-full max-w-4xl text-center flex flex-col items-center transition-all">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-8 border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Janus Protocol v1.0 Live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-heading font-extrabold tracking-tighter text-foreground leading-[1.05] mb-6">
            Yield. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet-500">Automated.</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-10">
            The sovereign delta-neutral liquidity engine. Zero manual execution. Pure absolute returns engineered for the next era of DeFi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/app" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accentHover shadow-premium hover:shadow-premium-hover transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/docs" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-black/5 dark:bg-[#09090b] text-foreground font-semibold text-lg border border-borderLine hover:border-slate-300 dark:hover:border-slate-700 transition-all text-center"
            >
              Read Docs
            </Link>
          </div>
        </div>

        {/* Abstract Metrics - Floating Info Cards Below Hero */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm flex items-center justify-between backdrop-blur-md">
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Protocol TVL</div>
              <div className="text-3xl font-heading font-bold text-foreground">$148.9M</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          
          <div className="bg-panel border border-borderLine rounded-3xl p-8 shadow-sm flex items-center justify-between backdrop-blur-md">
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">30D Yield</div>
              <div className="text-3xl font-heading font-bold text-emerald-500">28.9%</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
