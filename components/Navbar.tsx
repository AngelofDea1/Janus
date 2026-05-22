"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sun, Moon, Shield, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [mounted, setMounted] = useState(false);
 const pathname = usePathname();
 const { theme, setTheme } = useTheme();

 // Ensure hydration matches server
 useEffect(() => {
 setMounted(true);
 }, []);

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
 <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/10 group-hover:scale-105 transition-all duration-300">
 <Shield className="w-5.5 h-5.5 text-white" />
 <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 </div>
 <div>
 <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
 JANUS
 </span>
 <span className="text-[10px] block text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase">
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
 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
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
 className="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/25 transition-all flex items-center gap-1.5"
 >
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
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
 <Sun className="w-4.5 h-4.5 text-indigo-400" />
 ) : (
 <Moon className="w-4.5 h-4.5 text-zinc-900" />
 )}
 </button>
 )}
 
 {/* Sleek Connect Button */}
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
 <div className="fixed inset-0 top-20 bg-white dark:bg-[#060814] z-40 md:hidden p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-slate-200 dark:border-slate-800/40">
 {navLinks.map((link) => {
 const isActive = pathname === link.path;
 return (
 <Link
 key={link.path}
 href={link.path}
 onClick={() => setMobileMenuOpen(false)}
 className={`text-lg font-bold py-2 border-b border-slate-100 dark:border-slate-900 ${
 isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
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
