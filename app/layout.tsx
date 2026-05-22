import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Janus - Institutional Arbitrage',
  description: 'Delta-neutral funding rate arbitrage on Arc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <Providers>
          <Navbar />
          <div className="flex-grow border-x border-black/10 dark:border-white/10 max-w-[1400px] mx-auto w-full bg-white dark:bg-black">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
