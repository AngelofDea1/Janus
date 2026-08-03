"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAccount, useConfig } from "wagmi";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  Terminal, 
  Settings, 
  Monitor, 
  Wifi, 
  AlertCircle, 
  Download, 
  Copy, 
  Trash2, 
  Eye, 
  X,
  Play
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  type: "info" | "warn" | "error";
  message: string;
}

function DebugConsoleInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "web3" | "logs" | "controls">("diagnostics");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wireframe, setWireframe] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [rpcLatency, setRpcLatency] = useState<number | null>(null);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { address, isConnected, chainId } = useAccount();

  // Show ONLY in local development mode
  const isDebugEnabled = process.env.NODE_ENV === "development";

  // Watch viewport size
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hotkeys: F2 (Toggle Console), F3 (Toggle Wireframes)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "F3") {
        e.preventDefault();
        setWireframe(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global console.error and window.onerror interceptor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const addLog = (type: "info" | "warn" | "error", message: string) => {
      const entry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        type,
        message
      };
      setLogs(prev => [entry, ...prev].slice(0, 100)); // cap at 100 entries
    };

    // Intercept window errors
    const handleWindowError = (event: ErrorEvent) => {
      addLog("error", event.message || "Uncaught runtime error");
    };

    // Intercept console functions
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    console.error = (...args: any[]) => {
      addLog("error", args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(" "));
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      addLog("warn", args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(" "));
      originalConsoleWarn.apply(console, args);
    };

    window.addEventListener("error", handleWindowError);
    addLog("info", "DebugConsole loaded. Press F2 to toggle, F3 to wireframe.");

    return () => {
      window.removeEventListener("error", handleWindowError);
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Toggle wireframe outline class on body
  useEffect(() => {
    if (typeof document === "undefined") return;
    const styleId = "wireframe-debug-style";
    let styleEl = document.getElementById(styleId);

    if (wireframe) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.innerHTML = `
          * {
            outline: 1px solid rgba(59, 130, 246, 0.4) !important;
            outline-offset: -1px !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      styleEl?.remove();
    }
  }, [wireframe]);

  // Measure RPC Latency
  useEffect(() => {
    if (!isOpen) return;
    const measureLatency = async () => {
      const start = Date.now();
      try {
        const res = await fetch("https://rpc.testnet.arc.network", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
        });
        if (res.ok) {
          setRpcLatency(Date.now() - start);
        } else {
          setRpcLatency(-1);
        }
      } catch {
        setRpcLatency(-1);
      }
    };
    measureLatency();
    const interval = setInterval(measureLatency, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Export logs to JSON
  const handleExportJSON = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      viewport,
      pathname,
      web3: {
        isConnected,
        address,
        chainId,
        rpcLatency: rpcLatency ? `${rpcLatency}ms` : "checking...",
      },
      capturedLogs: logs
    };
    
    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `janus_debug_log_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy debug info to clipboard
  const handleCopyClipboard = () => {
    const text = JSON.stringify({
      viewport,
      pathname,
      web3: { isConnected, address, chainId },
      logs: logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`)
    }, null, 2);
    navigator.clipboard.writeText(text);
    alert("Debug summary copied to clipboard!");
  };

  // Manually trigger keeper arbitrage run
  const handleTriggerKeeper = async () => {
    setTriggerStatus("Triggering...");
    try {
      const res = await fetch("/api/keeper/run");
      const data = await res.json();
      setTriggerStatus(JSON.stringify(data));
    } catch (err: any) {
      setTriggerStatus(`Error: ${err.message}`);
    }
  };

  if (!isDebugEnabled) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[99999] bg-[#09090b] border border-borderLine rounded-full px-4 py-2 text-xs font-bold text-accent shadow-premium flex items-center gap-2 hover:bg-slate-900 active:scale-95 transition-all"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Debug (F2)</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#09090b]/95 border-l border-borderLine backdrop-blur-xl shadow-premium-dark z-[100000] flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-borderLine flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent" />
              <span className="font-heading font-semibold text-foreground text-sm">Janus System Debugger</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-borderLine text-xs font-semibold overflow-x-auto">
            {(["diagnostics", "web3", "logs", "controls"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-2 border-b-2 text-center capitalize transition-colors min-w-[80px] ${
                  activeTab === tab 
                    ? "border-accent text-accent bg-accent/5" 
                    : "border-transparent text-slate-400 hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
            {activeTab === "diagnostics" && (
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5" /> Viewport &amp; Layout
                  </div>
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div>Width: <span className="text-foreground">{viewport.width}px</span></div>
                    <div>Height: <span className="text-foreground">{viewport.height}px</span></div>
                    <div>Aspect Ratio: <span className="text-foreground">{(viewport.width / viewport.height).toFixed(2)}</span></div>
                    <div>Device: <span className="text-foreground">{viewport.width < 768 ? "Mobile" : viewport.width < 1024 ? "Tablet" : "Desktop"}</span></div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Active Route</div>
                  <div className="font-mono text-xs text-foreground break-all">
                    {pathname}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-2 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">Layout Helper Shortcuts:</div>
                  <div className="flex justify-between items-center py-1">
                    <span>F2</span>
                    <span className="text-slate-500">Toggle System Debugger</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>F3</span>
                    <span className="text-slate-500">Toggle Visual Wireframes</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "web3" && (
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5" /> Network Status
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 font-mono text-xs">
                    <div>Latency:</div>
                    <div className={rpcLatency === -1 ? "text-red-400" : "text-emerald-400"}>
                      {rpcLatency === null ? "Measuring..." : rpcLatency === -1 ? "Disconnected" : `${rpcLatency}ms`}
                    </div>
                    <div>Active Chain:</div>
                    <div className="text-foreground">{chainId ? `Arc Testnet (${chainId})` : "Disconnected"}</div>
                    <div>RPC Node:</div>
                    <div className="text-foreground text-[10px] break-all">https://rpc.testnet.arc.network</div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Wallet Details</div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={isConnected ? "text-emerald-400" : "text-amber-400"}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    {isConnected && address && (
                      <div className="space-y-1">
                        <div>Address:</div>
                        <div className="text-slate-400 text-[10px] break-all p-1.5 bg-black/30 border border-borderLine rounded-lg">
                          {address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="space-y-3 flex flex-col h-full">
                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportJSON}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-borderLine text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-[0.98] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save JSON</span>
                  </button>
                  <button 
                    onClick={handleCopyClipboard}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-borderLine text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-[0.98] transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Info</span>
                  </button>
                  <button 
                    onClick={() => setLogs([])}
                    className="py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Log List */}
                <div className="flex-1 bg-black/40 border border-borderLine rounded-2xl p-3 h-[250px] overflow-y-auto space-y-2 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-slate-500 text-center py-12">No logs captured.</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="pb-1 border-b border-borderLine/30 last:border-0 leading-relaxed">
                        <span className="text-slate-500">[{log.timestamp}]</span>{" "}
                        <span className={`font-bold ${
                          log.type === "error" ? "text-red-400" : log.type === "warn" ? "text-amber-400" : "text-blue-400"
                        }`}>
                          [{log.type.toUpperCase()}]
                        </span>{" "}
                        <span className="text-slate-300 break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "controls" && (
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Visual Utilities</div>
                  <button 
                    onClick={() => setWireframe(!wireframe)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
                      wireframe 
                        ? "bg-accent/15 border-accent text-accent" 
                        : "bg-white/5 border-borderLine hover:bg-white/10 text-foreground"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{wireframe ? "Disable Wireframes" : "Enable Wireframes (F3)"}</span>
                  </button>
                </div>

                <div className="bg-white/[0.02] border border-borderLine rounded-2xl p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Keeper Execution Trigger</div>
                  <p className="text-xs text-slate-500">
                    Manually run the arbitrage keeper cron job to fetch funding rates and harvest yield.
                  </p>
                  <button 
                    onClick={handleTriggerKeeper}
                    className="w-full py-3 bg-white text-black hover:bg-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4" />
                    <span>Execute Keeper Run</span>
                  </button>
                  {triggerStatus && (
                    <div className="p-3 bg-black/40 border border-borderLine rounded-xl font-mono text-[10px] text-slate-300 break-all max-h-[120px] overflow-y-auto">
                      {triggerStatus}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function DebugConsole() {
  return (
    <Suspense fallback={null}>
      <DebugConsoleInner />
    </Suspense>
  );
}
