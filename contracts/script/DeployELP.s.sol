// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {EELPToken} from "../src/EELPToken.sol";
import {StakingTiers} from "../src/StakingTiers.sol";
import {VestingVault} from "../src/VestingVault.sol";
import {EELPGovernor} from "../src/EELPGovernor.sol";

/**
 * @title DeployELP
 * @notice Automated deployment script for the EELP Terminal ecosystem.
 * 
 * Usage:
 * forge script contracts/script/DeployELP.s.sol:DeployELP \
 *   --rpc-url $RPC_URL \
 *   --private-key $PRIVATE_KEY \
 *   --broadcast \
 *   --verify
 */
contract DeployELP is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying EELP contracts with deployer:", deployer);
        console.log("Target Chain ID:", block.chainid);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy EELPToken (Mints fixed 1 Billion supply to deployer)
        EELPToken elpToken = new EELPToken(deployer);
        console.log("EELPToken deployed to:", address(elpToken));

        // 2. Deploy StakingTiers (7-day cooldown = 604800 seconds)
        uint256 cooldownDuration = 7 days;
        StakingTiers staking = new StakingTiers(address(elpToken), cooldownDuration);
        console.log("StakingTiers deployed to:", address(staking));

        // 3. Deploy Team VestingVault (100M EELP, 3-mo cliff, 12-mo linear)
        uint256 startTime = block.timestamp;
        uint256 cliffDuration = 90 days;
        uint256 vestingDuration = 365 days;
        uint256 teamAllocation = 100_000_000 * 10 ** 18;

        VestingVault vesting = new VestingVault(
            address(elpToken),
            deployer, // Initial beneficiary (or multisig)
            startTime,
            cliffDuration,
            vestingDuration,
            teamAllocation
        );
        console.log("VestingVault deployed to:", address(vesting));

        // Fund VestingVault with 100M EELP
        elpToken.transfer(address(vesting), teamAllocation);
        console.log("Funded VestingVault with 100,000,000 EELP");

        // 4. Deploy EELPGovernor for signal voting
        uint48 votingDelay = 7200; // ~1 day on Arbitrum
        uint32 votingPeriod = 36000; // ~5 days
        uint256 proposalThreshold = 100_000 * 10 ** 18; // Elite tier
        uint256 quorumPercentage = 4; // 4%

        EELPGovernor governor = new EELPGovernor(
            elpToken,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage
        );
        console.log("EELPGovernor deployed to:", address(governor));

        vm.stopBroadcast();

        console.log("-----------------------------------------");
        console.log("DEPLOYMENT COMPLETE. UPDATE YOUR .env:");
        console.log("NEXT_PUBLIC_EELP_TOKEN_ADDRESS=", address(elpToken));
        console.log("NEXT_PUBLIC_STAKING_ADDRESS=", address(staking));
        console.log("NEXT_PUBLIC_VESTING_ADDRESS=", address(vesting));
        console.log("NEXT_PUBLIC_GOVERNOR_ADDRESS=", address(governor));
        console.log("-----------------------------------------");
    }
}
