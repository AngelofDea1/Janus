"use client";

import React, { useState, useEffect } from "react";

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

// ─── Module-level cache (persists across renders & components) ───
const pendingFetches = new Map<string, Promise<string | null>>();

function getCachedLogo(key: string): string | null | undefined {
  if (typeof window === "undefined") return undefined;
  const url = localStorage.getItem(`janus_logo_${key}`);
  if (url) return url;
  if (sessionStorage.getItem(`janus_logo_fail_${key}`)) return null;
  return undefined;
}

function setCachedLogo(key: string, url: string | null) {
  if (typeof window === "undefined") return;
  if (url) {
    localStorage.setItem(`janus_logo_${key}`, url);
  } else {
    sessionStorage.setItem(`janus_logo_fail_${key}`, "true");
  }
}

/**
 * Multi-layer logo resolution strategy:
 * 1. CoinCap CDN        — free, no key, good coverage (~2000 tokens)
 * 2. Atomiclabs CDN     — free, no key, major tokens (~400)
 * 3. CoinGecko Search   — free (30 req/min), massive coverage (15000+)
 * 4. Gradient fallback   — deterministic, always works
 */
// Verified static brand logo overrides to guarantee 100% professional accuracy and prevent CDN or Search API mismatches
const STATIC_OVERRIDES: Record<string, string> = {
  "USDC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/usdc.png",
  "USDT": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/usdt.png",
  "BTC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/btc.png",
  "ETH": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/eth.png",
  "SOL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/sol.png",
  "BNB": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/bnb.png",
  "ARB": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/arb.png",
  "OP": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/op.png",
  "MATIC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/matic.png",
  "POL": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/matic.png",
  "AVAX": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/avax.png",
  "LINK": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/link.png",
  "UNI": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/uni.png",
  "LDO": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/ldo.png",
  "AAVE": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/aave.png"
};

async function resolveLogoUrl(symbol: string): Promise<string | null> {
  const key = symbol.toUpperCase();

  // 1. Guaranteed verified static brand overrides
  if (STATIC_OVERRIDES[key]) {
    return STATIC_OVERRIDES[key];
  }

  // Check cache
  const cached = getCachedLogo(key);
  if (cached !== undefined) return cached;

  // Deduplicate in-flight fetches
  if (pendingFetches.has(key)) return pendingFetches.get(key)!;

  const fetchPromise = (async () => {
    const lower = key.toLowerCase();

    // Layer 1: CoinCap CDN (fastest, no API key)
    try {
      const coincapUrl = `https://assets.coincap.io/assets/icons/${lower}@2x.png`;
      const res = await fetch(coincapUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, coincapUrl);
        return coincapUrl;
      }
    } catch { /* next layer */ }

    // Layer 2: Atomiclabs CDN (SVGs, major tokens)
    try {
      const atomicUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${lower}.svg`;
      const res = await fetch(atomicUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, atomicUrl);
        return atomicUrl;
      }
    } catch { /* next layer */ }

    // Layer 3: LogoKit CDN (Fast, simple, covers thousands of tokens)
    try {
      const logokitUrl = `https://img.logokit.com/token/${key}`;
      const res = await fetch(logokitUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, logokitUrl);
        return logokitUrl;
      }
    } catch { /* next layer */ }

    // Layer 4: Gate.io CDN (Excellent exchange-hosted coverage)
    try {
      const gateUrl = `https://www.gate.io/images/coin_icon/64/${lower}.png`;
      const res = await fetch(gateUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, gateUrl);
        return gateUrl;
      }
    } catch { /* next layer */ }

    // Layer 5: KuCoin CDN (Exchange-hosted coverage by standard symbol)
    try {
      const kucoinUrl = `https://assets.kucoin.com/www/coin/pc/${key}.png`;
      const res = await fetch(kucoinUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, kucoinUrl);
        return kucoinUrl;
      }
    } catch { /* next layer */ }

    // Layer 6: CryptoIcons GitHub CDN (Vibrant community SVGs)
    try {
      const cryptoiconsUrl = `https://cdn.jsdelivr.net/gh/Cryptofonts/cryptoicons@master/svg/color/${lower}.svg`;
      const res = await fetch(cryptoiconsUrl, { method: "HEAD" });
      if (res.ok) {
        setCachedLogo(key, cryptoiconsUrl);
        return cryptoiconsUrl;
      }
    } catch { /* next layer */ }

    // Layer 7: CoinGecko search API (huge live coverage, rate-limited)
    let geckoId: string | null = null;
    try {
      const searchRes = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(lower)}`
      );
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data.coins?.length > 0) {
          const exactMatch = data.coins.find(
            (c: any) => c.symbol?.toUpperCase() === key
          );
          const coin = exactMatch || data.coins[0];
          geckoId = coin.id;
          const imgUrl = coin.large || coin.thumb;
          if (imgUrl && !imgUrl.includes("missing_")) {
            setCachedLogo(key, imgUrl);
            return imgUrl;
          }
        }
      }
    } catch { /* next layer */ }

    // Layer 8: Simplr Coin-Logos CDN (Powered by CoinGecko ID - over 16,000 logos)
    if (geckoId) {
      try {
        const simplrUrl = `https://cdn.jsdelivr.net/gh/simplr-sh/coin-logos/images/${geckoId}/128.png`;
        const res = await fetch(simplrUrl, { method: "HEAD" });
        if (res.ok) {
          setCachedLogo(key, simplrUrl);
          return simplrUrl;
        }
      } catch { /* fallback */ }
    }

    // No logo found anywhere in 8 layers
    setCachedLogo(key, null);
    return null;
  })();

  pendingFetches.set(key, fetchPromise);
  const result = await fetchPromise;
  pendingFetches.delete(key);
  return result;
}

// ─── Component ───────────────────────────────────────────────────

export default function AssetLogo({ asset, size = 24, className = "" }: AssetLogoProps) {
  // Strip common exchange suffixes and prefixes to ensure clean symbol matching
  let cleanAsset = asset.toUpperCase()
    .replace(/-PERP$/i, "")
    .replace(/^1000/i, "");

  if (cleanAsset.endsWith("USDT") && cleanAsset !== "USDT") {
    cleanAsset = cleanAsset.replace(/_?USDT$/i, "");
  }
  if (cleanAsset.endsWith("USDC") && cleanAsset !== "USDC") {
    cleanAsset = cleanAsset.replace(/_?USDC$/i, "");
  }

  
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    const cached = getCachedLogo(cleanAsset);
    return cached === undefined ? null : cached;
  });
  
  const [resolved, setResolved] = useState<boolean>(() => {
    return getCachedLogo(cleanAsset) !== undefined;
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    if (!resolved) {
      resolveLogoUrl(cleanAsset).then((url) => {
        if (!cancelled) {
          setLogoUrl(url);
          setResolved(true);
        }
      });
    }

    return () => { cancelled = true; };
  }, [cleanAsset, resolved]);

  // Suppress hydration mismatch by returning a placeholder matching SSR size before mount if needed,
  // but for logos, we just render it directly to prevent flash.
  if (!mounted && typeof window === "undefined") {
     // SSR render a blank spacer to match client dimensions
     return <div style={{ width: size, height: size }} className={`shrink-0 ${className}`} />;
  }

  // While resolving or if no logo found, show gradient fallback
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
      onError={() => {
        // If the cached URL breaks, clear cache and fall back to gradient
        setCachedLogo(cleanAsset, null);
        setLogoUrl(null);
      }}
    />
  );
}
