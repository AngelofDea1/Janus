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

// Custom overrides for obscure tokens used by the keeper or live simulation data to prevent mismatches
const KEEPER_OVERRIDES: Record<string, string> = {
  "IO": "https://assets.coincap.io/assets/icons/io@2x.png",
  "ID": "https://assets.coincap.io/assets/icons/id@2x.png",
  "FLNC": "https://assets.coincap.io/assets/icons/flnc@2x.png",
  "MAGMA": "https://assets.coincap.io/assets/icons/magma@2x.png",
  "ESPORTS": "https://assets.coincap.io/assets/icons/esports@2x.png",
  "GTC": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/gtc.png",
  "DODO": "https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/color/dodo.png",
};

async function resolveLogoUrl(symbol: string): Promise<string | null> {
  const key = symbol.toUpperCase();

  // 1. Guaranteed verified static brand overrides
  if (STATIC_OVERRIDES[key]) {
    return STATIC_OVERRIDES[key];
  }
  
  if (KEEPER_OVERRIDES[key]) {
    return KEEPER_OVERRIDES[key];
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
    } catch { /* fallback */ }

    // Layer 3: CoinGecko Search API (Massive coverage, cached to prevent rate limits)
    try {
      const geckoRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${lower}`);
      if (geckoRes.ok) {
        const data = await geckoRes.json();
        // Find exact symbol match first, or take the first result
        const coin = data.coins?.find((c: any) => c.symbol.toLowerCase() === lower) || data.coins?.[0];
        if (coin?.large) {
          setCachedLogo(key, coin.large);
          return coin.large;
        }
      }
    } catch { /* fallback */ }

    // For any other token, fall back immediately to clean deterministic gradients
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
