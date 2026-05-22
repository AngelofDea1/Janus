"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync with document class
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    { name: "Terminal", path: "/app" },
    { name: "Analytics", path: "/analytics" },
    { name: "Developers", path: "/docs" },
    { name: "Governance", path: "/governance" }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/70 dark:bg-[#050505]/70 backdrop-blur-xl border-b border-borderLine" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-heading font-bold shadow-premium transition-transform group-hover:scale-105">
              J
            </div>
            <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">
              Janus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-black/5 dark:bg-white/5 rounded-full px-2 py-1.5 border border-borderLine">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.path 
                    ? "bg-white dark:bg-[#1a1a1a] shadow-sm text-foreground" 
                    : "text-slate-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-foreground transition-colors border border-borderLine"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="hidden sm:block">
              <ConnectButton 
                chainStatus="icon" 
                showBalance={false}
              />
            </div>

            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#050505] pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-4 rounded-2xl text-lg font-medium transition-all ${
                  pathname === link.path 
                    ? "bg-black/5 dark:bg-white/5 text-foreground" 
                    : "text-slate-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 border-t border-borderLine flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
