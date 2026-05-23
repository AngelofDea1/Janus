"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useBalance, usePublicClient } from "wagmi";
import { parseUnits, formatUnits, parseAbiItem } from "viem";
import { 
 Shield, 
 ArrowDownUp,
 Settings,
 Info,
 Wallet,
 ChevronDown,
 Activity
} from "lucide-react";
import { VAULT_ADDRESS, USDC_ADDRESS, VAULT_ABI, USDC_ABI } from "@/lib/constants";

export default function ArbitrageApp() {
 const [depositAmount, setDepositAmount] = useState("");
 const [withdrawShares, setWithdrawShares] = useState("");
 
 const [activeMode, setActiveMode] = useState<"deposit" | "withdraw">("deposit");
 
 const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();
 const [localConnected, setLocalConnected] = useState(false);
 const [localAddress, setLocalAddress] = useState("");
 const [showSettings, setShowSettings] = useState(false);
 const [slippage, setSlippage] = useState("0.5");

 const [mounted, setMounted] = useState(false);
 useEffect(() => {
   setMounted(true);
   if (typeof window !== "undefined") {
     if (localStorage.getItem("janus_wallet_connected") === null) {
       localStorage.setItem("janus_wallet_connected", "true");
       localStorage.setItem("janus_wallet_address", "0x9c65798e4d3f57ab7904e5784f185c798e4d3f57");
     }
     const savedConnected = localStorage.getItem("janus_wallet_connected") === "true";
     const savedAddress = localStorage.getItem("janus_wallet_address") || "0x9c65798e4d3f57ab7904e5784f185c798e4d3f57";
     setLocalConnected(savedConnected);
     setLocalAddress(savedAddress);
   }
 }, []);

 const isConnected = wagmiIsConnected || localConnected;
 const address = (wagmiAddress || localAddress) as `0x${string}` | undefined;

 const { writeContract, data: hash, isPending } = useWriteContract();
 const publicClient = usePublicClient({ chainId: 5042002 });

 // --- Simulation Fallback State ---
 const isMockMode = (VAULT_ADDRESS as string) === "0x0000000000000000000000000000000000000000";
 const [simulationUsdcBalance, setSimulationUsdcBalance] = useState(BigInt(5000000000)); 
 const [simulationUserShares, setSimulationUserShares] = useState(BigInt(0));
 const [simulationAllowance, setSimulationAllowance] = useState(BigInt(0));
 const [simulationIsPending, setSimulationIsPending] = useState(false);

 const { data: totalAssets } = useReadContract({
   address: VAULT_ADDRESS,
   abi: VAULT_ABI,
   functionName: "totalAssets",
   chainId: 5042002,
   query: { refetchInterval: 2000 },
 });

 const { data: estimatedAPY } = useReadContract({
   address: VAULT_ADDRESS,
   abi: VAULT_ABI,
   functionName: "estimatedAPY",
   chainId: 5042002,
   query: { refetchInterval: 2000 },
 });

 const { data: userShares } = useReadContract({
   address: VAULT_ADDRESS,
   abi: VAULT_ABI,
   functionName: "balanceOf",
   args: address ? [address] : undefined,
   chainId: 5042002,
   query: { refetchInterval: 2000 },
 });

 const { data: usdcERC20Balance } = useReadContract({
   address: USDC_ADDRESS,
   abi: USDC_ABI,
   functionName: "balanceOf",
   args: address ? [address] : undefined,
   chainId: 5042002,
   query: { refetchInterval: 2000 },
 });

 const { data: usdcAllowance } = useReadContract({
   address: USDC_ADDRESS,
   abi: USDC_ABI,
   functionName: "allowance",
   args: address ? [address, VAULT_ADDRESS] : undefined,
   chainId: 5042002,
   query: { refetchInterval: 2000 },
 });

 const usdcBalance = usdcERC20Balance || BigInt(0);

 const activeUsdcBalance = isMockMode ? simulationUsdcBalance : usdcBalance;
 const activeUserShares = isMockMode ? simulationUserShares : userShares;
 const activeAllowance = isMockMode ? simulationAllowance : usdcAllowance;
 const activePendingState = isMockMode ? simulationIsPending : isPending;

 // Transaction Handlers
 const approveUSDC = () => {
   if (!depositAmount) return;
   const amount = parseUnits(depositAmount, 6);
   if (isMockMode) {
     setSimulationIsPending(true);
     setTimeout(() => {
       setSimulationAllowance(amount);
       setSimulationIsPending(false);
     }, 1000);
     return;
   }
   writeContract({
     address: USDC_ADDRESS,
     abi: USDC_ABI,
     functionName: "approve",
     args: [VAULT_ADDRESS, amount],
   });
 };

 const handleDeposit = async () => {
   if (!depositAmount) return;
   const amount = parseUnits(depositAmount, 6);
   
   if (!activeAllowance || activeAllowance < amount) {
     approveUSDC();
     return;
   }
   
   if (isMockMode) {
     setSimulationIsPending(true);
     setTimeout(() => {
       if (simulationUsdcBalance >= amount) {
         setSimulationUsdcBalance((prev) => prev - amount);
         setSimulationUserShares((prev) => prev + amount); 
         setDepositAmount("");
       }
       setSimulationIsPending(false);
     }, 1200);
     return;
   }

   writeContract({
     address: VAULT_ADDRESS,
     abi: VAULT_ABI,
     functionName: "deposit",
     args: [amount, address!],
   });
 };

 const handleWithdraw = async () => {
   if (!withdrawShares) return;
   const sharesAmount = parseUnits(withdrawShares, 6);

   if (isMockMode) {
     setSimulationIsPending(true);
     setTimeout(() => {
       if (simulationUserShares >= sharesAmount) {
         setSimulationUserShares((prev) => prev - sharesAmount);
         setSimulationUsdcBalance((prev) => prev + sharesAmount);
         setWithdrawShares("");
       }
       setSimulationIsPending(false);
     }, 1200);
     return;
   }

   writeContract({
     address: VAULT_ADDRESS,
     abi: VAULT_ABI,
     functionName: "withdraw",
     args: [sharesAmount, address!, address!],
   });
 };

 const formatNumber = (value: bigint | undefined, decimals: number = 6) => {
   if (!value) return "0.00";
   return parseFloat(formatUnits(value, decimals)).toLocaleString("en-US", {
     minimumFractionDigits: 2,
     maximumFractionDigits: 6,
   });
 };

 return (
    <div className="relative min-h-screen bg-background pt-32 pb-24 flex justify-center overflow-hidden">
      
      {/* Subtle Premium Background Mesh */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] px-4">
        
        {/* Main Swap/Deposit Widget */}
        <div className="bg-panel border border-borderLine rounded-3xl p-2 shadow-premium dark:shadow-premium-dark backdrop-blur-xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveMode("deposit")}
                className={`font-semibold text-lg transition-colors ${activeMode === "deposit" ? "text-foreground" : "text-slate-400 hover:text-slate-300"}`}
              >
                Deposit
              </button>
              <button 
                onClick={() => setActiveMode("withdraw")}
                className={`font-semibold text-lg transition-colors ${activeMode === "withdraw" ? "text-foreground" : "text-slate-400 hover:text-slate-300"}`}
              >
                Withdraw
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-colors ${showSettings ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-panel border border-borderLine rounded-2xl p-4 shadow-premium dark:shadow-premium-dark z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-sm font-semibold mb-3">Transaction Settings</div>
                  <div className="text-xs text-slate-500 mb-2">Slippage Tolerance</div>
                  <div className="flex gap-2 mb-3">
                    {["0.1", "0.5", "1.0"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSlippage(val)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          slippage === val 
                            ? "bg-accent text-white" 
                            : "bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10"
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      placeholder="Custom"
                      className="w-full bg-black/5 dark:bg-[#09090b] border border-borderLine rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!mounted || !isConnected ? (
             <div className="p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-slate-400" />
               </div>
               <h3 className="font-semibold text-lg mb-2">Connect Wallet</h3>
               <p className="text-sm text-slate-500 mb-6">Connect your wallet to access the Janus terminal.</p>
               <button className="w-full py-4 rounded-2xl bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">
                  Connect Wallet
               </button>
             </div>
          ) : activeMode === "deposit" ? (
             <div className="p-2">
               {/* Input Section */}
               <div className="bg-black/5 dark:bg-[#09090b] rounded-2xl p-4 border border-transparent focus-within:border-accent/30 transition-colors">
                 <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                    <span>You pay</span>
                    <span className="flex items-center gap-2">
                      Balance: {formatNumber(activeUsdcBalance)}
                      <button 
                        onClick={() => {
                           if (activeUsdcBalance) setDepositAmount(formatUnits(activeUsdcBalance, 6));
                        }}
                        className="text-accent hover:text-accentHover font-semibold"
                      >
                        Max
                      </button>
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-4xl font-semibold text-foreground focus:outline-none w-full min-w-0"
                    />
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] shadow-sm px-3 py-1.5 rounded-full border border-borderLine shrink-0">
                      <div className="w-6 h-6 shrink-0">
                        <svg viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <circle cx="1000" cy="1000" r="1000" fill="#2775CA"/>
                          <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-175v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 216.66 200v100c0 16.66 12.5 29.16 33.34 33.33h62.5c16.66 0 29.16-12.5 33.33-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="white"/>
                          <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-166.67 191.66-295.83 358.33-358.34 16.67-8.33 25-20.83 25-41.66V354.17c0-16.67-8.33-29.17-25-33.34-4.17 0-12.5 0-16.67 4.17-395.83 125-612.5 545.83-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.17 4.17-8.33 4.17-16.67v-41.66c0-12.5-12.5-29.17-12.5-83.34zm441.67-1279.16c-16.67-8.34-33.34 0-37.5 16.66-4.17 4.17-4.17 8.34-4.17 16.67v41.67c0 16.66 12.5 33.33 25 41.66 325 116.67 491.67 479.17 370.83 800-62.5 166.67-191.66 295.84-358.33 358.34-16.67 8.33-25 20.83-25 41.66v41.67c0 16.66 8.33 29.16 25 33.33 4.17 0 12.5 0 16.67-4.17 395.83-125 612.5-545.83 487.5-941.66-75-237.5-258.34-416.67-500-445.83z" fill="white"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm">USDC</span>
                    </div>
                 </div>
               </div>

               {/* Center Arrow */}
               <div className="relative h-2 flex justify-center items-center z-10">
                  <div className="absolute w-10 h-10 bg-panel border border-borderLine rounded-xl flex items-center justify-center shadow-sm">
                    <ArrowDownUp className="w-4 h-4 text-slate-400" />
                  </div>
               </div>

               {/* Output Section */}
               <div className="bg-black/5 dark:bg-[#09090b] rounded-2xl p-4 mt-2 border border-transparent">
                 <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                    <span>You receive (est.)</span>
                 </div>
                 <div className="flex items-center justify-between opacity-80">
                    <input
                      type="number"
                      value={depositAmount} // 1:1 roughly
                      disabled
                      placeholder="0.00"
                      className="bg-transparent text-4xl font-semibold text-foreground focus:outline-none w-full min-w-0"
                    />
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] shadow-sm px-3 py-1.5 rounded-full border border-borderLine shrink-0">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                        J
                      </div>
                      <span className="font-semibold text-sm">JANUS</span>
                    </div>
                 </div>
               </div>

               {/* Execute Button */}
               <div className="mt-4">
                 <button
                   onClick={handleDeposit}
                   disabled={!depositAmount || activePendingState}
                   className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                     !depositAmount
                       ? "bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                       : activePendingState
                       ? "bg-accent/50 text-white cursor-wait"
                       : (!activeAllowance || activeAllowance < parseUnits(depositAmount || "0", 6))
                       ? "bg-accent/10 text-accent hover:bg-accent/20"
                       : "bg-accent text-white hover:bg-accentHover shadow-premium hover:shadow-premium-hover active:scale-[0.98]"
                   }`}
                 >
                   {activePendingState 
                     ? "Processing..." 
                     : (!depositAmount) 
                     ? "Enter an amount" 
                     : (!activeAllowance || activeAllowance < parseUnits(depositAmount || "0", 6))
                     ? "Approve USDC"
                     : "Deposit"}
                 </button>
               </div>
             </div>
          ) : (
             <div className="p-2">
               {/* Withdraw Section */}
               <div className="bg-black/5 dark:bg-[#09090b] rounded-2xl p-4 border border-transparent focus-within:border-accent/30 transition-colors">
                 <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                    <span>Withdraw Shares</span>
                    <span className="flex items-center gap-2">
                      Available: {formatNumber(activeUserShares)}
                      <button 
                        onClick={() => {
                           if (activeUserShares) setWithdrawShares(formatUnits(activeUserShares, 6));
                        }}
                        className="text-accent hover:text-accentHover font-semibold"
                      >
                        Max
                      </button>
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={withdrawShares}
                      onChange={(e) => setWithdrawShares(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-4xl font-semibold text-foreground focus:outline-none w-full min-w-0"
                    />
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] shadow-sm px-3 py-1.5 rounded-full border border-borderLine shrink-0">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                        J
                      </div>
                      <span className="font-semibold text-sm">JANUS</span>
                    </div>
                 </div>
               </div>

               <div className="mt-4">
                 <button
                   onClick={handleWithdraw}
                   disabled={!withdrawShares || activePendingState}
                   className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                     !withdrawShares
                       ? "bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                       : activePendingState
                       ? "bg-accent/50 text-white cursor-wait"
                       : "bg-accent text-white hover:bg-accentHover shadow-premium hover:shadow-premium-hover active:scale-[0.98]"
                   }`}
                 >
                   {activePendingState ? "Processing..." : "Withdraw USDC"}
                 </button>
               </div>
             </div>
          )}
        </div>

        {/* Info Card Below Widget */}
        <div className="mt-6 bg-panel border border-borderLine rounded-2xl p-4 text-sm shadow-sm">
          <div className="flex justify-between py-2 border-b border-borderLine/50">
            <span className="text-slate-500 flex items-center gap-1">
              Live APY <Info className="w-3 h-3" />
            </span>
            <span className="font-semibold text-emerald-500">
              {estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(2) : "32.40"}%
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-borderLine/50">
            <span className="text-slate-500 flex items-center gap-1">
              Network Cost <Info className="w-3 h-3" />
            </span>
            <span className="font-semibold text-foreground">~$0.01</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500 flex items-center gap-1">
              Contract Validated <Shield className="w-3 h-3" />
            </span>
            <span className="font-mono text-xs text-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">0x8004...BD9e</span>
          </div>
        </div>

      </div>
    </div>
  );
}
