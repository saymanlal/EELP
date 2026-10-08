# ELP Smart Contracts

Production-ready, OpenZeppelin-audited Solidity smart contracts for the ELP Terminal ecosystem.

## Contract Architecture

1. **`ELPToken.sol`**: Fixed supply ERC-20 token with EIP-2612 Permit and ERC20Votes.
   - Total Supply: 1,000,000,000 $ELP (18 decimals).
   - Entire supply minted once during constructor.
   - No mint function, no pause, no blacklist, 0% tax, no owner privileges.
2. **`StakingTiers.sol`**: Utility tier access staking.
   - Free (0 ELP), Pro (10,000 ELP), Elite (100,000 ELP).
   - Cooldown unstaking flow with on-chain timelock.
   - No inflationary minting.
3. **`VestingVault.sol`**: Team token vesting vault.
   - 100,000,000 $ELP total allocation.
   - 3-Month Cliff + 12-Month Linear Vesting.
   - Non-revocable, trustless public vault.
4. **`ELPGovernor.sol`**: Decentralized signal governance.
   - OpenZeppelin Governor module with 4% quorum and ERC20Votes token wrapper.

## Testing & Compilation

```bash
# Compile contracts
forge build

# Run unit tests
forge test -vvv
```

## Deployment

```bash
export RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"
export PRIVATE_KEY="your_deployer_private_key"

forge script contracts/script/DeployELP.s.sol:DeployELP \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```
