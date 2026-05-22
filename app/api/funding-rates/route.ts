import { NextResponse } from 'next/server';

export const revalidate = 30;

export async function GET() {
  try {
    const [hlRes, kcRes] = await Promise.all([
      fetch('https://api.hyperliquid.xyz/info', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
        next: { revalidate: 30 } 
      }),
      fetch('https://api-futures.kucoin.com/api/v1/contracts/active', { next: { revalidate: 30 } })
    ]);

    if (!hlRes.ok || !kcRes.ok) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch from exchanges",
        hyperliquid: { status: hlRes.status, statusText: hlRes.statusText },
        kucoin: { status: kcRes.status, statusText: kcRes.statusText }
      }, { status: 500 });
    }

    const hlData = await hlRes.json();
    const kcData = await kcRes.json();

    const hlRates = new Map();
    // Hyperliquid returns [meta, assetCtxs]
    const universe = hlData[0]?.universe || [];
    const assetCtxs = hlData[1] || [];
    
    universe.forEach((asset: any, index: number) => {
      if (assetCtxs[index]) {
        // Hyperliquid provides hourly funding, multiply by 8 for standard 8h epoch comparison
        const fundingRate8h = parseFloat(assetCtxs[index].funding) * 8;
        hlRates.set(asset.name, fundingRate8h);
      }
    });

    const opportunities: any[] = [];

    if (kcData?.data) {
      kcData.data.forEach((item: any) => {
        if (item.quoteCurrency === 'USDT' || item.quoteCurrency === 'USDC') {
          // e.g. XBTUSDTM -> BTC
          let symbol = item.baseCurrency;
          if (symbol === 'XBT') symbol = 'BTC';

          if (hlRates.has(symbol)) {
            const hlRate = hlRates.get(symbol);
            const kcRate = parseFloat(item.fundingFeeRate || 0);
            
            const spread = Math.abs(hlRate - kcRate);
            // Standard 8-hour funding rate epochs * 3 per day * 365 days
            const projectedAPY = spread * 3 * 365 * 100;

            if (spread > 0.00001) {
               opportunities.push({
                 asset: symbol,
                 exchangeARate: (hlRate * 100).toFixed(4),
                 exchangeBRate: (kcRate * 100).toFixed(4),
                 spread: (spread * 100).toFixed(4),
                 projectedAPY: projectedAPY.toFixed(2),
                 longExchange: hlRate < kcRate ? 'Hyperliquid' : 'KuCoin',
                 shortExchange: hlRate > kcRate ? 'Hyperliquid' : 'KuCoin'
               });
            }
          }
        }
      });
    }

    const sortedOpportunities = opportunities
      .sort((a, b) => parseFloat(b.projectedAPY) - parseFloat(a.projectedAPY))
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: sortedOpportunities,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error("Error fetching funding rates:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
