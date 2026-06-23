import type { Metadata, Viewport } from "next";
import { headers } from 'next/headers';
import "./globals.css";

import { Sora, Inter_Tight, Cormorant_Garamond } from 'next/font/google';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'], variable: '--font-cormorant' });

import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DebugConsole from "@/components/DebugConsole";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Janus",
  description: "Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.",
  metadataBase: new URL("https://janushq.xyz"),
  openGraph: {
    title: "Janus",
    description: "Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.",
    url: "https://janushq.xyz",
    siteName: "Janus",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Janus Protocol - Delta-Neutral Arbitrage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Janus",
    description: "Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.",
    images: ["/twitter-image.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Janus',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col relative selection:bg-accent/20 ${interTight.variable} ${sora.variable} ${cormorant.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full flex flex-col relative z-0">
            {children}
          </main>
          <Footer />
          <DebugConsole />
        </Providers>
      </body>
    </html>
  );
}
