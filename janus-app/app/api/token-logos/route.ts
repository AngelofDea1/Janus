import { NextResponse } from 'next/server';

// Cache logo map for 1 hour — logos almost never change
export const revalidate = 3600;

/**
 * Server-side API that fetches the top 250 coins from CoinGecko /coins/markets
 * and returns a symbol → image URL mapping.
 * 
 * This is called once by the client and cached in memory for the entire session,
 * so individual logo lookups never need to hit external APIs.
 */
export async function GET() {
  try {
    // Fetch top 250 coins (most trading tokens) in a single request
    const [page1, page2] = await Promise.allSettled([
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false',
        { next: { revalidate: 3600 } }
      ).then(r => r.ok ? r.json() : []),
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false',
        { next: { revalidate: 3600 } }
      ).then(r => r.ok ? r.json() : []),
    ]);

    const coins1 = page1.status === 'fulfilled' ? page1.value : [];
    const coins2 = page2.status === 'fulfilled' ? page2.value : [];
    const allCoins = [...coins1, ...coins2];

    // Build a symbol → image map (use the first occurrence for each symbol,
    // which will be the highest market cap variant)
    const logoMap: Record<string, string> = {};
    for (const coin of allCoins) {
      if (coin.symbol && coin.image) {
        const sym = coin.symbol.toUpperCase();
        if (!logoMap[sym]) {
          logoMap[sym] = coin.image;
        }
      }
    }

    return NextResponse.json({
      success: true,
      logos: logoMap,
      count: Object.keys(logoMap).length,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Token logos API error:', error);
    return NextResponse.json(
      { success: false, logos: {}, error: error.message },
      { status: 500 }
    );
  }
}
