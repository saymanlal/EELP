# EELP Terminal

### Crypto Market Intelligence & On-Chain Forensics Platform

EELP is a modern, Web3-native crypto market intelligence and on-chain forensic analysis platform built to turn raw blockchain activity into understandable market intelligence.

Native utility token: **$EELP** (Launched separately via Siren Launchpad).

---

## Key Capabilities

1. **Crypto X-Ray:** Comprehensive on-chain token diagnostic assessing ownership concentration, bytecode privileges, liquidity depth, and holder quality.
2. **What Changed? Engine:** Daily on-chain diffs tracking top holder accumulation shifts and liquidity adjustments.
3. **Wallet Relationship Graph & Clusters:** Visual topology mapping behaviorally linked wallet groups with shared funding origins and synchronized execution.
4. **Flow Divergence Radar:** Automated detection when market pricing moves in opposition to underlying balance sheet activity.
5. **Behavioral Fingerprinting:** Analytical entropy profiles measuring accumulation velocity, distribution frequency, and trading intensity.
6. **7-Vector Risk Radar:** Objective audit of bytecode privileges, concentration, and anomaly severity.

---

## Zero-Cost Multi-Chain Architecture

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS + Wagmi v2 + Viem + TanStack Query + Lucide Icons.
- **Hosting:** Deployable directly to **Vercel's Free Tier** with zero server state or database requirements.
- **Chains:** Arbitrum Sepolia (`421614`), Arbitrum One (`42161`), Ethereum (`1`), Base (`8453`), BNB Chain (`56`), Polygon (`137`), Optimism (`10`).
- **Smart Contracts:** Solidity 0.8.24 + OpenZeppelin 5.0 + Foundry tests.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Smart Contracts (Foundry)

```bash
cd contracts

# Build contracts
forge build

# Run test suite
forge test -vvv
```

---

## Vercel Deployment

1. Push your repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Framework preset: **Next.js**.
4. Set required Environment Variables from `.env.example`:
   ```env
   NEXT_PUBLIC_CHAIN_ID=421614
   NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   NEXT_PUBLIC_EXPLORER_URL=https://sepolia.arbiscan.io
   NEXT_PUBLIC_EELP_TOKEN_ADDRESS=
   NEXT_PUBLIC_STAKING_ADDRESS=
   NEXT_PUBLIC_VESTING_ADDRESS=
   NEXT_PUBLIC_GOVERNOR_ADDRESS=
   NEXT_PUBLIC_FAUCET_URL=https://faucets.chain.link/arbitrum-sepolia
   ```
5. Deploy.
