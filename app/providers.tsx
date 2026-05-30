'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider, useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

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

function RainbowThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Customized styling to blend with Janus' premium design system
  const customLightTheme = lightTheme({
    accentColor: '#0f172a', // Slate 900
    accentColorForeground: '#ffffff',
    borderRadius: 'large',
    fontStack: 'system',
  });

  const customDarkTheme = {
    ...darkTheme({
      accentColor: '#ffffff',
      accentColorForeground: '#0f172a',
      borderRadius: 'large',
      fontStack: 'system',
    }),
    colors: {
      ...darkTheme().colors,
      modalText: '#ffffff',
      modalTextDim: '#cbd5e1',
      modalTextSecondary: '#94a3b8',
      modalBackground: '#1a1a2e',
      modalBorder: 'rgba(255,255,255,0.08)',
      closeButton: '#ffffff',
      closeButtonBackground: 'rgba(255,255,255,0.1)',
      generalBorder: 'rgba(255,255,255,0.08)',
      generalBorderDim: 'rgba(255,255,255,0.04)',
      menuItemBackground: 'rgba(255,255,255,0.06)',
      connectButtonText: '#ffffff',
      connectButtonBackground: '#1a1a2e',
      actionButtonBorder: 'rgba(255,255,255,0.12)',
      actionButtonBorderMobile: 'rgba(255,255,255,0.12)',
      actionButtonSecondaryBackground: 'rgba(255,255,255,0.08)',
    },
  };

  // Default to dark theme on server/hydration, switch dynamically on client mount
  const activeTheme = mounted && resolvedTheme === 'light' ? customLightTheme : customDarkTheme;

  return (
    <RainbowKitProvider theme={activeTheme}>
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
 return (
 <WagmiProvider config={config}>
 <QueryClientProvider client={queryClient}>
 <ThemeProvider attribute="class" defaultTheme="dark">
 <RainbowThemeWrapper>
 {children}
 </RainbowThemeWrapper>
 </ThemeProvider>
 </QueryClientProvider>
 </WagmiProvider>
 );
}
