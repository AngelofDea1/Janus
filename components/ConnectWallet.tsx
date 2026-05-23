"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConnect, useAccount, useDisconnect, useEnsName } from "wagmi";
import { Wallet, X, ChevronDown, LogOut, CheckCircle2 } from "lucide-react";

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

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={toggleModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-full transition-all flex items-center gap-2 shadow-sm"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={toggleModal}
          className="bg-white dark:bg-[#1a1a1a] border border-borderLine hover:bg-black/5 dark:hover:bg-white/5 text-foreground font-medium px-4 py-2 rounded-full transition-all flex items-center gap-2"
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
            className="w-full sm:w-96 bg-panel dark:bg-[#0a0a0a] h-full sm:h-auto sm:max-h-[80vh] sm:mt-20 sm:mr-6 sm:rounded-3xl shadow-premium-dark border border-borderLine flex flex-col overflow-hidden animate-in slide-in-from-right-8 sm:slide-in-from-top-4 duration-300"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-borderLine flex justify-between items-center">
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
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              {isConnected ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center py-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mb-4 ring-4 ring-orange-500/20"></div>
                    <div className="text-xl font-mono font-medium">
                      {ensName || formatAddress(address)}
                    </div>
                    {activeConnector && (
                      <div className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Connected with {activeConnector.name}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      disconnect();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium py-3 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectors.map((connector) => {
                    // Skip the injected default if it has a more specific connector
                    if (connector.id === 'injected' && connectors.length > 2) return null;
                    
                    return (
                      <button
                        key={connector.uid}
                        onClick={() => {
                          connect({ connector });
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-borderLine transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-[15px]">{connector.name}</span>
                        </div>
                        {connector.id === 'metaMask' || connector.id === 'walletConnect' ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md">
                            Popular
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                  
                  <div className="pt-4 mt-2 border-t border-borderLine">
                    <p className="text-xs text-center text-slate-500">
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
