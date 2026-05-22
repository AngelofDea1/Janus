import { NextResponse } from 'next/server';

// Revalidate this route every 30 seconds
export const revalidate = 30;

export async function GET() {
  try {
    const [binanceRes, bybitRes] = await Promise.all([
      fetch('https://fapi.binance.com/fapi/v1/premiumIndex', { next: { revalidate: 30 } }),
      fetch('https://api.bybit.com/v5/market/tickers?category=linear', { next: { revalidate: 30 } })
    ]);

    if (!binanceRes.ok || !bybitRes.ok) {
      throw new Error("Failed to fetch from one or more exchanges");
    }

    const binanceData = await binanceRes.json();
    const bybitData = await bybitRes.json();

    const binanceRates = new Map();
    binanceData.forEach((item: any) => {
      // Focus on USDT pairs for simplicity and high liquidity
      if (item.symbol.endsWith('USDT')) {
        binanceRates.set(item.symbol, parseFloat(item.lastFundingRate));
      }
    });

    const opportunities = [];

    if (bybitData?.result?.list) {
      bybitData.result.list.forEach((item: any) => {
        if (item.symbol.endsWith('USDT') && binanceRates.has(item.symbol)) {
          const binanceRate = binanceRates.get(item.symbol);
          const bybitRate = parseFloat(item.fundingRate);
          
          const spread = Math.abs(binanceRate - bybitRate);
          // Standard 8-hour funding rate epochs * 3 per day * 365 days
          const projectedAPY = spread * 3 * 365 * 100;

          // Only add if there is a meaningful spread (> 0.00001)
          if (spread > 0.00001) {
             opportunities.push({
               asset: item.symbol.replace('USDT', ''),
               binanceRate: (binanceRate * 100).toFixed(4),
               bybitRate: (bybitRate * 100).toFixed(4),
               spread: (spread * 100).toFixed(4),
               projectedAPY: projectedAPY.toFixed(2),
               longExchange: binanceRate < bybitRate ? 'Binance' : 'Bybit',
               shortExchange: binanceRate > bybitRate ? 'Binance' : 'Bybit'
             });
          }
        }
      });
    }

    // Sort by projected APY descending and take top 10
    const sortedOpportunities = opportunities
      .sort((a, b) => parseFloat(b.projectedAPY) - parseFloat(a.projectedAPY))
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: sortedOpportunities,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error fetching funding rates:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch funding rates" }, { status: 500 });
  }
}
