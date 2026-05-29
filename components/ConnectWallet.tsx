"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConnect, useAccount, useDisconnect, useEnsName } from "wagmi";
import { X, ChevronDown, LogOut, CheckCircle2, ChevronRight } from "lucide-react";

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

export default function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOtherWallets, setShowOtherWallets] = useState(false);

  const { connectors, connect } = useConnect();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
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
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center"></div>
          {ensName || formatAddress(address)}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
          <div
            ref={modalRef}
            className="w-full sm:w-[400px] bg-panel dark:bg-[#131313] h-full sm:h-[calc(100vh-32px)] sm:my-4 sm:mr-4 sm:rounded-[32px] shadow-premium-dark border border-borderLine flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300"
          >
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center">
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
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 px-4">
              {isConnected ? (
                <div className="space-y-6 mt-4 px-2">
                  <div className="flex flex-col items-center py-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-borderLine">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mb-4 ring-4 ring-orange-500/20"></div>
                    <div className="text-xl font-mono font-medium">
                      {ensName || formatAddress(address)}
                    </div>
                    {activeConnector && (
                      <div className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Connected via {activeConnector.name}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      disconnect();
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
                      const isRecent = connector.id === 'metaMask';
                      // Only show 'Detected' if we actively received an icon injection from the browser extension
                      const isDetected = !isRecent && !!connector.icon;

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
                            {isRecent && (
                              <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md">
                                Recent
                              </span>
                            )}
                            {isDetected && !isRecent && (
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
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
