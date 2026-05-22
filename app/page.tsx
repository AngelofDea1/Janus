import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Activity, 
  Lock,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      
      {/* Subtle Premium Background Mesh (Solid layered circles instead of gradients) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            V2 Protocol Now Live on Arc
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
            Institutional yield, <br className="hidden md:block"/>
            <span className="text-slate-400 dark:text-slate-500">fully automated.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Janus executes delta-neutral funding rate arbitrage across tier-1 perpetual exchanges. Deposit USDC and earn passive yield powered by machine learning algorithms.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link 
              href="/app" 
              className="px-8 py-4 rounded-full bg-accent text-white font-medium hover:bg-accentHover transition-all hover:shadow-premium-hover active:scale-95 flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/docs" 
              className="px-8 py-4 rounded-full bg-panel text-foreground border border-borderLine font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Read the Docs
            </Link>
          </div>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: <Shield className="w-6 h-6 text-accent" />,
              title: "Delta-Neutral Design",
              desc: "Principal value is protected from market volatility. Yield is generated purely through funding rate discrepancies."
            },
            {
              icon: <Activity className="w-6 h-6 text-accent" />,
              title: "Algorithmic Routing",
              desc: "Keeper bots constantly monitor Binance, Bybit, and Hyperliquid to route capital to the highest-yielding opportunities."
            },
            {
              icon: <Lock className="w-6 h-6 text-accent" />,
              title: "ERC-4626 Vault Standard",
              desc: "Fully compliant with the ERC-4626 standard. Your shares represent your claim on the USDC principal and accrued yield."
            }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-3xl bg-panel border border-borderLine shadow-sm hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Protocol Stats Overview */}
        <div className="mt-32 border border-borderLine rounded-3xl bg-panel overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-borderLine">
            {[
              { label: "Total Value Locked", val: "$148.92M" },
              { label: "30-Day Avg APY", val: "28.9%" },
              { label: "Total Yield Generated", val: "$12.4M" }
            ].map((stat, idx) => (
              <div key={idx} className="p-10 flex flex-col items-center justify-center text-center">
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-2">{stat.label}</div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-foreground">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
