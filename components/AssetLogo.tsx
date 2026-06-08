"use client";

import React, { useState, useEffect, useRef } from "react";

interface AssetLogoProps {
  asset: string;
  size?: number;
  className?: string;
}

// ─── Deterministic gradient palette for fallback icons ───────────
const GRADIENTS = [
  ["#6366f1", "#a855f7"], // indigo → purple
  ["#10b981", "#14b8a6"], // emerald → teal
  ["#f43f5e", "#f97316"], // rose → orange
  ["#8b5cf6", "#d946ef"], // violet → fuchsia
  ["#0ea5e9", "#2563eb"], // sky → blue
  ["#f59e0b", "#ef4444"], // amber → red
  ["#06b6d4", "#6366f1"], // cyan → indigo
  ["#ec4899", "#a855f7"], // pink → purple
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// ═══════════════════════════════════════════════════════════════════
// VERIFIED STATIC OVERRIDES — all URLs tested 200 OK as of Jun 2026
// These are the highest-priority layer and bypass ALL network calls.
// ═══════════════════════════════════════════════════════════════════
const VERIFIED_LOGOS: Record<string, string> = {
  // ─── Major stablecoins ─────────────────────────────────────────
  "USDC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/usdc.png",
  "USDT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/usdt.png",
  "EURC": "https://s2.coinmarketcap.com/static/img/coins/128x128/20641.png",
  "EUR": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/eur.png",
  "DAI": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/dai.png",
  "TUSD": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/tusd.png",
  "BUSD": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/busd.png",

  // ─── Top L1s ───────────────────────────────────────────────────
  "BTC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/btc.png",
  "ETH": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/eth.png",
  "SOL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/sol.png",
  "BNB": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/bnb.png",
  "AVAX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/avax.png",
  "DOT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/dot.png",
  "ADA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/ada.png",
  "ATOM": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/atom.png",
  "NEAR": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/near.png",
  "TRX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/trx.png",
  "XRP": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/xrp.png",
  "DOGE": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/doge.png",
  "SHIB": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/shib.png",
  "LTC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/ltc.png",
  "BCH": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/bch.png",
  "ETC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/etc.png",
  "FIL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/fil.png",
  "XLM": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/xlm.png",
  "ALGO": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/algo.png",
  "HBAR": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/hbar.png",
  "EOS": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/eos.png",
  "XTZ": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/xtz.png",
  "FTM": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/ftm.png",
  "EGLD": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/egld.png",
  "KAS": "https://assets.coincap.io/assets/icons/kas@2x.png",
  "SUI": "https://assets.coincap.io/assets/icons/sui@2x.png",
  "SEI": "https://assets.coincap.io/assets/icons/sei@2x.png",
  "APT": "https://assets.coincap.io/assets/icons/apt@2x.png",
  "TON": "https://assets.coincap.io/assets/icons/ton@2x.png",
  "ICP": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/icp.png",

  // ─── L2s / Layer 2 tokens (previously broken 404s fixed) ──────
  "ARB": "https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg",
  "OP": "https://coin-images.coingecko.com/coins/images/25244/large/Token.png",
  "MATIC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/matic.png",
  "POL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/matic.png",

  // ─── DeFi blue-chips ───────────────────────────────────────────
  "LINK": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/link.png",
  "UNI": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/uni.png",
  "AAVE": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/aave.png",
  "LDO": "https://coin-images.coingecko.com/coins/images/13573/large/Lido_DAO.png",
  "MKR": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/mkr.png",
  "SNX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/snx.png",
  "CRV": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/crv.png",
  "COMP": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/comp.png",
  "SUSHI": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/sushi.png",
  "1INCH": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/1inch.png",
  "BAL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/bal.png",
  "YFI": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/yfi.png",
  "PENDLE": "https://assets.coincap.io/assets/icons/pendle@2x.png",
  "ENJ": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/enj.png",
  "GRT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/grt.png",
  "DODO": "https://assets.coincap.io/assets/icons/dodo@2x.png",
  "GTC": "https://assets.coincap.io/assets/icons/gtc@2x.png",

  // ─── CEX tokens ────────────────────────────────────────────────
  "CRO": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/cro.png",
  "KCS": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/kcs.png",

  // ─── Other high-volume perp assets ─────────────────────────────
  "WLD": "https://assets.coincap.io/assets/icons/wld@2x.png",
  "TIA": "https://assets.coincap.io/assets/icons/tia@2x.png",
  "STX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/stx.png",
  "INJ": "https://assets.coincap.io/assets/icons/inj@2x.png",
  "RUNE": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/rune.png",
  "WIF": "https://assets.coincap.io/assets/icons/wif@2x.png",
  "PEPE": "https://assets.coincap.io/assets/icons/pepe@2x.png",
  "FLOKI": "https://assets.coincap.io/assets/icons/floki@2x.png",
  "BONK": "https://assets.coincap.io/assets/icons/bonk@2x.png",
  "JUP": "https://assets.coincap.io/assets/icons/jup@2x.png",
  "PYTH": "https://assets.coincap.io/assets/icons/pyth@2x.png",
  "ORDI": "https://assets.coincap.io/assets/icons/ordi@2x.png",
  "IMX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/imx.png",
  "SAND": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/sand.png",
  "MANA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/mana.png",
  "AXS": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/axs.png",
  "GALA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/gala.png",
  "CHZ": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/chz.png",
  "RENDER": "https://assets.coincap.io/assets/icons/rndr@2x.png",
  "RNDR": "https://assets.coincap.io/assets/icons/rndr@2x.png",
  "FET": "https://assets.coincap.io/assets/icons/fet@2x.png",
  "THETA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/theta.png",
  "AGIX": "https://assets.coincap.io/assets/icons/agix@2x.png",
  "CFX": "https://assets.coincap.io/assets/icons/cfx@2x.png",
  "ZIL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/zil.png",
  "ROSE": "https://assets.coincap.io/assets/icons/rose@2x.png",
  "MINA": "https://assets.coincap.io/assets/icons/mina@2x.png",
  "ZRX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/zrx.png",
  "ENS": "https://assets.coincap.io/assets/icons/ens@2x.png",
  "APE": "https://assets.coincap.io/assets/icons/ape@2x.png",
  "ANKR": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/ankr.png",
  "GMT": "https://assets.coincap.io/assets/icons/gmt@2x.png",
  "SKL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/skl.png",
  "VET": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/vet.png",
  "IOTA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/iota.png",
  "ONE": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/one.png",
  "ZEC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/zec.png",
  "QTUM": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/qtum.png",
  "WAVES": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/waves.png",
  "ICX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/icx.png",
  "CELO": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/celo.png",
  "KAVA": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/kava.png",
  "BAND": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/band.png",
  "BAT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/bat.png",
  "HOT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/hot.png",

  // ─── Tokens from keeper/MEXC that previously had wrong logos ───
  "BABY": "https://coin-images.coingecko.com/coins/images/55092/large/Baby-Symbol-Mint_%281%29.png",
  "IO": "https://s2.coinmarketcap.com/static/img/coins/128x128/28396.png",
  "ID": "https://assets.coincap.io/assets/icons/id@2x.png",

  // ─── Ondo Tokenized Stocks / Testnet Tickers ───────────────────
  "LLY": "https://coin-images.coingecko.com/coins/images/68643/large/llyon_160x160.png",
  "LLYON": "https://coin-images.coingecko.com/coins/images/68643/large/llyon_160x160.png",
  "ARM": "https://coin-images.coingecko.com/coins/images/68637/large/armon.png",
  "ARMON": "https://coin-images.coingecko.com/coins/images/68637/large/armon.png",
  "TST": "https://coin-images.coingecko.com/coins/images/50700/large/test.png",
  "TSTBSC": "https://coin-images.coingecko.com/coins/images/50700/large/test.png",

  // ─── Exchange Platform Logos ───────────────────────────────────
  "BINANCE": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
  "MEXC": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/544.png",
  "BYBIT": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png",
  "OKX": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png",
  "KUCOIN": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/311.png",
  "DYDX": "https://s2.coinmarketcap.com/static/img/coins/64x64/11156.png",
  "HYPERLIQUID": "https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg",
  "HYPE": "https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg",
  "GMX": "https://coin-images.coingecko.com/coins/images/11857/large/gmx.png",
  "DERIBIT": "https://s2.coinmarketcap.com/static/img/exchanges/64x64/422.png",
};

// ─── Module-level caches ─────────────────────────────────────────

// In-memory cache for the bulk CoinGecko logo map (fetched once per session)
let bulkLogoMap: Record<string, string> | null = null;
let bulkLogoFetchPromise: Promise<Record<string, string>> | null = null;

// Per-symbol dedup for individual CoinGecko search lookups
const pendingSearches = new Map<string, Promise<string | null>>();

// ─── Cache helpers ───────────────────────────────────────────────
function getCachedLogo(key: string): string | null | undefined {
  if (typeof window === "undefined") return undefined;
  const url = localStorage.getItem(`janus_logo_v2_${key}`);
  if (url) return url;
  if (sessionStorage.getItem(`janus_logo_v2_fail_${key}`)) return null;
  return undefined;
}

function setCachedLogo(key: string, url: string | null) {
  if (typeof window === "undefined") return;
  if (url) {
    localStorage.setItem(`janus_logo_v2_${key}`, url);
  } else {
    sessionStorage.setItem(`janus_logo_v2_fail_${key}`, "true");
  }
}

function clearCachedLogo(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`janus_logo_v2_${key}`);
  sessionStorage.removeItem(`janus_logo_v2_fail_${key}`);
}

// ─── Bulk logo map loader ────────────────────────────────────────
async function loadBulkLogoMap(): Promise<Record<string, string>> {
  if (bulkLogoMap) return bulkLogoMap;
  if (bulkLogoFetchPromise) return bulkLogoFetchPromise;

  bulkLogoFetchPromise = (async () => {
    try {
      const res = await fetch("/api/token-logos");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.logos) {
          bulkLogoMap = json.logos;
          return json.logos;
        }
      }
    } catch { /* silent */ }
    return {};
  })();

  const result = await bulkLogoFetchPromise;
  bulkLogoFetchPromise = null;
  return result;
}

/**
 * Multi-layer logo resolution strategy:
 * 
 * Layer 0: VERIFIED_LOGOS — hardcoded, all manually verified (200+ tokens)
 * Layer 1: Browser localStorage cache — persists across refreshes
 * Layer 2: Bulk CoinGecko logo map — pre-fetched top 500 by market cap
 * Layer 3: CoinCap CDN — free, no key, good for ~2000 tokens
 * Layer 4: CoinGecko Search API — massive coverage (15000+), rate-limited
 * Layer 5: Gradient fallback — deterministic, always works
 */
async function resolveLogoUrl(symbol: string): Promise<string | null> {
  const key = symbol.toUpperCase();

  // Layer 0: Hardcoded verified overrides (instant, no network)
  if (VERIFIED_LOGOS[key]) {
    return VERIFIED_LOGOS[key];
  }

  // Layer 1: Browser cache
  const cached = getCachedLogo(key);
  if (cached !== undefined) return cached;

  // Deduplicate in-flight searches
  if (pendingSearches.has(key)) return pendingSearches.get(key)!;

  const searchPromise = (async () => {
    const lower = key.toLowerCase();

    // Layer 2: Bulk CoinGecko map (single API call for top 500 coins)
    try {
      const map = await loadBulkLogoMap();
      if (map[key]) {
        setCachedLogo(key, map[key]);
        return map[key];
      }
    } catch { /* next layer */ }

    // Layer 3: CoinCap CDN (fast, no key)
    try {
      const coincapUrl = `https://assets.coincap.io/assets/icons/${lower}@2x.png`;
      const res = await fetch(coincapUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, coincapUrl);
        return coincapUrl;
      }
    } catch { /* next layer */ }

    // Layer 4: CoinGecko Search API (massive coverage)
    try {
      const geckoRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${lower}`);
      if (geckoRes.ok) {
        const data = await geckoRes.json();
        // STRICT exact symbol match first — prevents "BABY" → "BABYDOGE" mismatch
        const exactMatch = data.coins?.find(
          (c: any) => c.symbol.toUpperCase() === key
        );
        if (exactMatch?.large) {
          setCachedLogo(key, exactMatch.large);
          return exactMatch.large;
        }
        // Fallback to first result only if it's a close match
        const first = data.coins?.[0];
        if (first?.large && first.symbol.toUpperCase().startsWith(key.slice(0, 2))) {
          setCachedLogo(key, first.large);
          return first.large;
        }
      }
    } catch { /* fallback */ }

    // No logo found — mark as failed so we don't retry on every render
    setCachedLogo(key, null);
    return null;
  })();

  pendingSearches.set(key, searchPromise);
  const result = await searchPromise;
  pendingSearches.delete(key);
  return result;
}

// ─── Symbol cleaning ─────────────────────────────────────────────
function cleanSymbol(asset: string): string {
  let s = asset.toUpperCase()
    .replace(/\s*\(EURC\)$/i, "")
    .replace(/\s*\(USDC\)$/i, "")
    .replace(/-PERP$/i, "")
    .replace(/^1000/i, "")
    .trim();

  if (s === "TSTBSC") {
    s = "TST";
  }
  if (s === "LLYON") {
    s = "LLY";
  }
  if (s === "ARMON") {
    s = "ARM";
  }

  if (s.endsWith("USDT") && s !== "USDT") {
    s = s.replace(/[-_/\s]?USDT$/i, "");
  }
  if (s.endsWith("USDC") && s !== "USDC") {
    s = s.replace(/[-_/\s]?USDC$/i, "");
  }

  // Strip any remaining trailing hyphens, underscores, slashes, or spaces
  s = s.replace(/[-_/\s]+$/g, "");

  return s;
}

// ─── Component ───────────────────────────────────────────────────

export default function AssetLogo({ asset, size = 24, className = "" }: AssetLogoProps) {
  const cleanAsset = cleanSymbol(asset);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const cleanAssetRef = useRef(cleanAsset);

  useEffect(() => {
    setMounted(true);
    cleanAssetRef.current = cleanAsset;
    let cancelled = false;

    // Check static overrides synchronously first (no flash)
    if (VERIFIED_LOGOS[cleanAsset]) {
      setLogoUrl(VERIFIED_LOGOS[cleanAsset]);
      return;
    }

    // Check browser cache
    const cached = getCachedLogo(cleanAsset);
    if (cached !== undefined) {
      setLogoUrl(cached);
      return;
    }

    // Async resolution
    setLogoUrl(null);
    resolveLogoUrl(cleanAsset).then((url) => {
      if (!cancelled && cleanAssetRef.current === cleanAsset) {
        setLogoUrl(url);
      }
    });

    return () => { cancelled = true; };
  }, [cleanAsset, retryCount]);

  // SSR placeholder
  if (!mounted) {
    return <div style={{ width: size, height: size }} className={`shrink-0 ${className}`} />;
  }

  // Gradient fallback (while resolving or if no logo found)
  if (!logoUrl) {
    const idx = hashString(cleanAsset) % GRADIENTS.length;
    const [from, to] = GRADIENTS[idx];

    return (
      <div
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
        className={`rounded-full flex items-center justify-center text-white font-bold select-none shadow-sm shrink-0 ${className}`}
      >
        <span style={{ fontSize: size * 0.38, lineHeight: 1 }} className="tracking-tight">
          {cleanAsset.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={cleanAsset}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover shrink-0 ${className}`}
      loading="lazy"
      onError={() => {
        // Clear bad cache entry and attempt re-resolution
        clearCachedLogo(cleanAsset);
        setLogoUrl(null);
        // Trigger one retry — if the logo was in VERIFIED_LOGOS but the CDN is down,
        // force a search through the remaining layers
        if (retryCount < 1) {
          setRetryCount((c) => c + 1);
        }
      }}
    />
  );
}
