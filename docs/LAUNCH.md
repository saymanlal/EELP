# ELP Terminal Deployment & Launch Guide

This guide details how to deploy the ELP smart contracts on **Arbitrum Sepolia** (and switch to **Arbitrum One** mainnet) and deploy the frontend to **Vercel's Free Tier**.

---

## 1. Environment Parameters

### Arbitrum Sepolia (Initial Testnet)
- **Chain ID:** `421614`
- **RPC URL:** `https://sepolia-rollup.arbitrum.io/rpc`
- **Explorer:** `https://sepolia.arbiscan.io`
- **Native Currency:** `ETH`

### Arbitrum One (Mainnet)
- **Chain ID:** `42161`
- **RPC URL:** `https://arb1.arbitrum.io/rpc`
- **Explorer:** `https://arbiscan.io`

---

## 2. Smart Contract Deployment (Foundry)

1. Set your deployment environment variables in your terminal (NEVER commit these to Git):
   ```bash
   export RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"
   export PRIVATE_KEY="0x..." # Deployer private key
   export ETHERSCAN_API_KEY="your_arbiscan_api_key"
   ```

2. Run the deployment script:
   ```bash
   forge script contracts/script/DeployELP.s.sol:DeployELP \
     --rpc-url $RPC_URL \
     --private-key $PRIVATE_KEY \
     --broadcast \
     --verify
   ```

3. Note down the deployed contract addresses:
   - `ELPToken`
   - `StakingTiers`
   - `VestingVault`
   - `ELPGovernor`

---

## 3. Frontend Deployment on Vercel

1. Push the repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete ELP Terminal platform"
   git push origin main
   ```

2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository `elp`.
4. Configure Framework Preset: **Next.js**.
5. Add Environment Variables in **Project Settings → Environment Variables**:
   ```env
   NEXT_PUBLIC_CHAIN_ID=421614
   NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   NEXT_PUBLIC_EXPLORER_URL=https://sepolia.arbiscan.io
   NEXT_PUBLIC_ELP_TOKEN_ADDRESS=0x...
   NEXT_PUBLIC_STAKING_ADDRESS=0x...
   NEXT_PUBLIC_VESTING_ADDRESS=0x...
   NEXT_PUBLIC_GOVERNOR_ADDRESS=0x...
   NEXT_PUBLIC_FAUCET_URL=https://faucets.chain.link/arbitrum-sepolia
   ```
6. Click **Deploy**.
