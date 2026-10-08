import { createPublicClient, http, type PublicClient } from "viem";
import { getChainBySlug, SUPPORTED_CHAINS } from "@/lib/chains";

const clientsCache: Record<string, PublicClient> = {};

export function getPublicClient(chainSlug: string): PublicClient {
  const chainConfig = getChainBySlug(chainSlug);
  const cacheKey = `${chainConfig.id}`;

  if (clientsCache[cacheKey]) {
    return clientsCache[cacheKey];
  }

  const client = createPublicClient({
    chain: chainConfig.viemChain,
    transport: http(chainConfig.rpcUrl, {
      retryCount: 3,
      retryDelay: 1000,
    }),
  });

  clientsCache[cacheKey] = client;
  return client;
}
