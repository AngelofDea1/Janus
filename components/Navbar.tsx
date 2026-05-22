"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sun, Moon, Square, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "VAULT_TERMINAL", path: "/app" },
    { name: "GOVERNANCE", path: "/governance" },
    { name: "ANALYTICS", path: "/analytics" },
    { name: "DOCS", path: "/docs" }
  ];

  return (
    <nav className="sticky top-0 w-full bg-white dark:bg-black border-b border-black/10 dark:border-white/10 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between border-x border-black/10 dark:border-white/10 h-16">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center h-full px-6 border-r border-black/10 dark:border-white/10 group bg-black text-white dark:bg-white dark:text-black hover:invert transition-all duration-0">
          <div className="flex flex-col justify-center">
            <span className="font-heading font-bold text-xl tracking-tighter uppercase leading-none">
              JANUS
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest mt-0.5">
              Protocol
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`px-6 flex items-center border-r border-black/10 dark:border-white/10 text-xs font-mono tracking-widest uppercase transition-colors duration-0 ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex-grow hidden md:block"></div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center h-full">
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="h-full px-6 flex items-center gap-2 border-l border-black/10 dark:border-white/10 text-xs font-mono font-bold hover:bg-emerald-500 hover:text-white transition-colors duration-0 dark:hover:bg-emerald-400 dark:hover:text-black"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-none border border-black dark:border-white animate-pulse" />
            FAUCET
          </a>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="h-full px-5 border-l border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-0 flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" strokeWidth={2} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={2} />
              )}
            </button>
          )}
          
          <div className="h-full flex items-center px-4 border-l border-black/10 dark:border-white/10">
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center h-full">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-full px-4 border-l border-black/10 dark:border-white/10 flex items-center justify-center"
            >
              {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
          )}
          <button
            className="h-full px-4 border-l border-black/10 dark:border-white/10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 dark:border-white/10 bg-white dark:bg-black border-x border-black/10 dark:border-white/10 max-w-[1400px] mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-6 py-4 border-b border-black/10 dark:border-white/10 font-mono text-sm uppercase tracking-widest ${
                  isActive ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="p-6">
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
          </div>
        </div>
      )}
    </nav>
  );
}
