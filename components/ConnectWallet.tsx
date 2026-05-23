"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConnect, useAccount, useDisconnect, useEnsName } from "wagmi";
import { Wallet, X, ChevronDown, LogOut, CheckCircle2 } from "lucide-react";

// --- SVG Icons for Wallets ---
const MetamaskIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm">
    <path fill="#E17726" d="M27.8,9.6l-6.1-4l-3.2,12.5l5.5,5.1l5.2-1.3l0.3-6.1C29.6,13.6,28.8,11.3,27.8,9.6z" />
    <path fill="#E27625" d="M4.2,9.6C3.2,11.3,2.4,13.6,2.4,15.8l0.3,6.1l5.2,1.3l5.5-5.1L10.3,5.6L4.2,9.6z" />
    <path fill="#D5BFB2" d="M22.5,22l-1.3,4.4l-1.8,1.4l5.2,0.9l2.8-2L22.5,22z" />
    <path fill="#D5BFB2" d="M9.5,22l-4.9,4.8l2.8,2l5.2-0.9L10.8,26.4L9.5,22z" />
    <path fill="#233447" d="M10.8,26.4l2,3.3l3.2,0.6l3.2-0.6l2-3.3l-1.9-0.8l-1.2-1.8l-2.1,0.5l-2.1-0.5l-1.2,1.8L10.8,26.4z" />
    <path fill="#CC6228" d="M10.8,26.4l1.9,0.8l1.2,1.8l-2-3.3L9.5,22l-1.6,0.3L10.8,26.4z" />
    <path fill="#CC6228" d="M21.2,26.4l1.2,2l-1.2-1.8l1.9-0.8l2.8-0.7l-1.6-0.3L21.2,26.4z" />
    <path fill="#E27525" d="M16,21l2.1-0.5l1.2,1.8l-1.2,2l-2.1,0.5l-2.1-0.5l-1.2-2l1.2-1.8L16,21z" />
    <path fill="#F5841F" d="M18.1,20.5l-2.1,0.5l-2.1-0.5l2.1-2.9L18.1,20.5z" />
    <path fill="#F5841F" d="M13.9,20.5l2.1,0.5l2.1-0.5l-0.5-2.1l-1.6-0.3l-1.6,0.3L13.9,20.5z" />
    <path fill="#C0AD9E" d="M10.3,5.6l3.2,12.5l2.5-0.5L13.9,20.5l-4.4-2.4L10.3,5.6z" />
    <path fill="#C0AD9E" d="M21.7,5.6l-0.8,12.5l-4.4,2.4l-0.5-2.9l2.5,0.5L21.7,5.6z" />
    <path fill="#161616" d="M11.9,13.6l1.3-1.6l1.8,1.3l-2.1,2.8C12.4,15.1,12.1,14.3,11.9,13.6z" />
    <path fill="#161616" d="M20.1,13.6c-0.2,0.7-0.5,1.5-1,2.5l-2.1-2.8l1.8-1.3L20.1,13.6z" />
    <path fill="#763E1A" d="M11.9,13.6c-0.4,1.4-0.4,2.9-0.2,4.3l-2.2,0.2L10.3,5.6L11.9,13.6z" />
    <path fill="#763E1A" d="M20.1,13.6l1.6-8l-0.8,12.5l-2.2-0.2C18.9,16.5,19,15,20.1,13.6z" />
    <path fill="#F5841F" d="M16,11.8l-1.8,1.3l1.8,4.5l1.8-4.5L16,11.8z" />
    <path fill="#F5841F" d="M11.9,13.6l2.3,4.3l1.8-4.5L16,11.8l-2.8-5L11.9,13.6z" />
    <path fill="#F5841F" d="M20.1,13.6l-1.3-6.8l-2.8,5l0,0l1.8,4.5L20.1,13.6z" />
  </svg>
);

const WalletConnectIcon = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8 rounded-xl bg-[#3396FF] p-1.5 shadow-sm">
    <path fill="#fff" d="M12.1,14.6c4.4-4.2,11.5-4.2,15.8,0l1.3,1.3c0.3,0.3,0.8,0.3,1.1,0l2.3-2.3c0.3-0.3,0.3-0.8,0-1.1c-6.2-6-16.3-6-22.5,0c-0.3,0.3-0.3,0.8,0,1.1l2.3,2.3c0.3,0.3,0.8,0.3,1.1,0L12.1,14.6z M33.6,18.4c-7.4-7.1-19.6-7.1-27.1,0c-0.3,0.3-0.3,0.8,0,1.1l2.3,2.3c0.3,0.3,0.8,0.3,1.1,0c4.9-4.7,12.9-4.7,17.8,0l1.3,1.3c0.3,0.3,0.8,0.3,1.1,0l2.3-2.3C34,19.2,34,18.7,33.6,18.4z M20,22c-3.1-2.9-8-2.9-11,0c-0.3,0.3-0.3,0.8,0,1.1l2.3,2.3c0.3,0.3,0.8,0.3,1.1,0c1.7-1.6,4.5-1.6,6.2,0l1.3,1.3c0.3,0.3,0.8,0.3,1.1,0l2.3-2.3C23.7,24,23.7,23.5,23.4,23.2C22.4,22.3,21.1,22,20,22z" />
  </svg>
);

const CoinbaseIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-xl bg-[#0052FF] p-1.5 shadow-sm">
    <path fill="#fff" d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16S8.636 29.333 16 29.333 29.333 23.364 29.333 16 23.364 2.667 16 2.667zm6.667 16.666h-4v4h-5.334v-4h-4v-5.333h4v-4h5.334v4h4v5.333z" />
  </svg>
);

const RabbyIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-xl bg-[#7084FF] p-1 shadow-sm">
    <path fill="#fff" d="M10.8 11.2c.4-2.8 2.8-5 5.7-5 2.9 0 5.3 2.2 5.7 5h.8c2.6 0 4.8 2.1 4.8 4.8v2.4c0 2.6-2.1 4.8-4.8 4.8H9.1c-2.6 0-4.8-2.1-4.8-4.8V16c0-2.6 2.1-4.8 4.8-4.8h1.7zm1.6 3.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4zm8.8 0c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
  </svg>
);

const PhantomIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-xl bg-[#AB9FF2] p-1.5 shadow-sm">
    <path fill="#fff" d="M16 4c-5.52 0-10 4.48-10 10v10l3-3 2 2 3-3 3 3 3-3 3 3 3-3v-10c0-5.52-4.48-10-10-10zm-3 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const GenericIcon = ({ char, bg }: { char: string, bg: string }) => (
  <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
    {char}
  </div>
);

const getWalletIcon = (name: string, id: string) => {
  const lowerName = name.toLowerCase();
  const lowerId = id.toLowerCase();
  if (lowerName.includes('metamask') || lowerId.includes('meta')) return <MetamaskIcon />;
  if (lowerName.includes('walletconnect') || lowerId.includes('walletconnect')) return <WalletConnectIcon />;
  if (lowerName.includes('coinbase') || lowerId.includes('coinbase')) return <CoinbaseIcon />;
  if (lowerName.includes('rabby') || lowerId.includes('rabby')) return <RabbyIcon />;
  if (lowerName.includes('phantom') || lowerId.includes('phantom')) return <PhantomIcon />;
  
  // Fallbacks based on name
  if (lowerName.includes('okx')) return <GenericIcon char="O" bg="bg-black" />;
  if (lowerName.includes('keplr')) return <GenericIcon char="K" bg="bg-[#00C3DA]" />;
  if (lowerName.includes('hot')) return <GenericIcon char="H" bg="bg-orange-500" />;
  if (lowerName.includes('binance')) return <GenericIcon char="B" bg="bg-[#F3BA2F]" />;
  if (lowerName.includes('safe')) return <GenericIcon char="S" bg="bg-[#12FF80] text-black" />;
  
  return <GenericIcon char={name.charAt(0).toUpperCase()} bg="bg-slate-600" />;
};

export default function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const { connectors, connect, status: connectStatus } = useConnect();
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
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleModal = () => setIsOpen(!isOpen);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!mounted) return <div className="w-32 h-10 bg-black/5 dark:bg-white/5 animate-pulse rounded-full"></div>;

  // --- Deduplicate and sort connectors ---
  // EIP-6963 often injects multiple versions of the same wallet (e.g. injected, walletConnect, injected MetaMask)
  const uniqueConnectors = Array.from(new Map(connectors.map(c => {
    // Normalize names to prevent duplicates like "WalletConnect" and "WalletConnectLegacy"
    let normalizedName = c.name;
    if (normalizedName.toLowerCase().includes('walletconnect')) normalizedName = 'WalletConnect';
    if (normalizedName.toLowerCase().includes('metamask')) normalizedName = 'MetaMask';
    return [normalizedName, c];
  })).values());

  // Move a specific wallet (like Rabby or MetaMask) to the top highlight block
  const featuredWalletName = "Rabby Wallet";
  const featuredConnector = uniqueConnectors.find(c => c.name.toLowerCase().includes('rabby')) 
                         || uniqueConnectors.find(c => c.name === 'MetaMask') 
                         || uniqueConnectors[0];
  
  const otherConnectors = uniqueConnectors.filter(c => c.uid !== featuredConnector?.uid && c.id !== 'injected');

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={toggleModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
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
                <div className="space-y-4">
                  {/* Featured Top Wallet Block */}
                  {featuredConnector && (
                    <button
                      onClick={() => {
                        connect({ connector: featuredConnector });
                        setIsOpen(false);
                      }}
                      className="w-full relative overflow-hidden group bg-gradient-to-br from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border border-orange-500/20 rounded-3xl p-4 transition-all text-left flex items-center gap-4"
                    >
                      <div className="shrink-0 group-hover:scale-105 transition-transform">
                        {getWalletIcon(featuredConnector.name, featuredConnector.id)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-base">Install {featuredConnector.name}</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">Recommended for Janus</div>
                      </div>
                    </button>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-2 px-2">
                    <div className="h-px bg-borderLine flex-1"></div>
                    <span className="text-xs text-slate-500 font-medium">Other wallets</span>
                    <div className="h-px bg-borderLine flex-1"></div>
                  </div>
                  
                  {/* List of other wallets */}
                  <div className="space-y-1">
                    {otherConnectors.map((connector) => {
                      const isRecent = connector.id === 'metaMask';
                      const isDetected = !isRecent && (connector.id === 'okx' || connector.id === 'phantom' || connector.id === 'keplr');
                      
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
                              {getWalletIcon(connector.name, connector.id)}
                            </div>
                            <span className="font-medium text-[15px]">{connector.name}</span>
                          </div>
                          
                          {isRecent && (
                            <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md">
                              Recent
                            </span>
                          )}
                          {isDetected && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Detected
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="pt-4 mt-4 px-4 text-center">
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
