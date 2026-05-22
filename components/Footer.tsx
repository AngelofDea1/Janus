"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
 return (
 <footer className="relative z-10 border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-[#060814]/80 backdrop-blur-md py-12 transition-colors">
 <div className="max-w-7xl mx-auto px-6">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
 
 <div className="col-span-2 md:col-span-1">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-500">J</div>
 <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Janus</span>
 </div>
 <p className="text-sm text-slate-500 dark:text-slate-400">
 Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.
 </p>
 </div>

 <div>
 <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Product</h4>
 <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
 <Link href="/app" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Arbitrage Vault</Link>
 <Link href="/analytics" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Analytics Feed</Link>
 <Link href="/governance" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Contract Security</Link>
 </div>
 </div>

 <div>
 <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Developers</h4>
 <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
 <Link href="/docs" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Documentation</Link>
 <a href="https://github.com/AngelofDea1/Janus" target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">GitHub Repository</a>
 <Link href="/docs" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Keeper API Docs</Link>
 </div>
 </div>

 <div>
 <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Community</h4>
 <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
 <a href="https://twitter.com/JanusProtocol" target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Twitter Feed</a>
 <a href="https://discord.gg/janus" target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Discord Portal</a>
 <Link href="/docs" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Protocol Blog</Link>
 </div>
 </div>

 </div>

 <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
 <div> 2026 Janus Protocol. All rights reserved.</div>
 <div className="flex gap-6">
 <Link href="/docs" className="hover:text-indigo-500 transition-colors">Terms of Service</Link>
 <Link href="/docs" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
 <div className="flex items-center gap-1.5">
 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
 All Systems Operational
 </div>
 </div>
 </div>
 </div>
 </footer>
 );
}
