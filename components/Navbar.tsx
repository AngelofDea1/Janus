"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, Menu, X, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const navLinks = [
    { name: "Trade", path: "/app" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Analytics", path: "/analytics" },
    { name: "Ledger", path: "/ledger" },
    { name: "Governance", path: "/governance" }
  ];

  const moreLinks = [
    { name: "Documentation", path: "/docs", external: false },
    { name: "Twitter", path: "https://twitter.com/JanusProtocol", external: true },
    { name: "Discord", path: "https://discord.gg/janus", external: true },
    { divider: true },
    { name: "Terms of Service", path: "/terms", external: false },
    { name: "Privacy Policy", path: "/privacy", external: false },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-borderLine" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-full px-4 h-[72px] flex items-center justify-between">
          
          {/* LEFT: Logo + Nav Links */}
          <div className="flex items-center gap-6 xl:gap-8 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-heading font-bold shadow-sm transition-transform group-hover:scale-105">
                J
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`px-3 py-2 rounded-xl text-[15px] font-medium transition-all ${
                      isActive 
                        ? "text-foreground font-semibold" 
                        : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`px-3 py-2 rounded-xl text-[15px] font-medium transition-all flex items-center gap-1 ${
                    moreOpen
                      ? "text-foreground bg-black/5 dark:bg-white/5"
                      : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  More
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#111] border border-borderLine rounded-2xl shadow-2xl dark:shadow-black/40 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {moreLinks.map((link, idx) => {
                      if ('divider' in link && link.divider) {
                        return <div key={idx} className="my-2 border-t border-borderLine" />;
                      }
                      if (link.external) {
                        return (
                          <a
                            key={link.name}
                            href={link.path}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            {link.name}
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={link.name}
                          href={link.path!}
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* MIDDLE: Spacer */}
          <div className="hidden md:flex flex-1 max-w-[480px] px-4" />

          {/* RIGHT: Actions */}
          <div className="flex items-center justify-end gap-2 flex-1 shrink-0">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="ml-1">
              <ConnectWallet />
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#050505] pt-20 px-4 lg:hidden overflow-y-auto">
          <div className="flex flex-col gap-2 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-lg font-medium transition-all ${
                  pathname === link.path 
                    ? "bg-black/5 dark:bg-white/5 text-foreground" 
                    : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-3 border-t border-borderLine" />

            {/* Secondary Links */}
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl text-lg font-medium text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Documentation
            </Link>
            <a
              href="https://twitter.com/JanusProtocol"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl text-lg font-medium text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-between"
            >
              Twitter
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://discord.gg/janus"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl text-lg font-medium text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-between"
            >
              Discord
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Legal */}
            <div className="my-3 border-t border-borderLine" />
            <div className="flex gap-4 px-3 pb-4">
              <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-400 hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-400 hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>

            {/* Connect Wallet */}
            <div className="pt-4 border-t border-borderLine flex justify-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
