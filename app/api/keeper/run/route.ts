import { NextResponse } from "next/server";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PROFIT_THRESHOLD = 0.0005; // 0.05% minimum spread to execute
const ARC_USDC = "0x3600000000000000000000000000000000000000";
const ARC_EURC = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";
const EURC_VAULT = "0xb8d81f1874fe9679a5512ad3acfc22755498b153";

const REAL_TX_HASHES = [
  "0xf18d23bf41f392b2019bc779576d4ccdbc44339752676a8db82b9624155e4387",
  "0x45b9f3155880839d2bb5976e044a93ee7fe3573e7b8f94e4625909af8cb3a9e2",
  "0x0861c03ca7c2740dc538bbb611b3e57551f6a9d8dcf9ce7c849de2476f37f4f9",
  "0x55e287860a48b49ad9318ed6daa2a5f3e6df72dbeed9ee95432ae0f3acdc3ae1",
  "0x46d29b4749e0fb6f7a0988bea5001d9cb050d3c6b88607306dfc8854acdeadaf",
  "0x068bd2263c7f95678aad73c6fcd683093207d60fa6e82e28a22c430caa5de768",
  "0xc1a6131bae2106a77e9c5abf18050d7c6e09765477b53b1f63e34fdb18f5668d"
];

// Fetchers
async function fetchHyperliquid() {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    const rates: Record<string, number> = {};
    if (data[0]?.universe && data[1]) {
      data[0].universe.forEach((asset: any, idx: number) => {
        if (data[1][idx]?.funding) {
          rates[asset.name] = parseFloat(data[1][idx].funding) * 8;
        }
      });
    }
    return rates;
  } catch { return {}; }
}

async function fetchKuCoin() {
  try {
    const res = await fetch("https://api-futures.kucoin.com/api/v1/contracts/active");
    if (!res.ok) return {};
    const data = await res.json();
    const rates: Record<string, number> = {};
    if (data?.data) {
      data.data.forEach((item: any) => {
        if (item.quoteCurrency === "USDT" || item.quoteCurrency === "USDC") {
          let symbol = item.baseCurrency;
          if (symbol === "XBT") symbol = "BTC";
          rates[symbol] = parseFloat(item.fundingFeeRate || 0);
        }
      });
    }
    return rates;
  } catch { return {}; }
}

async function fetchMEXC() {
  try {
    const res = await fetch("https://contract.mexc.com/api/v1/contract/funding_rate");
    if (!res.ok) return {};
    const data = await res.json();
    const rates: Record<string, number> = {};
    if (data?.data) {
      data.data.forEach((item: any) => {
        if (item.symbol?.endsWith("_USDT")) {
          const symbol = item.symbol.replace("_USDT", "");
          rates[symbol] = parseFloat(item.fundingRate || 0);
        }
      });
    }
    return rates;
  } catch { return {}; }
}

async function fetchBinance() {
  try {
    const res = await fetch("https://fapi.binance.com/fapi/v1/premiumIndex");
    if (!res.ok) return {};
    const data = await res.json();
    const rates: Record<string, number> = {};
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.symbol?.endsWith("USDT")) {
          const symbol = item.symbol.replace("USDT", "");
          rates[symbol] = parseFloat(item.lastFundingRate || 0);
        }
      });
    }
    return rates;
  } catch { return {}; }
}

async function fetchBybit() {
  try {
    const res = await fetch("https://api.bybit.com/v5/market/tickers?category=linear");
    if (!res.ok) return {};
    const data = await res.json();
    const rates: Record<string, number> = {};
    if (data?.result?.list) {
      data.result.list.forEach((item: any) => {
        if (item.symbol?.endsWith("USDT")) {
          const symbol = item.symbol.replace("USDT", "");
          rates[symbol] = parseFloat(item.fundingRate || 0);
        }
      });
    }
    return rates;
  } catch { return {}; }
}

async function fetchVaultTotalAssets(contractAddress: string) {
  try {
    const res = await fetch("https://rpc.testnet.arc.network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: contractAddress, data: "0x01e1d114" }, "latest"]
      })
    });
    if (!res.ok) return 10;
    const json = await res.json();
    if (json.result && json.result !== "0x") {
      const hex = json.result.replace("0x", "");
      const rawAssets = BigInt("0x" + hex);
      const assets = Number(rawAssets) / 1e6;
      return assets > 0 ? assets : 10;
    }
  } catch {}
  return 10;
}

async function fetchAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string) {
  try {
    const ownerHex = ownerAddress.toLowerCase().replace("0x", "").padStart(64, "0");
    const spenderHex = spenderAddress.toLowerCase().replace("0x", "").padStart(64, "0");
    const data = "0xdd62ed3e" + ownerHex + spenderHex;

    const res = await fetch("https://rpc.testnet.arc.network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: tokenAddress, data }, "latest"]
      })
    });
    if (!res.ok) return BigInt(0);
    const json = await res.json();
    if (json.result && json.result !== "0x") {
      return BigInt(json.result);
    }
  } catch {}
  return BigInt(0);
}

async function fetchTokenBalance(tokenAddress: string, walletAddress: string) {
  try {
    const cleanAddress = walletAddress.toLowerCase().replace("0x", "");
    const data = "0x70a08231" + cleanAddress.padStart(64, "0");
    const res = await fetch("https://rpc.testnet.arc.network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: tokenAddress, data }, "latest"]
      })
    });
    if (!res.ok) return BigInt(0);
    const json = await res.json();
    if (json.result && json.result !== "0x") {
      return BigInt(json.result);
    }
  } catch {}
  return BigInt(0);
}

export async function POST(req: Request) {
  try {
    // 1. Authorization Check
    const authHeader = req.headers.get("authorization");
    const secret = process.env.KEEPER_CRON_SECRET || "janus_default_secure_secret_123456";
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Load SDK configs
    const apiKey = process.env.CIRCLE_API_KEY;
    const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
    const walletId = process.env.WALLET_ID;
    const usdcVault = process.env.CONTRACT_ADDRESS;
    const walletAddress = process.env.WALLET_ADDRESS;

    if (!apiKey || !entitySecret || !walletId || !usdcVault || !walletAddress) {
      return NextResponse.json({ error: "Missing keeper configurations in server environment." }, { status: 500 });
    }

    // 3. Fetch Funding Rates
    const [hl, kc, mx, bn, bb] = await Promise.all([
      fetchHyperliquid(),
      fetchKuCoin(),
      fetchMEXC(),
      fetchBinance(),
      fetchBybit()
    ]);

    const exchangeRates = { Hyperliquid: hl, KuCoin: kc, MEXC: mx, Binance: bn, Bybit: bb };
    const ratesMap = new Map<string, Record<string, number>>();

    for (const [exchange, rates] of Object.entries(exchangeRates)) {
      for (const [asset, rate] of Object.entries(rates)) {
        if (!ratesMap.has(asset)) ratesMap.set(asset, {});
        ratesMap.get(asset)![exchange] = rate;
      }
    }

    const opportunities: any[] = [];
    ratesMap.forEach((exchanges, asset) => {
      const exchangeNames = Object.keys(exchanges);
      if (exchangeNames.length < 2) return;

      let maxEx = exchangeNames[0], minEx = exchangeNames[0];
      exchangeNames.forEach(ex => {
        if (exchanges[ex] > exchanges[maxEx]) maxEx = ex;
        if (exchanges[ex] < exchanges[minEx]) minEx = ex;
      });

      if (maxEx !== minEx) {
        const spread = exchanges[maxEx] - exchanges[minEx];
        if (spread > PROFIT_THRESHOLD) {
          opportunities.push({
            asset,
            shortExchange: maxEx,
            longExchange: minEx,
            shortRate: exchanges[maxEx],
            longRate: exchanges[minEx],
            spread,
            spreadPct: (spread * 100).toFixed(4),
            route: `${maxEx} ➔ ${minEx}`,
          });
        }
      }
    });

    if (opportunities.length === 0) {
      console.log("CRON RESULT: no_opportunities (all spreads below threshold)");
      return NextResponse.json({ status: "no_opportunities", message: "All spreads below threshold" });
    }

    // Sort to execute top opportunity
    opportunities.sort((a, b) => b.spread - a.spread);
    const bestOpp = opportunities[0];
    console.log(`CRON BEST OPP: ${bestOpp.asset} Spread: ${bestOpp.spreadPct}%`);

    // 4. Initialize Circle SDK
    const circleClient = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });
    const results: any[] = [];

    // --- USDC Vault Arbitrage Execution ---
    try {
      const usdcTvl = await fetchVaultTotalAssets(usdcVault);
      const usdcVolume = usdcTvl;
      const usdcSpreadFraction = parseFloat(bestOpp.spreadPct) / 100;
      const usdcYieldFloat = usdcVolume * usdcSpreadFraction;
      let usdcYieldWei = String(Math.max(1, Math.floor(usdcYieldFloat * 1e6)));

      // Balance-aware check
      const tokenBalance = await fetchTokenBalance(ARC_USDC, walletAddress);
      if (tokenBalance === BigInt(0)) {
        throw new Error("INSUFFICIENT_TOKEN (USDC balance is zero)");
      }
      if (tokenBalance < BigInt(usdcYieldWei)) {
        console.log(`⚠️ Keeper balance too low. Capping harvest yield to keeper balance: ${Number(tokenBalance) / 1e6} USDC`);
        usdcYieldWei = String(tokenBalance);
      }

      // Check USDC allowance first to avoid redundant transactions and nonce collisions
      const allowance = await fetchAllowance(ARC_USDC, walletAddress, usdcVault);
      const required = BigInt(usdcYieldWei);
      let approveTxId = null;

      if (allowance < required) {
        const massiveApproval = "100000000000000"; // 100M USDC
        const approveUsdc = await circleClient.createContractExecutionTransaction({
          walletId,
          abiFunctionSignature: "approve(address,uint256)",
          abiParameters: [usdcVault, massiveApproval],
          contractAddress: ARC_USDC,
          fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });
        
        results.push({
          vault: "USDC",
          status: "approving",
          opportunity: bestOpp.asset,
          approveTxId: approveUsdc.data?.id,
          message: "Approval transaction broadcasted. Will harvest on the next cron cycle."
        });
      } else {
        // Harvest USDC Vault Yield
        const harvestUsdc = await circleClient.createContractExecutionTransaction({
          walletId,
          abiFunctionSignature: "harvestYield(uint256,string,string,uint256,string)",
          abiParameters: [
            usdcYieldWei,
            bestOpp.asset,
            bestOpp.route,
            String(Math.floor(usdcVolume * 1e6)),
            bestOpp.spreadPct
          ],
          contractAddress: usdcVault,
          fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });

        results.push({
          vault: "USDC",
          status: "harvested",
          opportunity: bestOpp.asset,
          route: bestOpp.route,
          spread: `${bestOpp.spreadPct}%`,
          harvestTxId: harvestUsdc.data?.id,
          volume: usdcVolume,
          yieldAmount: parseFloat((Number(usdcYieldWei) / 1e6).toFixed(6))
        });
      }
    } catch (e: any) {
      results.push({ vault: "USDC", status: "failed", error: e.message });
    }

    // Delay 2 seconds between the vaults to avoid nonce collisions if both need approvals
    await new Promise(r => setTimeout(r, 2000));

    // --- EURC Vault Arbitrage Execution ---
    try {
      const eurcTvl = await fetchVaultTotalAssets(EURC_VAULT);
      const eurcVolume = eurcTvl;
      const eurcSpreadFraction = parseFloat(bestOpp.spreadPct) / 100;
      const eurcYieldFloat = eurcVolume * eurcSpreadFraction;
      let eurcYieldWei = String(Math.max(1, Math.floor(eurcYieldFloat * 1e6)));

      // Balance-aware check
      const tokenBalance = await fetchTokenBalance(ARC_EURC, walletAddress);
      if (tokenBalance === BigInt(0)) {
        throw new Error("INSUFFICIENT_TOKEN (EURC balance is zero)");
      }
      if (tokenBalance < BigInt(eurcYieldWei)) {
        console.log(`⚠️ Keeper balance too low. Capping harvest yield to keeper balance: ${Number(tokenBalance) / 1e6} EURC`);
        eurcYieldWei = String(tokenBalance);
      }

      // Check EURC allowance first to avoid redundant transactions and nonce collisions
      const allowance = await fetchAllowance(ARC_EURC, walletAddress, EURC_VAULT);
      const required = BigInt(eurcYieldWei);
      let approveTxId = null;

      if (allowance < required) {
        const massiveApproval = "100000000000000"; // 100M EURC
        const approveEurc = await circleClient.createContractExecutionTransaction({
          walletId,
          abiFunctionSignature: "approve(address,uint256)",
          abiParameters: [EURC_VAULT, massiveApproval],
          contractAddress: ARC_EURC,
          fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });
        
        results.push({
          vault: "EURC",
          status: "approving",
          opportunity: bestOpp.asset,
          approveTxId: approveEurc.data?.id,
          message: "Approval transaction broadcasted. Will harvest on the next cron cycle."
        });
      } else {
        // Harvest EURC Vault Yield
        const harvestEurc = await circleClient.createContractExecutionTransaction({
          walletId,
          abiFunctionSignature: "harvestYield(uint256,string,string,uint256,string)",
          abiParameters: [
            eurcYieldWei,
            bestOpp.asset,
            bestOpp.route,
            String(Math.floor(eurcVolume * 1e6)),
            bestOpp.spreadPct
          ],
          contractAddress: EURC_VAULT,
          fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });

        results.push({
          vault: "EURC",
          status: "harvested",
          opportunity: bestOpp.asset,
          route: bestOpp.route,
          spread: `${bestOpp.spreadPct}%`,
          harvestTxId: harvestEurc.data?.id,
          volume: eurcVolume,
          yieldAmount: parseFloat((Number(eurcYieldWei) / 1e6).toFixed(6))
        });
      }
    } catch (e: any) {
      results.push({ vault: "EURC", status: "failed", error: e.message });
    }

    console.log("CRON EXECUTION COMPLETED. Results:", JSON.stringify(results, null, 2));
    return NextResponse.json({
      status: "success",
      timestamp: Date.now(),
      results
    });

  } catch (error: any) {
    console.error("CRON ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
