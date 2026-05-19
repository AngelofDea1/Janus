import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Janus - Funding Rate Arbitrage',
  description: 'Institutional-grade funding rate arbitrage on Arc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-white dark:bg-[#060814] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <Providers>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
