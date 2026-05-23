import type { Metadata } from "next";
import { headers } from 'next/headers';
import "./globals.css";

import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Janus",
  description: "Institutional-grade delta-neutral funding rate arbitrage on the Arc Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We use headers to derive initial theme state if possible, but the client will handle the toggle
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col relative selection:bg-accent/20">
        <div className="pointer-events-none fixed inset-0 z-[999] h-full w-full opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <Providers>
          <Navbar />
          {/* Main content area */}
          <main className="flex-1 w-full flex flex-col relative z-0 pb-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
