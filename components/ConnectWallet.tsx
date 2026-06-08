"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConnect, useAccount, useDisconnect, useEnsName } from "wagmi";
import { X, ChevronDown, LogOut, CheckCircle2, Copy } from "lucide-react";
import JanusCoinLogo from "./JanusCoinLogo";

// Renders the icon using the wallet's injected EIP-6963 icon, or falls back to standard CDN images.
const WalletIcon = ({ connector }: { connector: any }) => {
  if (connector.icon) {
    return <img src={connector.icon} alt={connector.name} className="w-6 h-6 rounded-md object-contain" />;
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
    return <img src={fallbackIcon} alt={connector.name} className="w-6 h-6 rounded-md object-contain bg-white p-0.5" />;
  }

  return (
    <div className="w-6 h-6 rounded-md bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
      {connector.name.charAt(0).toUpperCase()}
    </div>
  );
};

export default function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { connectors, connect } = useConnect();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!mounted) return <div className="w-32 h-10 bg-black/5 dark:bg-white/5 animate-pulse rounded-full"></div>;

  // Deduplicate and categorize connectors
  const uniqueConnectors = Array.from(new Map(connectors.map(c => {
    let normalizedName = c.name;
    if (normalizedName.toLowerCase().includes('walletconnect')) normalizedName = 'WalletConnect';
    if (normalizedName.toLowerCase().includes('metamask')) normalizedName = 'MetaMask';
    return [normalizedName, c];
  })).values());

  const prominentNames = ['metamask', 'okx wallet', 'rabby wallet', 'phantom', 'coinbase wallet', 'walletconnect'];
  const mainListConnectors = uniqueConnectors.filter(c => prominentNames.some(name => c.name.toLowerCase().includes(name)));

  return (
    <div className="relative" ref={dropdownRef}>
      {!isConnected ? (
        <button
          onClick={toggleDropdown}
          className="bg-foreground text-background hover:opacity-90 font-semibold px-4 py-2 text-sm rounded-full transition-all flex items-center gap-2"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={toggleDropdown}
          className="bg-white dark:bg-[#1a1a1a] border border-borderLine hover:bg-black/5 dark:hover:bg-white/5 text-foreground font-medium px-4 py-2 rounded-full transition-all flex items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full border border-borderLine flex items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5">
            <JanusCoinLogo className="w-2.5 h-2.5" />
          </div>
          {ensName || formatAddress(address)}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-panel dark:bg-[#121212] rounded-2xl shadow-xl border border-borderLine p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
          {isConnected ? (
            <div className="space-y-4">
              {/* Minimal Account Details */}
              <div className="flex items-center gap-3 pb-3 border-b border-borderLine">
                <div className="w-10 h-10 rounded-full border border-borderLine flex items-center justify-center bg-black/5 dark:bg-white/5 overflow-hidden">
                  <JanusCoinLogo className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 hover:text-orange-500 transition-colors text-sm font-mono font-bold"
                  >
                    <span>{ensName || formatAddress(address)}</span>
                    {copied ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 truncate">
                    Connected via {activeConnector?.name || "Wallet"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  disconnect();
                  if (typeof window !== "undefined") {
                    localStorage.setItem("janus_wallet_connected", "false");
                    localStorage.setItem("janus_wallet_address", "");
                  }
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wider px-1">
                Connect Wallet
              </div>
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
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <WalletIcon connector={connector} />
                        <span className="font-medium text-sm text-foreground">{connector.name}</span>
                      </div>
                      {isDetected && (
                        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Detected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
