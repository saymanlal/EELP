// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {EELPToken} from "../src/EELPToken.sol";
import {StakingTiers} from "../src/StakingTiers.sol";
import {VestingVault} from "../src/VestingVault.sol";
import {EELPGovernor} from "../src/EELPGovernor.sol";

contract StakingAndVestingTest is Test {
    EELPToken public token;
    StakingTiers public staking;
    VestingVault public vault;
    EELPGovernor public governor;

    address public deployer;
    address public alice;
    address public teamMember;

    uint256 public constant COOLDOWN = 7 days;
    uint256 public constant TEAM_ALLOCATION = 100_000_000 * 1e18;
    uint256 public constant CLIFF_DURATION = 90 days; // 3 months
    uint256 public constant VESTING_DURATION = 365 days; // 12 months linear

    function setUp() public {
        deployer = address(this);
        alice = makeAddr("alice");
        teamMember = makeAddr("teamMember");

        // Deploy Token
        token = new EELPToken(deployer);

        // Deploy Staking
        staking = new StakingTiers(address(token), COOLDOWN);

        // Deploy VestingVault
        uint256 startTime = block.timestamp;
        vault = new VestingVault(
            address(token),
            teamMember,
            startTime,
            CLIFF_DURATION,
            VESTING_DURATION,
            TEAM_ALLOCATION
        );

        // Fund VestingVault with 100M EELP
        token.transfer(address(vault), TEAM_ALLOCATION);

        // Deploy Governor
        governor = new EELPGovernor(
            token,
            7200, // voting delay (~1 day)
            36000, // voting period (~5 days)
            100_000 * 1e18, // proposal threshold
            4 // 4% quorum
        );

        // Fund Alice with tokens for testing
        token.transfer(alice, 200_000 * 1e18);
    }

    // ==================== STAKING TESTS ====================

    function test_InitialTiersAreFree() public view {
        assertEq(uint256(staking.getTier(alice)), uint256(StakingTiers.Tier.FREE));
        assertEq(staking.stakedBalance(alice), 0);
        assertEq(staking.totalStaked(), 0);
    }

    function test_StakingTiersProgression() public {
        vm.startPrank(alice);
        token.approve(address(staking), type(uint256).max);

        // 1. Stake 5,000 -> Still FREE (<10,000)
        staking.stake(5_000 * 1e18);
        assertEq(staking.stakedBalance(alice), 5_000 * 1e18);
        assertEq(uint256(staking.getTier(alice)), uint256(StakingTiers.Tier.FREE));

        // 2. Stake additional 5,000 -> Total 10,000 -> PRO
        staking.stake(5_000 * 1e18);
        assertEq(staking.stakedBalance(alice), 10_000 * 1e18);
        assertEq(uint256(staking.getTier(alice)), uint256(StakingTiers.Tier.PRO));

        // 3. Stake additional 90,000 -> Total 100,000 -> ELITE
        staking.stake(90_000 * 1e18);
        assertEq(staking.stakedBalance(alice), 100_000 * 1e18);
        assertEq(uint256(staking.getTier(alice)), uint256(StakingTiers.Tier.ELITE));
        assertEq(staking.totalStaked(), 100_000 * 1e18);
        vm.stopPrank();
    }

    function test_StakingZeroReverts() public {
        vm.prank(alice);
        vm.expectRevert("Cannot stake 0");
        staking.stake(0);
    }

    function test_UnstakingCooldownAndWithdraw() public {
        vm.startPrank(alice);
        token.approve(address(staking), 50_000 * 1e18);
        staking.stake(50_000 * 1e18);

        // Request unstake of 20,000
        staking.requestUnstake(20_000 * 1e18);
        assertEq(staking.stakedBalance(alice), 30_000 * 1e18);
        assertEq(staking.getUnstakeRequestsCount(alice), 1);

        (uint256 reqAmount, uint256 unlockTime, bool claimed) = staking.getUnstakeRequest(alice, 0);
        assertEq(reqAmount, 20_000 * 1e18);
        assertEq(unlockTime, block.timestamp + COOLDOWN);
        assertFalse(claimed);

        // Attempt immediate withdraw -> should revert
        vm.expectRevert("Cooldown period active");
        staking.withdraw(0);

        // Fast forward past cooldown
        vm.warp(unlockTime);

        uint256 aliceBalBefore = token.balanceOf(alice);
        staking.withdraw(0);
        uint256 aliceBalAfter = token.balanceOf(alice);

        assertEq(aliceBalAfter - aliceBalBefore, 20_000 * 1e18);

        // Withdrawing again should revert
        vm.expectRevert("Already withdrawn");
        staking.withdraw(0);
        vm.stopPrank();
    }

    function test_CancelUnstakeRestoresStake() public {
        vm.startPrank(alice);
        token.approve(address(staking), 50_000 * 1e18);
        staking.stake(50_000 * 1e18);

        staking.requestUnstake(20_000 * 1e18);
        assertEq(staking.stakedBalance(alice), 30_000 * 1e18);

        // Cancel the unstake request
        staking.cancelUnstake(0);
        assertEq(staking.stakedBalance(alice), 50_000 * 1e18);
        assertEq(staking.totalStaked(), 50_000 * 1e18);

        // Can't withdraw cancelled request
        vm.warp(block.timestamp + COOLDOWN + 1);
        vm.expectRevert("Already withdrawn");
        staking.withdraw(0);
        vm.stopPrank();
    }

    // ==================== VESTING TESTS ====================

    function test_VestingParameters() public view {
        assertEq(vault.beneficiary(), teamMember);
        assertEq(vault.totalAllocation(), TEAM_ALLOCATION);
        assertEq(vault.cliffDuration(), CLIFF_DURATION);
        assertEq(vault.vestingDuration(), VESTING_DURATION);
    }

    function test_VestingBeforeCliffYieldsZero() public {
        // Jump to 89 days (1 day before cliff)
        vm.warp(vault.startTimestamp() + 89 days);
        assertEq(vault.vestedAmount(), 0);
        assertEq(vault.releasableAmount(), 0);

        vm.prank(teamMember);
        vm.expectRevert("No tokens are due for release");
        vault.release();
    }

    function test_VestingLinearProgressAndRelease() public {
        // Warp to cliff + 6 months (50% through linear period)
        uint256 halfway = vault.cliffTimestamp() + (VESTING_DURATION / 2);
        vm.warp(halfway);

        uint256 expectedVested = TEAM_ALLOCATION / 2;
        assertEq(vault.vestedAmount(), expectedVested);
        assertEq(vault.releasableAmount(), expectedVested);

        // Release partial tokens
        vault.release();
        assertEq(token.balanceOf(teamMember), expectedVested);
        assertEq(vault.released(), expectedVested);
        assertEq(vault.releasableAmount(), 0);

        // Warp to end of vesting
        vm.warp(vault.endTimestamp() + 10 days);
        assertEq(vault.vestedAmount(), TEAM_ALLOCATION);
        assertEq(vault.releasableAmount(), TEAM_ALLOCATION - expectedVested);

        // Release remainder
        vault.release();
        assertEq(token.balanceOf(teamMember), TEAM_ALLOCATION);
        assertEq(vault.remainingAmount(), 0);
    }

    // ==================== GOVERNOR TESTS ====================

    function test_GovernorParameters() public view {
        assertEq(governor.name(), "EELP Governor");
        assertEq(governor.votingDelay(), 7200);
        assertEq(governor.votingPeriod(), 36000);
        assertEq(governor.proposalThreshold(), 100_000 * 1e18);
    }
}
