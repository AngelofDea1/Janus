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

    // Fallback: Return empty execution log when keeper is offline
    // The frontend will show the funding-rates API data instead
    return NextResponse.json({
      success: true,
      source: 'fallback',
      executions: [],
      stats: {
        totalVolume: 0,
        totalYield: 0,
        successCount: 0,
        failCount: 0,
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
