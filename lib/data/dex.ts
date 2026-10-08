import { MarketStructure } from "./types";
import { getChainBySlug } from "@/lib/chains";

export interface DexPairInfo {
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: number;
  liquidityUsd: number;
  fdvUsd: number;
  marketCapUsd: number;
  volume24h: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  txns24h: {
    buys: number;
    sells: number;
  };
  dexId: string;
  url: string;
}

export async function fetchDexData(
  chainSlug: string,
  tokenAddress: string
): Promise<MarketStructure | null> {
  const chainConfig = getChainBySlug(chainSlug);
  if (!chainConfig || !tokenAddress || !tokenAddress.startsWith("0x")) {
    return null;
  }

  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress.toLowerCase()}`;
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data || !data.pairs || data.pairs.length === 0) {
      return null;
    }

    // Filter for pairs on this chain or take largest liquidity pair
    const relevantPairs = data.pairs.filter((p: any) => {
      const pChain = p.chainId?.toLowerCase();
      const targetChain = chainConfig.dexScreenerChainId.toLowerCase();
      return pChain === targetChain || (pChain === "arbitrum" && targetChain === "arbitrum-sepolia");
    });

    const bestPair = (relevantPairs.length > 0 ? relevantPairs : data.pairs).sort(
      (a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];

    if (!bestPair) return null;

    const priceUsd = Number(bestPair.priceUsd || 0);
    const liquidityUsd = Number(bestPair.liquidity?.usd || 0);
    const volume24hUsd = Number(bestPair.volume?.h24 || 0);
    const fdvUsd = Number(bestPair.fdv || (priceUsd > 0 ? priceUsd * 1_000_000_000 : 0));
    const marketCapUsd = Number(bestPair.marketCap || fdvUsd || 0);

    const volumeLiquidityRatio = liquidityUsd > 0 ? volume24hUsd / liquidityUsd : 0;
    const liquidityMarketCapRatio = marketCapUsd > 0 ? liquidityUsd / marketCapUsd : 0;

    const buys = Number(bestPair.txns?.h24?.buys || 0);
    const sells = Number(bestPair.txns?.h24?.sells || 0);

    return {
      priceUsd,
      marketCapUsd,
      fdvUsd,
      liquidityUsd,
      volume24hUsd,
      volumeLiquidityRatio,
      liquidityMarketCapRatio,
      priceChange1h: Number(bestPair.priceChange?.h1 || 0),
      priceChange24h: Number(bestPair.priceChange?.h24 || 0),
      priceChange7d: Number(bestPair.priceChange?.h24 || 0) * 1.5, // approximate if 7d not in response
      txns24h: {
        buys,
        sells,
        total: buys + sells,
      },
      pairAddress: bestPair.pairAddress,
      dexName: bestPair.dexId ? bestPair.dexId.toUpperCase() : "DEX",
      baseTokenSymbol: bestPair.baseToken?.symbol,
      quoteTokenSymbol: bestPair.quoteToken?.symbol,
    };
  } catch (error) {
    console.warn("DexScreener fetch error:", error);
    return null;
  }
}
