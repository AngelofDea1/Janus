"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-10 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article className="bg-panel border border-borderLine rounded-[32px] p-8 md:p-12 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
          <header className="mb-12 border-b border-borderLine pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-6 text-foreground leading-tight">
              How to Partake in Janus Testnet: A Complete Guide
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono text-slate-500">
              <span>June 2026</span>
              <span>•</span>
              <span>4 min read</span>
            </div>
          </header>

          <div className="space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            <p>
              Welcome to the Janus Protocol testnet! Janus is designed to bring delta-neutral, automated arbitrage yield to the masses using ERC-4626 standard vaults. In this guide, we'll walk you through exactly how to get testnet tokens, connect your wallet, and start compounding yields entirely risk-free.
            </p>

            {/* Step 1 */}
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Step 1: Set Up Your Wallet for Arc Testnet</h2>
              <p className="mb-4">
                Before you can interact with Janus, you need an EVM-compatible wallet (like MetaMask or Rabby) connected to the Arc Testnet.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 ml-2 text-base text-slate-500">
                <li><strong>Network Name:</strong> Arc Testnet</li>
                <li><strong>RPC URL:</strong> https://rpc.testnet.arc.network</li>
                <li><strong>Chain ID:</strong> 5042002</li>
                <li><strong>Currency Symbol:</strong> ETH</li>
              </ul>
              
              {/* Image Placeholder */}
              <div className="w-full h-64 bg-black/5 dark:bg-white/5 border border-borderLine border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-2">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">Insert Screenshot: Adding custom network to MetaMask</span>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Step 2: Claim Testnet USDC/EURC</h2>
              <p className="mb-4">
                Janus vaults currently support USDC and EURC. Since we are on a testnet, you can mint these stablecoins for free using the official Circle Faucet.
              </p>
              <a 
                href="https://faucet.circle.com/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg font-medium hover:bg-accent/20 transition-colors mb-6"
              >
                Go to Circle Faucet <ExternalLink className="w-4 h-4" />
              </a>
              <p className="mb-4 text-base">
                Simply paste your wallet address, select the network, and hit "Send Me Tokens". Wait a few seconds for the transaction to confirm.
              </p>

              {/* Image Placeholder */}
              <div className="w-full h-64 bg-black/5 dark:bg-white/5 border border-borderLine border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-2">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">Insert Screenshot: Circle Faucet interface</span>
              </div>
            </section>

            {/* Step 3 */}
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Step 3: Connect and Deposit</h2>
              <p className="mb-4">
                Now that your wallet is funded, head over to the <Link href="/app" className="text-accent hover:underline">Janus Trade application</Link>. Click the "Connect Wallet" button in the top right corner.
              </p>
              <p className="mb-6">
                Once connected, navigate to the vault of your choice (e.g., USDC Delta-Neutral Vault). Enter the amount you wish to deposit, and click the Deposit button. You will be prompted to approve the spending cap in your wallet, followed by the actual deposit transaction.
              </p>

              {/* Image Placeholder */}
              <div className="w-full h-64 bg-black/5 dark:bg-white/5 border border-borderLine border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-2">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">Insert Screenshot: The Janus Trade UI showing a deposit being made</span>
              </div>
            </section>

            {/* Step 4 */}
            <section>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Step 4: Watch Your Yield Grow</h2>
              <p className="mb-4">
                That's it! Once your stablecoins are in the vault, you will receive vault tokens (jUSDC/jEURC) representing your stake in the pool. 
              </p>
              <p className="mb-4 text-base text-slate-500">
                Behind the scenes, our automated keeper bots continuously scan major perpetual exchanges (Hyperliquid, KuCoin, MEXC, Binance, Bybit) for funding rate spreads. When a profitable spread is found, the protocol automatically executes a delta-neutral hedge to harvest the yield and compounds it directly back into your vault.
              </p>
              <p className="mb-6">
                You can monitor your growing balance in real-time by visiting the <Link href="/portfolio" className="text-accent hover:underline">Portfolio</Link> tab, or see the protocol's live trades on the <Link href="/ledger" className="text-accent hover:underline">Relayer Ledger</Link>.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-borderLine text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Ready to start?</h3>
              <Link href="/app">
                <button className="px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                  Launch App
                </button>
              </Link>
            </div>

          </div>
        </article>
      </div>
    </div>
  );
}
