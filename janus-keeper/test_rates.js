async function fetchBinance() {
  const res = await fetch("https://fapi.binance.com/fapi/v1/premiumIndex");
  const data = await res.json();
  const rates = {};
  data.forEach(item => {
    if (item.symbol?.endsWith("USDT")) {
      rates[item.symbol.replace("USDT", "")] = parseFloat(item.lastFundingRate || 0);
    }
  });
  return rates;
}

async function fetchBybit() {
  const res = await fetch("https://api.bybit.com/v5/market/tickers?category=linear");
  const data = await res.json();
  const rates = {};
  data.result.list.forEach(item => {
    if (item.symbol?.endsWith("USDT")) {
      rates[item.symbol.replace("USDT", "")] = parseFloat(item.fundingRate || 0);
    }
  });
  return rates;
}

async function run() {
  const [bn, bb] = await Promise.all([fetchBinance(), fetchBybit()]);
  let maxSpread = 0;
  for (const asset in bn) {
    if (bb[asset]) {
      const spread = Math.abs(bn[asset] - bb[asset]);
      if (spread > maxSpread) maxSpread = spread;
    }
  }
  console.log("Max spread:", maxSpread);
}
run();
