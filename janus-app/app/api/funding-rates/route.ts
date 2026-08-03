import { NextResponse } from 'next/server';

export const revalidate = 30;

export async function GET() {
  try {
    // We fetch from all 5 major exchanges simultaneously.
    // If any exchange fails (e.g., due to Vercel US IP blocks on Binance/Bybit),
    // we simply catch the error and return an empty array for that exchange.
    // This makes the engine globally resilient and automatically maximizes available data based on the server's region.
    
    const [hlRes, kcRes, bnRes, bbRes, mxRes] = await Promise.allSettled([
      fetch('https://api.hyperliquid.xyz/info', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
        next: { revalidate: 30 } 
      }).then(r => r.ok ? r.json() : []),
      
      fetch('https://api-futures.kucoin.com/api/v1/contracts/active', { next: { revalidate: 30 } })
        .then(r => r.ok ? r.json() : { data: [] }),
        
      fetch('https://fapi.binance.com/fapi/v1/premiumIndex', { next: { revalidate: 30 } })
        .then(r => r.ok ? r.json() : []),
        
      fetch('https://api.bybit.com/v5/market/tickers?category=linear', { next: { revalidate: 30 } })
        .then(r => r.ok ? r.json() : { result: { list: [] } }),
        
      fetch('https://contract.mexc.com/api/v1/contract/funding_rate', { next: { revalidate: 30 } })
        .then(r => r.ok ? r.json() : { data: [] })
    ]);

    const hlData = hlRes.status === 'fulfilled' ? hlRes.value : [];
    const kcData = kcRes.status === 'fulfilled' ? kcRes.value : { data: [] };
    const bnData = bnRes.status === 'fulfilled' ? bnRes.value : [];
    const bbData = bbRes.status === 'fulfilled' ? bbRes.value : { result: { list: [] } };
    const mxData = mxRes.status === 'fulfilled' ? mxRes.value : { data: [] };

    // Standardize all rates into a unified map: { [asset]: { [exchange]: rate } }
    const ratesMap = new Map<string, { [exchange: string]: number }>();

    const addRate = (asset: string, exchange: string, rate: number) => {
      if (!ratesMap.has(asset)) ratesMap.set(asset, {});
      ratesMap.get(asset)![exchange] = rate;
    };

    // 1. Parse Hyperliquid
    if (hlData[0]?.universe && hlData[1]) {
      hlData[0].universe.forEach((asset: any, index: number) => {
        if (hlData[1][index]) {
          // Hyperliquid gives hourly rate, standard is 8h
          addRate(asset.name, 'Hyperliquid', parseFloat(hlData[1][index].funding) * 8);
        }
      });
    }

    // 2. Parse KuCoin
    if (kcData?.data) {
      kcData.data.forEach((item: any) => {
        if (item.quoteCurrency === 'USDT' || item.quoteCurrency === 'USDC') {
          let symbol = item.baseCurrency;
          if (symbol === 'XBT') symbol = 'BTC';
          addRate(symbol, 'KuCoin', parseFloat(item.fundingFeeRate || 0));
        }
      });
    }

    // 3. Parse Binance
    if (Array.isArray(bnData)) {
      bnData.forEach((item: any) => {
        if (item.symbol && (item.symbol.endsWith('USDT') || item.symbol.endsWith('BUSD'))) {
          const symbol = item.symbol.replace(/USDT|BUSD$/, '');
          addRate(symbol, 'Binance', parseFloat(item.lastFundingRate || 0));
        }
      });
    }

    // 4. Parse Bybit
    if (bbData?.result?.list) {
      bbData.result.list.forEach((item: any) => {
        if (item.symbol && item.symbol.endsWith('USDT')) {
          const symbol = item.symbol.replace('USDT', '');
          addRate(symbol, 'Bybit', parseFloat(item.fundingRate || 0));
        }
      });
    }

    // 5. Parse MEXC
    if (mxData?.data) {
      mxData.data.forEach((item: any) => {
        if (item.symbol && item.symbol.endsWith('_USDT')) {
          const symbol = item.symbol.replace('_USDT', '');
          addRate(symbol, 'MEXC', parseFloat(item.fundingRate || 0));
        }
      });
    }

    const opportunities: any[] = [];

    // Evaluate all pairwise permutations for each asset to find the best arbitrage
    ratesMap.forEach((exchanges, asset) => {
      const exchangeNames = Object.keys(exchanges);
      if (exchangeNames.length >= 2) {
        // Find highest and lowest
        let maxEx = exchangeNames[0];
        let minEx = exchangeNames[0];

        exchangeNames.forEach(ex => {
          if (exchanges[ex] > exchanges[maxEx]) maxEx = ex;
          if (exchanges[ex] < exchanges[minEx]) minEx = ex;
        });

        if (maxEx !== minEx) {
          const spread = exchanges[maxEx] - exchanges[minEx];
          const projectedAPY = spread * 3 * 365 * 100; // 3 epochs/day * 365 days

          if (spread > 0.00001) {
            opportunities.push({
              asset,
              exchangeARate: (exchanges[maxEx] * 100).toFixed(4),
              exchangeBRate: (exchanges[minEx] * 100).toFixed(4),
              spread: (spread * 100).toFixed(4),
              projectedAPY: projectedAPY.toFixed(2),
              longExchange: minEx,
              shortExchange: maxEx,
              exA: maxEx,
              exB: minEx
            });
          }
        }
      }
    });

    // Sort by projected APY and return Top 10
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
