import type { Metadata } from "next";
import { headers } from 'next/headers';
import "./globals.css";

import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Janus",
  description: "Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
      <body className="min-h-screen flex flex-col relative selection:bg-accent/20">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full flex flex-col relative z-0">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
