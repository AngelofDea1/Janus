"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConnect, useAccount, useDisconnect, useEnsName } from "wagmi";
import { X, ChevronDown, LogOut, CheckCircle2, ChevronRight } from "lucide-react";
import JanusCoinLogo from "./JanusCoinLogo";

// Renders the icon using the wallet's injected EIP-6963 icon, or falls back to standard CDN images.
const WalletIcon = ({ connector }: { connector: any }) => {
  // EIP-6963 injects a base64 encoded SVG or PNG into `connector.icon`
  if (connector.icon) {
    return <img src={connector.icon} alt={connector.name} className="w-8 h-8 rounded-xl object-contain shadow-sm" />;
  }

  const lowerName = connector.name.toLowerCase();
  let fallbackIcon = "";

  if (lowerName.includes('metamask')) {
    fallbackIcon = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg";
  } else if (lowerName.includes('walletconnect')) {
    fallbackIcon = "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg";
  } else if (lowerName.includes('coinbase')) {
    fallbackIcon = "https://raw.githubusercontent.com/coinbase/coinbase-wallet-sdk/master/packages/wallet-sdk/src/assets/coinbase-wallet-logo.svg";
  } else if (lowerName.includes('rabby')) {
    fallbackIcon = "https://rabby.io/assets/images/logo.svg";
  } else if (lowerName.includes('phantom')) {
    fallbackIcon = "https://phantom.app/img/phantom-logo.svg";
  } else if (lowerName.includes('okx')) {
    fallbackIcon = "https://www.okx.com/cdn/assets/imgs/221/3BE92A5BA12DB3EC.png";
  }

  if (fallbackIcon) {
    return <img src={fallbackIcon} alt={connector.name} className="w-8 h-8 rounded-xl object-contain shadow-sm bg-white p-1" />;
  }

  // Generic fallback if absolutely no icon is provided
  return (
    <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
      {connector.name.charAt(0).toUpperCase()}
    </div>
  );
};

// Animated Quantum Avatar representing the user identity
const QuantumAvatar = ({ address }: { address: string }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-500">
      {/* Glow Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
      
      {/* Outer Orbit */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#avatarGradient)"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="origin-center"
          style={{ animation: 'spin-clockwise 16s linear infinite' }}
        />
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="rgba(249, 115, 22, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
          className="origin-center"
          style={{ animation: 'spin-counter 10s linear infinite' }}
        />
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="url(#avatarGradient)"
          strokeWidth="0.5"
          className="origin-center"
          style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
        />
        
        {/* Core Node and Patterns */}
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Inner physical coin element with Janus Coin Logo */}
      <div className="relative w-16 h-16 rounded-full bg-[#fafafa] dark:bg-[#0d0d0d] border border-orange-500/20 dark:border-orange-500/30 flex items-center justify-center overflow-hidden shadow-inner shadow-orange-500/10 dark:shadow-orange-500/20 group-hover:border-orange-500/50 transition-all duration-500">
        {/* Animated matrix grid or background lines inside the core */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:8px_8px] opacity-40"></div>
        {/* Glowing aura behind the logo */}
        <div className="absolute inset-2 rounded-full bg-orange-500/5 dark:bg-orange-500/10 blur-sm group-hover:opacity-100 transition-opacity"></div>
        {/* Janus Coin Logo */}
        <JanusCoinLogo className="w-11 h-11 relative z-10 group-hover:scale-105 group-hover:rotate-12 transition-all duration-700 ease-out" />
      </div>
      
      {/* Floating data dots/particles */}
      <span className="absolute top-1 left-4 w-1.5 h-1.5 rounded-full bg-orange-500/80 animate-ping" style={{ animationDelay: '0.5s' }}></span>
      <span className="absolute bottom-2 right-5 w-1 h-1 rounded-full bg-rose-500/80 animate-ping" style={{ animationDelay: '1.2s' }}></span>
    </div>
  );
};

export default function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOtherWallets, setShowOtherWallets] = useState(false);

  const { connectors, connect } = useConnect();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);

  const [displayText, setDisplayText] = useState("");
  const [copied, setCopied] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  useEffect(() => {
    if (address) {
      setDisplayText(ensName || formatAddress(address));
    }
  }, [address, ensName]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);

    const target = "COPIED";
    const chars = "0123456789ABCDEF";
    let iterations = 0;

    const interval = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return target[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterations += 1 / 3;
      if (iterations >= target.length + 1) {
        clearInterval(interval);
        setTimeout(() => {
          setCopied(false);
          setDisplayText(ensName || formatAddress(address));
        }, 1500);
      }
    }, 45);
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowOtherWallets(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setShowOtherWallets(false); // Reset dropdown state when opening modal
  };

  if (!mounted) return <div className="w-32 h-10 bg-black/5 dark:bg-white/5 animate-pulse rounded-full"></div>;

  // --- Deduplicate and categorize connectors ---
  // Normalize names to prevent duplicates like "WalletConnect" and "WalletConnectLegacy"
  const uniqueConnectors = Array.from(new Map(connectors.map(c => {
    let normalizedName = c.name;
    if (normalizedName.toLowerCase().includes('walletconnect')) normalizedName = 'WalletConnect';
    if (normalizedName.toLowerCase().includes('metamask')) normalizedName = 'MetaMask';
    return [normalizedName, c];
  })).values());

  // Define prominent wallets that should be shown in the main list
  const prominentNames = ['metamask', 'okx wallet', 'rabby wallet', 'phantom', 'coinbase wallet', 'walletconnect'];

  const prominentConnectors = uniqueConnectors.filter(c => prominentNames.some(name => c.name.toLowerCase().includes(name)));
  const otherConnectors = uniqueConnectors.filter(c => !prominentNames.some(name => c.name.toLowerCase().includes(name)) && c.id !== 'injected');

  // We are removing the featured connector logic because the user asked not to recommend any wallet.
  const mainListConnectors = prominentConnectors;

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={toggleModal}
          className="bg-foreground text-background hover:opacity-90 font-bold px-5 py-2.5 text-sm rounded-full transition-all flex items-center gap-2 shadow-sm"
        >
          Connect
        </button>
      ) : (
        <button
          onClick={toggleModal}
          className="bg-white dark:bg-[#1a1a1a] border border-borderLine hover:bg-black/5 dark:hover:bg-white/5 text-foreground font-medium px-4 py-2 rounded-full transition-all flex items-center gap-2 shadow-sm"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></div>
          {ensName || formatAddress(address)}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin-clockwise {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-counter {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes pulse-ring {
              0% { transform: scale(0.9); opacity: 0.4; }
              50% { transform: scale(1.05); opacity: 0.7; }
              100% { transform: scale(0.9); opacity: 0.4; }
            }
            @keyframes sweep {
              0% { transform: translateX(-150%) skewX(-12deg); }
              50% { transform: translateX(250%) skewX(-12deg); }
              100% { transform: translateX(250%) skewX(-12deg); }
            }
          `}} />
          <div
            ref={modalRef}
            className="w-full max-w-[400px] bg-panel dark:bg-[#121212] rounded-[32px] shadow-premium-dark border border-borderLine flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/5">
              <h3 className="font-heading font-semibold text-lg">
                {isConnected ? "Account" : "Connect a wallet"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-foreground transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto custom-scrollbar pb-6 px-4">
              {isConnected ? (
                <div className="space-y-6 mt-4 px-2">
                  {/* Holographic ID Pass Card */}
                  <div
                    onClick={handleCopy}
                    className="relative overflow-hidden rounded-[28px] p-6 border border-white/10 dark:border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent hover:from-white/[0.08] hover:to-white/[0.02] shadow-2xl flex flex-col items-center select-none group cursor-pointer transition-all duration-300"
                    title="Click to copy address"
                  >
                    {/* Glowing Aura Hover Effect */}
                    <div className="absolute -inset-px rounded-[28px] bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                    
                    {/* Animated sweep line */}
                    <div className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none -skew-x-12 translate-x-[-150%] group-hover:animate-sweep" style={{ animation: 'sweep 2s ease-in-out infinite' }} />

                    {/* Quantum Avatar */}
                    <QuantumAvatar address={address || ""} />

                    {/* Address Text */}
                    <div className="relative font-mono text-lg font-bold tracking-wider text-foreground select-none">
                      <span className={`transition-all duration-300 ${copied ? 'text-emerald-500 shadow-glow font-heading tracking-wide' : 'text-foreground'}`}>
                        {displayText}
                      </span>
                    </div>

                    {/* Copy Success Feedback */}
                    <div className="mt-2 text-[11px] font-heading font-medium tracking-wide uppercase flex items-center gap-1.5 text-slate-500 transition-all duration-300 group-hover:text-orange-500">
                      {copied ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Copied to Clipboard
                        </span>
                      ) : (
                        <span className="opacity-70 group-hover:opacity-100 flex items-center gap-1">
                          Click Card to Copy Address
                        </span>
                      )}
                    </div>

                    {/* Session Metadata */}
                    {activeConnector && (
                      <div className="mt-5 w-full pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-heading">Wallet Type</span>
                        <span className="font-mono bg-white/5 px-2.5 py-0.5 rounded text-foreground">{activeConnector.name}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      disconnect();
                      if (typeof window !== "undefined") {
                        localStorage.setItem("janus_wallet_connected", "false");
                        localStorage.setItem("janus_wallet_address", "");
                      }
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium py-4 rounded-2xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {/* Main List of Prominent Wallets */}
                  <div className="space-y-1">
                    {mainListConnectors.map((connector) => {
                      const isMetaMaskDetected = typeof window !== 'undefined' && (
                        !!(window as any).ethereum?.isMetaMask ||
                        !!(window as any).ethereum?.providers?.some((p: any) => p.isMetaMask)
                      );
                      const isCoinbaseDetected = typeof window !== 'undefined' && (
                        !!(window as any).ethereum?.isCoinbaseWallet ||
                        !!(window as any).ethereum?.providers?.some((p: any) => p.isCoinbaseWallet)
                      );

                      const isDetected = !!connector.icon ||
                        (connector.name.toLowerCase().includes('metamask') && isMetaMaskDetected) ||
                        (connector.name.toLowerCase().includes('coinbase') && isCoinbaseDetected);

                      return (
                        <button
                          key={connector.uid}
                          onClick={() => {
                            connect({ connector });
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 group-hover:scale-110 transition-transform">
                              <WalletIcon connector={connector} />
                            </div>
                            <span className="font-medium text-[15px]">{connector.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isDetected && (
                              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                                Detected
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* "Other Wallets" Dropdown Accordion */}
                  {otherConnectors.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowOtherWallets(!showOtherWallets)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                      >
                        <span className="font-medium text-[15px] text-slate-800 dark:text-slate-300 group-hover:text-foreground transition-colors">
                          Other wallets
                        </span>
                        {showOtherWallets ? (
                          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        )}
                      </button>

                      {showOtherWallets && (
                        <div className="space-y-1 mt-1 animate-in slide-in-from-top-2 fade-in duration-200 pl-2 border-l-2 border-borderLine ml-2">
                          {otherConnectors.map((connector) => {
                            const isDetected = !!connector.icon;
                            return (
                              <button
                                key={connector.uid}
                                onClick={() => {
                                  connect({ connector });
                                  setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="shrink-0 group-hover:scale-110 transition-transform">
                                    <WalletIcon connector={connector} />
                                  </div>
                                  <span className="font-medium text-sm text-slate-800 dark:text-slate-300 group-hover:text-foreground transition-colors">{connector.name}</span>
                                </div>
                                {isDetected && (
                                  <span className="text-[10px] font-medium text-slate-500">Detected</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="pt-6 px-4 text-center">
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
