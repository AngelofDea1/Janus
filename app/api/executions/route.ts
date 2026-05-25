import { NextResponse } from 'next/server';

export const revalidate = 10; // Refresh every 10 seconds

const KEEPER_URL = process.env.KEEPER_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // Try to fetch real execution data from the keeper's HTTP server
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    try {
      const res = await fetch(`${KEEPER_URL}/executions`, {
        signal: controller.signal,
        next: { revalidate: 10 },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          source: 'keeper',
          ...data,
          timestamp: Date.now(),
        });
      }
    } catch {
      clearTimeout(timeout);
      // Keeper not reachable — fall through to fallback
    }

    // Fallback: Return execution log from our last keeper run when offline
    // The frontend will show this data instead of just the funding-rates API data
    return NextResponse.json({
      success: true,
      source: 'fallback',
      executions: [
        {
          id: "0x781e167e4825b8f734f94428b83e05226b11a9497d22f39a32f5bb3a898094dc",
          circleTxId: "af4efcfc-67df-5327-bc5c-6ea28560afe6",
          asset: "SOXL",
          route: "KuCoin ➔ Binance",
          shortExchange: "KuCoin",
          longExchange: "Binance",
          spread: "1.8516",
          volume: 9885.62,
          yieldAmount: 100,
          status: "Executed",
          timestamp: 1779703642820,
          blockTime: "2026-05-25T10:07:22.820Z"
        }
      ],
      stats: {
        totalVolume: 9885.62,
        totalYield: 100,
        successCount: 1,
        failCount: 0
      },
      timestamp: Date.now(),
    });

  } catch (error: any) {
    console.error("Error fetching executions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
