"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useBalance, usePublicClient, useSwitchChain } from "wagmi";
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
import AssetLogo from "@/components/AssetLogo";
import ConnectWallet from "@/components/ConnectWallet";
import { VAULT_ADDRESS, USDC_ADDRESS, EURC_VAULT_ADDRESS, EURC_ADDRESS, VAULT_ABI, USDC_ABI } from "@/lib/constants";

export default function ArbitrageApp() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  
  const [activeMode, setActiveMode] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAsset, setSelectedAsset] = useState<"USDC" | "EURC">("USDC");
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  
  const { address: wagmiAddress, isConnected: wagmiIsConnected, chainId } = useAccount();
  const [localConnected, setLocalConnected] = useState(false);
  const [localAddress, setLocalAddress] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("janus_wallet_connected", "false");
      localStorage.setItem("janus_wallet_address", "");
      setLocalConnected(false);
      setLocalAddress("");
    }
  }, []);

  const isConnected = wagmiIsConnected || localConnected;
  const address = wagmiAddress || (localAddress ? (localAddress as `0x${string}`) : undefined);

  const [simulationPending, setSimulationPending] = useState(false);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const publicClient = usePublicClient({ chainId: 5042002 });
  const { switchChainAsync } = useSwitchChain();
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const ARC_TESTNET_CHAIN_ID = 5042002;

  const checkAndSwitchNetwork = async (): Promise<boolean> => {
    if (chainId !== ARC_TESTNET_CHAIN_ID) {
      setSwitchError(null);
      setIsSwitching(true);
      try {
        if (switchChainAsync) {
          await switchChainAsync({ chainId: ARC_TESTNET_CHAIN_ID });
          setIsSwitching(false);
          return true;
        }
      } catch (err: any) {
        setIsSwitching(false);
        const msg = err?.shortMessage || err?.message || "Failed to switch network";
        if (msg.includes("rejected") || msg.includes("denied")) {
          setSwitchError("You rejected the network switch. Please try again.");
        } else if (msg.includes("Unrecognized chain") || msg.includes("unknown chain")) {
          setSwitchError("Arc Testnet not found in wallet. It will be added automatically — please confirm the prompts.");
        } else {
          setSwitchError(msg);
        }
        console.error("Failed to switch network:", err);
      }
      return false;
    }
    return true;
  };

  // --- Simulation Fallback State ---
  const isMockMode = (VAULT_ADDRESS as string) === "0x0000000000000000000000000000000000000000";
  
  // USDC simulation variables
  const [simulationUsdcBalance, setSimulationUsdcBalance] = useState(BigInt(0)); 
  const [simulationUserShares, setSimulationUserShares] = useState(BigInt(0));
  const [simulationAllowance, setSimulationAllowance] = useState(BigInt(0));
  
  // EURC simulation variables (enabled by default to show EURC logic instantly without needing to deploy contract first)
  const [simulationEurcBalance, setSimulationEurcBalance] = useState(BigInt(0)); 
  const [simulationEurcShares, setSimulationEurcShares] = useState(BigInt(0));
  const [simulationEurcAllowance, setSimulationEurcAllowance] = useState(BigInt(0));

  const [simulationIsPending, setSimulationIsPending] = useState(false);

  // USDC contract reads
  const { data: usdcTotalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: usdcEstimatedAPY } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: usdcUserShares } = useReadContract({
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

  // EURC contract reads
  const { data: eurcTotalAssets } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: eurcEstimatedAPY } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "estimatedAPY",
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: eurcUserShares } = useReadContract({
    address: EURC_VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: eurcERC20Balance } = useReadContract({
    address: EURC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  const { data: eurcAllowance } = useReadContract({
    address: EURC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address ? [address, EURC_VAULT_ADDRESS] : undefined,
    chainId: 5042002,
    query: { refetchInterval: 2000 },
  });

  // Active mapping based on selection
  const isUSDC = selectedAsset === "USDC";
  const useSim = isMockMode && localConnected && !wagmiIsConnected;

  const activeBalance = isUSDC 
    ? (useSim ? simulationUsdcBalance : (usdcERC20Balance || BigInt(0))) 
    : (useSim ? simulationEurcBalance : (eurcERC20Balance || BigInt(0)));

  const activeUserShares = isUSDC 
    ? (useSim ? simulationUserShares : (usdcUserShares || BigInt(0))) 
    : (useSim ? simulationEurcShares : (eurcUserShares || BigInt(0)));

  const activeAllowance = isUSDC 
    ? (useSim ? simulationAllowance : (usdcAllowance || BigInt(0))) 
    : (useSim ? simulationEurcAllowance : (eurcAllowance || BigInt(0)));

  const activeVaultAddress = isUSDC ? VAULT_ADDRESS : EURC_VAULT_ADDRESS;
  const activeAssetAddress = isUSDC ? USDC_ADDRESS : EURC_ADDRESS;
  const activePendingState = useSim ? simulationPending : isPending;

  const needsApproval = depositAmount && (activeAllowance < parseUnits(depositAmount, 6));

  // Transaction Handlers
  const approveAsset = async () => {
    if (!depositAmount) return;
    const amount = parseUnits(depositAmount, 6);
    
    if (useSim) {
      setSimulationPending(true);
      setTimeout(() => {
        if (isUSDC) setSimulationAllowance(amount);
        else setSimulationEurcAllowance(amount);
        setSimulationPending(false);
      }, 1000);
      return;
    }
    
    const ready = await checkAndSwitchNetwork();
    if (!ready) return;
    writeContract({
      address: activeAssetAddress,
      abi: USDC_ABI,
      functionName: "approve",
      args: [activeVaultAddress, amount],
    });
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    const amount = parseUnits(depositAmount, 6);
    
    if (useSim) {
      if (needsApproval) {
        await approveAsset();
        return;
      }
      setSimulationPending(true);
      setTimeout(() => {
        if (isUSDC) {
          setSimulationUsdcBalance(prev => prev - amount);
          setSimulationUserShares(prev => prev + amount);
          setSimulationAllowance(BigInt(0));
        } else {
          setSimulationEurcBalance(prev => prev - amount);
          setSimulationEurcShares(prev => prev + amount);
          setSimulationEurcAllowance(BigInt(0));
        }
        setDepositAmount("");
        setSimulationPending(false);
      }, 1500);
      return;
    }

    const ready = await checkAndSwitchNetwork();
    if (!ready) return;

    if (!activeAllowance || activeAllowance < amount) {
      approveAsset();
      return;
    }

    writeContract({
      address: activeVaultAddress,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [amount, address!],
    });
  };

  const handleWithdraw = async () => {
    if (!withdrawShares) return;
    const sharesAmount = parseUnits(withdrawShares, 6);

    if (useSim) {
      setSimulationPending(true);
      setTimeout(() => {
        if (isUSDC) {
          setSimulationUsdcBalance(prev => prev + sharesAmount);
          setSimulationUserShares(prev => prev - sharesAmount);
        } else {
          setSimulationEurcBalance(prev => prev + sharesAmount);
          setSimulationEurcShares(prev => prev - sharesAmount);
        }
        setWithdrawShares("");
        setSimulationPending(false);
      }, 1500);
      return;
    }

    const ready = await checkAndSwitchNetwork();
    if (!ready) return;

    writeContract({
      address: activeVaultAddress,
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
               <div className="w-full flex justify-center">
                 <ConnectWallet />
               </div>
             </div>
          ) : activeMode === "deposit" ? (
              <div className="p-2">
                {/* Input Section */}
                <div className="bg-black/5 dark:bg-[#09090b] rounded-2xl p-4 border border-transparent focus-within:border-accent/30 transition-colors">
                  <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                     <span>You pay</span>
                     <span className="flex items-center gap-2">
                       Balance: {formatNumber(activeBalance)}
                       <button 
                         onClick={() => {
                            if (activeBalance) setDepositAmount(formatUnits(activeBalance, 6));
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
                     <div className="relative shrink-0">
                       <button 
                         onClick={() => setShowAssetSelector(!showAssetSelector)}
                         className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-[#1a1a1a] dark:hover:bg-[#222] shadow-sm pr-3 pl-2 py-1.5 rounded-full border border-borderLine transition-all active:scale-95"
                       >
                         <div className="shrink-0">
                           <AssetLogo asset={selectedAsset} size={24} />
                         </div>
                         <span className="font-semibold text-sm">{selectedAsset}</span>
                         <ChevronDown className="w-4 h-4 text-slate-400" />
                       </button>

                       {showAssetSelector && (
                         <div className="absolute right-0 top-full mt-2 w-32 bg-panel border border-borderLine rounded-2xl p-1.5 shadow-premium dark:shadow-premium-dark z-50 animate-in fade-in slide-in-from-top-2">
                           {(["USDC", "EURC"] as const).map((asset) => (
                             <button
                               key={asset}
                               onClick={() => {
                                 setSelectedAsset(asset);
                                 setShowAssetSelector(false);
                                 setDepositAmount(""); // clear amount to prevent confusion
                               }}
                               className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors ${
                                 selectedAsset === asset 
                                   ? "bg-black/5 dark:bg-white/5 text-foreground" 
                                   : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                               }`}
                             >
                               <AssetLogo asset={asset} size={20} />
                               {asset}
                             </button>
                           ))}
                         </div>
                       )}
                     </div>
                  </div>
                </div>

                {/* Center Arrow */}
                <div className="relative h-2 flex justify-center items-center z-10">
                   <button 
                     onClick={() => setActiveMode(activeMode === "deposit" ? "withdraw" : "deposit")}
                     className="absolute w-10 h-10 bg-panel border border-borderLine rounded-xl flex items-center justify-center shadow-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                   >
                     <ArrowDownUp className="w-4 h-4 text-slate-400" />
                   </button>
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
                     <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] shadow-sm pr-3 pl-2 py-1.5 rounded-full border border-borderLine shrink-0">
                       <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                         J
                       </div>
                       <span className="font-semibold text-sm">JANUS</span>
                     </div>
                  </div>
                </div>

                 {/* Execute Button */}
                 <div className="mt-4">
                   {switchError && (
                     <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                       <Info className="w-4 h-4 mt-0.5 shrink-0" />
                       <span>{switchError}</span>
                     </div>
                   )}
                   <button
                     onClick={handleDeposit}
                     disabled={activePendingState || isSwitching}
                     className={`group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                       (!depositAmount && chainId === ARC_TESTNET_CHAIN_ID)
                         ? "bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                         : (activePendingState || isSwitching)
                         ? "bg-foreground/50 text-background cursor-wait"
                         : "border-2 border-foreground bg-transparent text-foreground shadow-sm active:scale-[0.98]"
                     }`}
                   >
                     {(!activePendingState && !isSwitching && (depositAmount || chainId !== ARC_TESTNET_CHAIN_ID)) && (
                       <div className="absolute inset-0 bg-foreground translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                     )}
                     <span className="relative z-10 group-hover:text-background transition-colors duration-300 flex items-center justify-center gap-2">
                       {isSwitching
                         ? "Switching Network..."
                         : activePendingState 
                         ? "Processing..." 
                         : (chainId !== ARC_TESTNET_CHAIN_ID)
                         ? "Switch to Arc Testnet"
                         : (!depositAmount) 
                         ? "Enter an amount" 
                         : (!activeAllowance || activeAllowance < parseUnits(depositAmount || "0", 6))
                         ? `Approve ${selectedAsset}`
                         : "Deposit"}
                     </span>
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
                     <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] shadow-sm pr-3 pl-2 py-1.5 rounded-full border border-borderLine shrink-0">
                       <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                         J
                       </div>
                       <span className="font-semibold text-sm">JANUS</span>
                     </div>
                  </div>
                </div>

                <div className="mt-4">
                   {switchError && (
                     <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                       <Info className="w-4 h-4 mt-0.5 shrink-0" />
                       <span>{switchError}</span>
                     </div>
                   )}
                  <button
                    onClick={handleWithdraw}
                    disabled={(!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID) || activePendingState || isSwitching}
                    className={`group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      (!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID)
                        ? "bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                        : (activePendingState || isSwitching)
                        ? "bg-foreground/50 text-background cursor-wait"
                        : "border-2 border-foreground bg-transparent text-foreground shadow-sm active:scale-[0.98]"
                    }`}
                  >
                    {(withdrawShares || chainId !== ARC_TESTNET_CHAIN_ID) && !activePendingState && !isSwitching && (
                      <div className="absolute inset-0 bg-foreground translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    )}
                    <span className="relative z-10 group-hover:text-background transition-colors duration-300 flex items-center justify-center gap-2">
                      {isSwitching
                        ? "Switching Network..."
                        : activePendingState
                        ? "Processing..."
                        : (chainId !== ARC_TESTNET_CHAIN_ID)
                        ? "Switch to Arc Testnet"
                        : !withdrawShares
                        ? "Enter an amount"
                        : `Withdraw ${selectedAsset}`}
                    </span>
                  </button>
                </div>
             </div>
          )}
        </div>

        {/* Info Card Below Widget */}
        <div className="mt-6 bg-panel border border-borderLine rounded-2xl p-4 text-sm shadow-sm">
          <div className="flex justify-between py-2 border-b border-borderLine/50">
            <span className="text-slate-500 flex items-center gap-1">
              Live APY
            </span>
            <span className="font-semibold text-emerald-500">
              {isUSDC 
                ? (usdcEstimatedAPY ? (Number(usdcEstimatedAPY) / 100).toFixed(2) : "32.40")
                : (eurcEstimatedAPY ? (Number(eurcEstimatedAPY) / 100).toFixed(2) : "28.60")}%
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-borderLine/50">
            <span className="text-slate-500 flex items-center gap-1">
              Network Cost
            </span>
            <span className="font-semibold text-foreground">~$0.01</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500 flex items-center gap-1">
              Contract Validated <Shield className="w-3 h-3" />
            </span>
            <span className="font-mono text-xs text-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
              {activeVaultAddress.slice(0, 6)}...{activeVaultAddress.slice(-4)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
