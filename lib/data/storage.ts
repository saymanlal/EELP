export interface WatchedToken {
  address: string;
  chain: string;
  name: string;
  symbol: string;
  addedAt: number;
  lastPriceUsd?: number;
  lastIntelligenceScore?: number;
  riskRating?: string;
  notes?: string;
}

export interface WatchedWallet {
  address: string;
  chain: string;
  label: string;
  addedAt: number;
  observedPattern: "Accumulation" | "Distribution" | "DEX Trader" | "Cluster Node" | "Deployer" | "Whale";
  notes?: string;
}

const TOKEN_WATCHLIST_KEY = "elp_token_watchlist_v1";
const WALLET_WATCHLIST_KEY = "elp_wallet_watchlist_v1";

export function getWatchedTokens(): WatchedToken[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TOKEN_WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWatchedToken(token: WatchedToken): void {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchedTokens().filter(
      (t) => !(t.address.toLowerCase() === token.address.toLowerCase() && t.chain === token.chain)
    );
    current.unshift(token);
    localStorage.setItem(TOKEN_WATCHLIST_KEY, JSON.stringify(current));
  } catch (e) {
    console.error("Failed to save watched token", e);
  }
}

export function removeWatchedToken(address: string, chain: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchedTokens().filter(
      (t) => !(t.address.toLowerCase() === address.toLowerCase() && t.chain === chain)
    );
    localStorage.setItem(TOKEN_WATCHLIST_KEY, JSON.stringify(current));
  } catch (e) {
    console.error("Failed to remove watched token", e);
  }
}

export function isTokenWatched(address: string, chain: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getWatchedTokens();
  return current.some(
    (t) => t.address.toLowerCase() === address.toLowerCase() && t.chain === chain
  );
}

export function getWatchedWallets(): WatchedWallet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WALLET_WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWatchedWallet(wallet: WatchedWallet): void {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchedWallets().filter(
      (w) => !(w.address.toLowerCase() === wallet.address.toLowerCase() && w.chain === wallet.chain)
    );
    current.unshift(wallet);
    localStorage.setItem(WALLET_WATCHLIST_KEY, JSON.stringify(current));
  } catch (e) {
    console.error("Failed to save watched wallet", e);
  }
}

export function removeWatchedWallet(address: string, chain: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchedWallets().filter(
      (w) => !(w.address.toLowerCase() === address.toLowerCase() && w.chain === chain)
    );
    localStorage.setItem(WALLET_WATCHLIST_KEY, JSON.stringify(current));
  } catch (e) {
    console.error("Failed to remove watched wallet", e);
  }
}
