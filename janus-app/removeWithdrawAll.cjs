const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove state declarations
content = content.replace(
  /  const \[isWithdrawAllActive, setIsWithdrawAllActive\] = useState\(false\);\n  const \[withdrawAllStep, setWithdrawAllStep\] = useState<"idle" \| "usdc" \| "eurc" \| "success">.*?\n  const \[withdrawAllTxHashUsdc, setWithdrawAllTxHashUsdc\].*?\n  const \[withdrawAllTxHashEurc, setWithdrawAllTxHashEurc\].*?\n/g,
  ''
);

// 2. Remove handleWithdrawAll and handleWithdrawAllStep
// We know handleWithdrawAll starts around line 350 and ends before handleWithdraw.
const handleWithdrawRegex = /  const handleWithdrawAll = async \(\) => \{[\s\S]*?const handleWithdraw = async \(\) => \{/m;
content = content.replace(handleWithdrawRegex, '  const handleWithdraw = async () => {');

// 3. Remove isWithdrawAllActive check inside handleWithdraw
const handleWithdrawInnerRegex = /    if \(isWithdrawAllActive\) \{[\s\S]*?return;\n    \}\n/m;
content = content.replace(handleWithdrawInnerRegex, '');

// 4. Update the useEffect block
const useEffectRegex = /        if \(isWithdrawAllActive\) \{[\s\S]*?\} else \{\n          setWithdrawShares\(""\);\n        \}/m;
content = content.replace(useEffectRegex, '        setWithdrawShares("");');

// Update useEffect dependency array
content = content.replace(
  /isTxSuccess, txHash, txType, isWithdrawAllActive, withdrawAllStep, useSim, simulationEurcShares, eurcUserShares/g,
  'isTxSuccess, txHash, txType, useSim'
);

// 5. Remove the "Max | Withdraw All" buttons in UI
const withdrawAllButtonsRegex = /<button\n\s*onClick=\{\(\) => \{\n\s*setIsWithdrawAllActive\(false\);\n\s*if \(activeUserShares\) setWithdrawShares\(formatUnits\(activeUserShares, 6\)\);\n\s*\}\}[\s\S]*?Max\n\s*<\/button>\n\s*<span className="text-slate-300 dark:text-slate-700">\|<\/span>\n\s*<button\n\s*onClick=\{startWithdrawAll\}[\s\S]*?Withdraw All\n\s*<\/button>/m;
content = content.replace(withdrawAllButtonsRegex, `<button
                      onClick={() => {
                        if (activeUserShares) setWithdrawShares(formatUnits(activeUserShares, 6));
                      }}
                      className="text-accent hover:text-accentHover font-semibold min-h-0 min-w-0 h-auto w-auto px-1.5 py-0.5 rounded hover:bg-accent/10 transition-colors"
                    >
                      Max
                    </button>`);

// 6. Remove the WithdrawAll UI section {isWithdrawAllActive && ( ... )}
const withdrawAllUIRegex = /                \{isWithdrawAllActive && \([\s\S]*?\}\)/m;
content = content.replace(withdrawAllUIRegex, '');

// 7. Simplify the Withdraw button disabled logic
// Old disabled logic:
/*
                  disabled={
                    isWithdrawAllActive
                      ? (activePendingState || isSwitching)
                      : ((!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID) || activePendingState || isSwitching)
                  }
*/
const disabledRegex = /disabled=\{[\s\S]*?\}/m;
// Actually there are multiple disabled={}, so let's match precisely around onClick={handleWithdraw}
const buttonClassLogicRegex = /disabled=\{[\s\S]*?isWithdrawAllActive[\s\S]*?\}\n\s*className=\{`group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all \$\{\(isWithdrawAllActive \? false : \(\!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID\)\)\n\s*\? "bg-black\/5 dark:bg-white\/5 text-slate-400 cursor-not-allowed"\n\s*: \(activePendingState \|\| isSwitching\)\n\s*\? "bg-foreground\/50 text-background cursor-wait"\n\s*: "border-2 border-foreground bg-transparent text-foreground shadow-sm active:scale-\[0\.98\]"\n\s*\}\`\}/m;

content = content.replace(buttonClassLogicRegex, `disabled={(!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID) || activePendingState || isSwitching}
                  className={\`group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all \${(!withdrawShares && chainId === ARC_TESTNET_CHAIN_ID)
                      ? "bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                      : (activePendingState || isSwitching)
                        ? "bg-foreground/50 text-background cursor-wait"
                        : "border-2 border-foreground bg-transparent text-foreground shadow-sm active:scale-[0.98]"
                    }\`}`);

// 8. Simplify Withdraw button inner content
const buttonInnerRegex = /\{\(isWithdrawAllActive \|\| withdrawShares \|\| chainId !== ARC_TESTNET_CHAIN_ID\) && \!activePendingState && \!isSwitching && \(/m;
content = content.replace(buttonInnerRegex, `{(withdrawShares || chainId !== ARC_TESTNET_CHAIN_ID) && !activePendingState && !isSwitching && (`);

const buttonTextRegex = /: isWithdrawAllActive\n\s*\? \(isPending && txType === "withdraw" \? "Requesting\.\.\." : \`Request j\$\{isUSDC \? "USDC" : "EURC"\}\ Withdrawal\`\)\n\s*: \!withdrawShares/m;
content = content.replace(buttonTextRegex, `: !withdrawShares`);

// Remove handleWithdrawAll and startWithdrawAll declarations entirely if we missed startWithdrawAll
content = content.replace(/  const startWithdrawAll = \(\) => \{\n    handleWithdrawAll\(\);\n  \};\n/g, '');


fs.writeFileSync(filePath, content, 'utf-8');
console.log("File updated successfully.");
