'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider } from 'next-themes';

// ARC TESTNET CHAIN CONFIG (FIXED GAS TOKEN)
// Arc Testnet uses ETH as native currency for gas, NOT USDC
// USDC is an ERC-20 token ON Arc, but gas is paid in ETH
const arcTestnet = {
 id: 5042002,
 name: 'Arc Testnet',
 network: 'arc-testnet',
 nativeCurrency: {
 decimals: 18,
 name: 'Ethereum', // FIXED: Was 'USD Coin'
 symbol: 'ETH', // FIXED: Was 'USDC'
 },
 rpcUrls: {
 default: { http: ['https://rpc.testnet.arc.network'] },
 public: { http: ['https://rpc.testnet.arc.network'] },
 },
 blockExplorers: {
 default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
 },
 testnet: true,
} as const;

const config = getDefaultConfig({
 appName: 'Janus',
 projectId: 'a8c85ce0eab10e6a14faf1b1a1e1a1a1', // Public fallback WalletConnect ID
 chains: [arcTestnet],
 ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
 return (
 <WagmiProvider config={config}>
 <QueryClientProvider client={queryClient}>
 <RainbowKitProvider>
 <ThemeProvider attribute="class" defaultTheme="dark">
 {children}
 </ThemeProvider>
 </RainbowKitProvider>
 </QueryClientProvider>
 </WagmiProvider>
 );
}
