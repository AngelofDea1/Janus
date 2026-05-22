const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/app/page.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Keep everything up to the return statement (line 427 is the start of return)
// The return starts at line 427, so we keep lines 0 to 426 (which is 427 lines)
const stateLogic = lines.slice(0, 427).join('\n');

const newJSX = `
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono p-4 sm:p-8">
      
      {/* Success Notification */}
      {transactionSuccess && (
        <div className="fixed top-20 right-8 z-50 p-4 border border-black dark:border-white bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-brutal dark:shadow-brutal-dark">
          <Check className="w-4 h-4" />
          <span>TX EXECUTED_</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title Block */}
        <div className="border-b border-black/10 dark:border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            {isMockMode && (
              <div className="inline-block px-2 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest mb-4">
                Sandbox Sim Mode
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase">
              Vault_Terminal
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 tracking-widest uppercase">
              Deposit USDC &gt;&gt; Lock Funding Rate Yield
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 px-4 py-2 border border-black dark:border-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <span>Connection Active</span>
          </div>
        </div>

        {/* Real Live Stats Dashboard Ticker */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-black/10 dark:border-white/10">
          {[
            { label: "Vault APY", val: \`\${estimatedAPY ? (Number(estimatedAPY) / 100).toFixed(2) : "32.40"}%\` },
            { label: "Total Assets", val: \`$\${formatNumber(activeTotalAssets)}\` },
            { label: "Your Principal", val: \`$\${formatNumber(activeUserBalance)}\` },
            { label: "Vault Shares", val: \`\${formatNumber(activeUserShares, 6)} JANUS\` }
          ].map((card, idx) => (
            <div key={idx} className="p-6 border-r border-b lg:border-b-0 border-black/10 dark:border-white/10 last:border-r-0 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                // {card.label}
              </div>
              <div className="text-xl md:text-2xl font-mono font-bold tracking-tight">
                {card.val}
              </div>
            </div>
          ))}
        </div>

        {/* Grid Layout for Interaction */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Action Panel */}
          <div className="lg:col-span-8 border border-black/10 dark:border-white/10 p-6 md:p-8">
            {/* Minimalist Tabs */}
            <div className="flex border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto">
              {[
                { id: "deposit", label: "Deposit" },
                { id: "withdraw", label: "Withdraw" },
                { id: "bridge", label: "CCTP Bridge" },
                { id: "oracle", label: "Data Feed" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={\`px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap \${
                    activeTab === tab.id 
                    ? "bg-black text-white dark:bg-white dark:text-black border-t-2 border-black dark:border-white" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t-2 border-transparent"
                  }\`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(!mounted || !isConnected) ? (
              <div className="text-center py-20 border border-dashed border-black/20 dark:border-white/20">
                <Wallet className="w-8 h-8 mx-auto mb-4 text-zinc-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Auth Required</h3>
                <p className="text-xs text-zinc-500">Connect Web3 wallet to access terminal.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-0">
                
                {/* Deposit Tab */}
                {activeTab === "deposit" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Execute Deposit</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Convert USDC &gt;&gt; JANUS Shares</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                          <span>Amount_</span>
                          <div className="flex items-center gap-2">
                            <span>Balance: {formatNumber(activeUsdcBalance)}</span>
                            <button onClick={handleFaucetMint} className="text-emerald-500 hover:text-emerald-400 underline">
                              (Mint)
                            </button>
                          </div>
                        </div>
                        <div className="relative border border-black/20 dark:border-white/20 focus-within:border-black dark:focus-within:border-white transition-colors">
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-4 bg-transparent focus:outline-none text-2xl font-mono text-black dark:text-white"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400 text-xs tracking-widest uppercase">
                            USDC
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {["1K", "5K", "10K", "MAX"].map((short) => (
                          <button
                            key={short}
                            onClick={() => {
                              if (short === "MAX" && activeUsdcBalance) setDepositAmount(formatUnits(activeUsdcBalance, 6));
                              else setDepositAmount(short.replace("K", "000"));
                            }}
                            className="py-2 text-[10px] font-bold tracking-widest uppercase border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          >
                            {short}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleDeposit}
                        disabled={!depositAmount || activePendingState}
                        className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-black transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>
                          {simulationIsMinting 
                            ? "Minting..." 
                            : activePendingState 
                            ? "Processing..." 
                            : (!activeAllowance || activeAllowance < parseUnits(depositAmount || "0", 6))
                            ? "Approve Spender"
                            : "Execute Transaction"
                          }
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Withdraw Tab */}
                {activeTab === "withdraw" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Execute Withdrawal</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Convert JANUS Shares &gt;&gt; USDC</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                          <span>Shares_</span>
                          <span>Available: {formatNumber(activeUserShares, 6)}</span>
                        </div>
                        <div className="relative border border-black/20 dark:border-white/20 focus-within:border-black dark:focus-within:border-white transition-colors">
                          <input
                            type="number"
                            value={withdrawShares}
                            onChange={(e) => setWithdrawShares(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-4 bg-transparent focus:outline-none text-2xl font-mono text-black dark:text-white"
                          />
                          <button
                            onClick={() => {
                              if (activeUserShares) setWithdrawShares(formatUnits(activeUserShares, 6));
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400"
                          >
                            MAX
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleWithdraw}
                        disabled={!withdrawShares || activePendingState}
                        className="w-full py-4 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>
                          {activePendingState ? "Processing..." : "Execute Withdrawal"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bridge Tab */}
                {activeTab === "bridge" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">CCTP Gateway</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Cross-Chain USDC Transfer</p>
                      </div>
                      <div className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-[8px] font-bold uppercase tracking-widest">
                        Circle SDK
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Source_</label>
                        <select 
                          value={bridgeSourceChain} 
                          onChange={(e) => setBridgeSourceChain(e.target.value)}
                          className="w-full px-4 py-3 bg-transparent border border-black/20 dark:border-white/20 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
                        >
                          <option value="Base_Sepolia">BASE SEP</option>
                          <option value="Arbitrum_Sepolia">ARB SEP</option>
                          <option value="Ethereum_Sepolia">ETH SEP</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Dest_</label>
                        <div className="w-full px-4 py-3 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-mono flex items-center gap-2 text-emerald-500">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse" />
                          ARC L1
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Amount_</label>
                      <input
                        type="number"
                        value={bridgeAmount}
                        onChange={(e) => setBridgeAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={isBridging}
                        className="w-full px-4 py-4 bg-transparent border border-black/20 dark:border-white/20 focus:outline-none text-xl font-mono disabled:opacity-50"
                      />
                    </div>

                    <button
                      onClick={handleBridge}
                      disabled={!bridgeAmount || isBridging}
                      className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-black transition-colors"
                    >
                      {isBridging ? "Bridging..." : "Init Transfer"}
                    </button>
                    
                    {isBridging && (
                      <div className="p-4 border border-black/20 dark:border-white/20 text-xs font-mono space-y-2 mt-4">
                        <div className="flex justify-between text-[10px] text-zinc-500 mb-4 border-b border-black/10 dark:border-white/10 pb-2">
                          <span>STATUS</span><span>ACTIVE</span>
                        </div>
                        {[
                          { step: 1, label: "Approve Source" },
                          { step: 2, label: "Burn Source" },
                          { step: 3, label: "Attestation" },
                          { step: 4, label: "Mint Dest" }
                        ].map((s) => (
                          <div key={s.step} className="flex items-center gap-3">
                            <span className={\`text-[10px] \${bridgeStep >= s.step ? "text-emerald-500" : "text-zinc-500"}\`}>
                              {bridgeStep > s.step ? "[DONE]" : bridgeStep === s.step ? "[BUSY]" : "[WAIT]"}
                            </span>
                            <span className={bridgeStep === s.step ? "animate-pulse" : ""}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Oracle Tab */}
                {activeTab === "oracle" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Oracle Data</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Live Funding Rates (Pyth)</p>
                      </div>
                    </div>

                    <div className="border border-black/20 dark:border-white/20">
                      <div className="grid grid-cols-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest p-3 border-b border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5">
                        <span>Exchange</span>
                        <span className="text-right">Rate (8H)</span>
                      </div>
                      {[
                        { name: "BINANCE", val: binanceFunding },
                        { name: "BYBIT", val: bybitFunding },
                        { name: "HYPERLIQUID", val: hypFunding },
                        { name: "DYDX", val: dydxFunding },
                        { name: "OKX", val: okxFunding }
                      ].map((feed, idx) => (
                        <div key={idx} className="grid grid-cols-2 p-3 text-xs border-b border-black/10 dark:border-white/10 last:border-0 hover:bg-black/5 dark:hover:bg-white/5">
                          <span className="font-bold">{feed.name}</span>
                          <span className={\`text-right \${feed.val.includes('-') ? "text-red-500" : "text-emerald-500"}\`}>
                            {feed.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                       <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Keeper Events</h3>
                       <div className="border border-black/20 dark:border-white/20 text-xs">
                          {recentHarvests.length > 0 ? recentHarvests.map((harvest, idx) => (
                            <div key={idx} className="flex justify-between p-3 border-b border-black/10 dark:border-white/10 last:border-0">
                              <span>HARVEST_</span>
                              <span className="text-emerald-500">+{harvest.amount} USDC</span>
                            </div>
                          )) : (
                            <div className="p-3 text-zinc-500">Awaiting validations...</div>
                          )}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-black/10 dark:border-white/10 p-6 bg-black/5 dark:bg-white/5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Active Position</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-2">
                  <span className="text-xs uppercase tracking-widest">Holdings</span>
                  <span className="text-lg font-bold">${formatNumber(activeUserBalance)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-2">
                  <span className="text-xs uppercase tracking-widest">Ratio</span>
                  <span className="text-lg font-bold">{formatNumber(activeUserShares, 6)}</span>
                </div>
              </div>
            </div>

            <div className="border border-black/10 dark:border-white/10 p-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Contract Identity</h4>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1">ERC-8004 Verified</div>
                  <div className="text-[10px] text-zinc-500 font-mono break-all leading-tight">
                    Agent_Registry: 0x8004A818...BD9e
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(filePath, stateLogic + '\n' + newJSX);
console.log('Successfully updated page.tsx with brutalist layout.');
