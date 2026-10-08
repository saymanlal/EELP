import { http, createConfig } from "wagmi";
import {
  mainnet,
  arbitrum,
  arbitrumSepolia,
  base,
  bsc,
  polygon,
  optimism,
} from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [
    arbitrumSepolia,
    mainnet,
    arbitrum,
    base,
    bsc,
    polygon,
    optimism,
  ],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc"
    ),
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_ETHEREUM_RPC || "https://eth.llamarpc.com"
    ),
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc"
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
    ),
    [bsc.id]: http(
      process.env.NEXT_PUBLIC_BSC_RPC || "https://bsc-dataseed.binance.org"
    ),
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"
    ),
    [optimism.id]: http(
      process.env.NEXT_PUBLIC_OPTIMISM_RPC || "https://mainnet.optimism.io"
    ),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
