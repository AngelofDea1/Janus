"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-borderLine bg-background py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-heading font-bold shadow-sm">
                J
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                Janus
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Institutional-grade delta-neutral funding rate arbitrage execution protocol on the Arc Network.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
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
                { name: "Keeper API", path: "/docs" }
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
            <div key={idx}>
              <h4 className="font-bold text-sm mb-6 text-foreground">{section.title}</h4>
              <div className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                {section.links.map(l => 
                  l.external ? (
                    <a key={l.name} href={l.path} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">{l.name}</a>
                  ) : (
                    <Link key={l.name} href={l.path} className="hover:text-accent transition-colors">{l.name}</Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-borderLine flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <div>© 2026 Janus Protocol. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
