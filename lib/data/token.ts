import { getPublicClient } from "./rpc";
import { TokenMetadata } from "./types";
import { getChainBySlug } from "@/lib/chains";
import ERC20Abi from "@/abi/ERC20.json";
import { formatUnits } from "viem";

export async function fetchTokenOnChain(
  chainSlug: string,
  tokenAddress: string
): Promise<TokenMetadata | null> {
  const chainConfig = getChainBySlug(chainSlug);
  if (!tokenAddress || !tokenAddress.startsWith("0x") || tokenAddress.length !== 42) {
    return null;
  }

  const client = getPublicClient(chainSlug);
  const target = tokenAddress as `0x${string}`;

  try {
    // Read contract code to verify contract existence
    const bytecode = await client.getBytecode({ address: target });
    if (!bytecode || bytecode === "0x") {
      return null;
    }

    // Parallel calls for standard ERC20 methods
    const [nameRes, symbolRes, decimalsRes, totalSupplyRes] = await Promise.allSettled([
      client.readContract({
        address: target,
        abi: ERC20Abi,
        functionName: "name",
      }),
      client.readContract({
        address: target,
        abi: ERC20Abi,
        functionName: "symbol",
      }),
      client.readContract({
        address: target,
        abi: ERC20Abi,
        functionName: "decimals",
      }),
      client.readContract({
        address: target,
        abi: ERC20Abi,
        functionName: "totalSupply",
      }),
    ]);

    const name = nameRes.status === "fulfilled" ? (nameRes.value as string) : "Unknown Token";
    const symbol = symbolRes.status === "fulfilled" ? (symbolRes.value as string) : "UNKNOWN";
    const decimals = decimalsRes.status === "fulfilled" ? Number(decimalsRes.value) : 18;
    const totalSupplyBigInt =
      totalSupplyRes.status === "fulfilled" ? (totalSupplyRes.value as bigint) : 0n;

    const totalSupplyFormatted = formatUnits(totalSupplyBigInt, decimals);

    // Check for owner() if present
    let ownerAddress: string | undefined = undefined;
    try {
      const ownerRes = await client.readContract({
        address: target,
        abi: ERC20Abi,
        functionName: "owner",
      });
      if (ownerRes && typeof ownerRes === "string") {
        ownerAddress = ownerRes;
      }
    } catch {
      // owner() not present or reverted
    }

    // Heuristic bytecode analysis for proxy, mint, pause, blacklist
    const hex = bytecode.toLowerCase();
    const isProxy =
      hex.includes("360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc") || // EIP-1967 implementation slot
      hex.includes("5c60da1b") || // implementation()
      hex.includes("upgradeTo");

    const canMint = hex.includes("40c10f19") || hex.includes("mint("); // mint(address,uint256) selector is 0x40c10f19
    const canPause = hex.includes("8456cb59") || hex.includes("pause()"); // pause() selector is 0x8456cb59
    const hasBlacklist = hex.includes("blacklist") || hex.includes("isBlacklisted") || hex.includes("freeze");

    return {
      address: target,
      name,
      symbol,
      decimals,
      totalSupply: totalSupplyBigInt.toString(),
      totalSupplyFormatted,
      chainSlug,
      chainId: chainConfig.id,
      ownerAddress,
      isProxy,
      canMint,
      canPause,
      hasBlacklist,
      transferTaxPercent: 0,
    };
  } catch (error) {
    console.error("fetchTokenOnChain error:", error);
    return null;
  }
}
