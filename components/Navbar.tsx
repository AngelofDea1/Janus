"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sun, Moon, Shield, Menu, X, Palette, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [activeTheme, setActiveTheme] = useState("synthwave");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ensure hydration matches server & init custom theme class
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("janus-theme") || "synthwave";
      setActiveTheme(savedTheme);
      document.documentElement.classList.remove('theme-cyberpunk', 'theme-synthwave', 'theme-swiss', 'theme-solarpunk', 'theme-sovereign');
      document.documentElement.classList.add(`theme-${savedTheme}`);
    }
  }, []);

  const changeTheme = (themeName: string) => {
    setActiveTheme(themeName);
    localStorage.setItem("janus-theme", themeName);
    document.documentElement.classList.remove('theme-cyberpunk', 'theme-synthwave', 'theme-swiss', 'theme-solarpunk', 'theme-sovereign');
    document.documentElement.classList.add(`theme-${themeName}`);
    setDropdownOpen(false);
  };

  const navLinks = [
    { name: "Arbitrage Vault", path: "/app" },
    { name: "Governance & Risk", path: "/governance" },
    { name: "Analytics & Stats", path: "/analytics" },
    { name: "Documentation", path: "/docs" }
  ];

  return (
    <nav className="sticky top-0 w-full bg-white/80 dark:bg-[#060814]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/40 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg shadow-[#ccff00]/5 group-hover:scale-105 transition-all duration-300">
            <Shield className="w-5.5 h-5.5 text-[#ccff00]" />
            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">
              JANUS
            </span>
            <span className="text-[10px] block text-[#ccff00] font-bold tracking-widest uppercase">
              Arbitrage Protocol
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/60 transition-colors">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Faucet Link */}
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-bold text-black dark:text-[#ccff00] bg-[#ccff00] dark:bg-[#ccff00]/10 border border-[#ccff00] dark:border-[#ccff00]/20 rounded-xl hover:bg-[#ccff00]/90 dark:hover:bg-[#ccff00]/25 transition-all flex items-center gap-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] dark:bg-[#ccff00]"></span>
            </span>
            <span>Arc Faucet</span>
          </a>
 
          {/* Light/Dark Toggle Switch */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all shadow-sm active:scale-95"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-[#ccff00]" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-zinc-900" />
              )}
            </button>
          )}
          {/* Live Premium Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2.5 text-xs font-bold text-slate-300 bg-zinc-950/80 hover:text-white border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[#ccff00]" />
              <span className="capitalize">{activeTheme === "cyberpunk" ? "Cyber-Quantum" : activeTheme === "synthwave" ? "Neo-Tokyo" : activeTheme === "swiss" ? "Swiss Carbon" : activeTheme === "solarpunk" ? "Emerald Zenith" : "Aether Gold"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-950/95 border border-zinc-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {[
                  { id: "cyberpunk", name: "Cyber-Quantum", color: "bg-[#ccff00]" },
                  { id: "synthwave", name: "Neo-Tokyo", color: "bg-[#ff5d47]" },
                  { id: "swiss", name: "Swiss Carbon", color: "bg-[#f59e0b]" },
                  { id: "solarpunk", name: "Emerald Zenith", color: "bg-[#10b981]" },
                  { id: "sovereign", name: "Aether Gold", color: "bg-[#dfb15b]" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => changeTheme(t.id)}
                    className="w-full px-3 py-2 rounded-lg text-xs text-left text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                  >
                    <span>{t.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* Sleek Minimalist Connect Button */}
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white dark:bg-[#020204] z-40 md:hidden p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-slate-200 dark:border-slate-800/40">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold py-2 border-b border-slate-100 dark:border-slate-900 ${
                  isActive ? "text-[#ccff00]" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 self-start w-full">
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
          </div>
        </div>
      )}
    </nav>
  );
}
