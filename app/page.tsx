import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center selection:bg-accent/20">
      
      {/* Absolute Minimalism - Single subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-accent/5 dark:bg-accent/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Stark Typography */}
        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-heading font-extrabold tracking-tighter text-foreground leading-[0.95] mb-8">
          Yield. <br className="hidden md:block"/>
          <span className="text-black/20 dark:text-white/20">Automated.</span>
        </h1>

        <p className="text-xl md:text-3xl text-slate-500 dark:text-slate-400/80 font-medium max-w-3xl leading-snug tracking-tight mb-16">
          The sovereign delta-neutral liquidity engine. Zero manual execution. Pure absolute returns.
        </p>

        {/* Minimalist Action */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            href="/app" 
            className="px-10 py-5 rounded-3xl bg-foreground text-background font-bold text-lg hover:bg-accent hover:text-white transition-all active:scale-[0.98] flex items-center gap-3"
          >
            Launch Terminal
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/docs" 
            className="px-10 py-5 rounded-3xl bg-transparent text-foreground font-semibold text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Read Documentation
          </Link>
        </div>

        {/* Abstract Metrics - Floating, Borderless */}
        <div className="mt-32 md:mt-48 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 opacity-60">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-500 mb-1 tracking-widest uppercase">Protocol TVL</div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">$148.9M</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-borderLine" />
          <div className="text-center">
            <div className="text-sm font-medium text-slate-500 mb-1 tracking-widest uppercase">30D Yield</div>
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">28.9%</div>
          </div>
        </div>

      </div>
    </div>
  );
}
