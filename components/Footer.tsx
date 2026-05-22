"use client";

import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-white dark:bg-black font-mono">
      <div className="max-w-[1400px] mx-auto border-x border-black/10 dark:border-white/10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-black/10 dark:border-white/10">
          <div className="p-8 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-heading font-black text-2xl uppercase tracking-tighter mb-2">
                Janus
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                Delta-neutral funding rate arbitrage execution protocol.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-500">
              <Terminal className="w-3 h-3" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {[
            {
              title: "Protocol",
              links: [
                { name: "Terminal", path: "/app" },
                { name: "Analytics", path: "/analytics" },
                { name: "Governance", path: "/governance" }
              ]
            },
            {
              title: "Developers",
              links: [
                { name: "Documentation", path: "/docs" },
                { name: "Keeper API", path: "/docs" },
                { name: "GitHub", path: "https://github.com/AngelofDea1/Janus", external: true }
              ]
            },
            {
              title: "Network",
              links: [
                { name: "Twitter", path: "https://twitter.com/JanusProtocol", external: true },
                { name: "Discord", path: "https://discord.gg/janus", external: true },
                { name: "Blog", path: "/docs" }
              ]
            }
          ].map((section, idx) => (
            <div key={idx} className="p-8 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 last:border-r-0">
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">[{section.title}]</h4>
              <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {section.links.map(l => 
                  l.external ? (
                    <a key={l.name} href={l.path} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">{l.name}</a>
                  ) : (
                    <Link key={l.name} href={l.path} className="hover:text-black dark:hover:text-white transition-colors">{l.name}</Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 gap-4">
          <div>© 2026 JANUS PROTOCOL</div>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
