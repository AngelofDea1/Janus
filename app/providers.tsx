'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React from 'react';

// ARC TESTNET CHAIN CONFIG
const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
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

const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(), // MetaMask, Rabby, Phantom, OKX — any browser-injected wallet
    walletConnect({
      projectId: 'a8c85ce0eab10e6a14faf1b1a1e1a1a1',
      showQrModal: true,
    }),
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
