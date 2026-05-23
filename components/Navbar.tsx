"use client";

import React, { useState, useEffect } from "react";
import { Search, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";

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
      setScrolled(window.scrollY > 10);
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
    { name: "Trade", path: "/app" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Analytics", path: "/analytics" },
    { name: "Docs", path: "/docs" },
    { name: "Governance", path: "/governance" }
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
            </nav>
          </div>

          {/* MIDDLE: Empty to push actions to the right */}
          <div className="hidden md:flex flex-1 max-w-[480px] px-4">
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center justify-end gap-2 flex-1 shrink-0">
            {/* Network Selector Removed */}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:block ml-1">
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
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#050505] pt-20 px-4 lg:hidden">
          <div className="flex flex-col gap-2 mt-4">
            {/* Search removed from mobile menu */}

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
            <div className="pt-6 mt-2 border-t border-borderLine flex justify-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
