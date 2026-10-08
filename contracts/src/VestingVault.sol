// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VestingVault
 * @notice Trustless, immutable linear token vesting vault with a cliff period.
 * @dev Designed for the ELP Team allocation (100,000,000 ELP) with 3-month cliff and 12-month linear vesting.
 * 
 * Guarantees:
 * - Immutable beneficiary and schedule.
 * - Non-revocable and non-cancellable.
 * - Linear vesting calculation down to the second.
 * - No tokens can be released prior to the cliff expiration.
 */
contract VestingVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable beneficiary;
    uint256 public immutable startTimestamp;
    uint256 public immutable cliffDuration;
    uint256 public immutable vestingDuration; // Linear duration after cliff
    uint256 public immutable totalAllocation;

    uint256 public released;

    event TokensReleased(address indexed beneficiary, uint256 amount, uint256 totalReleased);

    /**
     * @param _token Address of the ERC20 token being vested (ELP).
     * @param _beneficiary Address entitled to receive vested tokens.
     * @param _startTimestamp Epoch timestamp when the vesting schedule starts.
     * @param _cliffDuration Duration in seconds of the initial cliff (e.g. 90 days = 3 months).
     * @param _vestingDuration Duration in seconds of linear vesting after cliff (e.g. 365 days = 12 months).
     * @param _totalAllocation Total amount of tokens assigned to this vault (e.g. 100M ELP).
     */
    constructor(
        address _token,
        address _beneficiary,
        uint256 _startTimestamp,
        uint256 _cliffDuration,
        uint256 _vestingDuration,
        uint256 _totalAllocation
    ) {
        require(_token != address(0), "Invalid token address");
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_vestingDuration > 0, "Vesting duration must be > 0");
        require(_totalAllocation > 0, "Allocation must be > 0");

        token = IERC20(_token);
        beneficiary = _beneficiary;
        startTimestamp = _startTimestamp;
        cliffDuration = _cliffDuration;
        vestingDuration = _vestingDuration;
        totalAllocation = _totalAllocation;
    }

    /**
     * @notice Returns timestamp when the cliff period ends.
     */
    function cliffTimestamp() public view returns (uint256) {
        return startTimestamp + cliffDuration;
    }

    /**
     * @notice Returns timestamp when all tokens are 100% vested.
     */
    function endTimestamp() public view returns (uint256) {
        return cliffTimestamp() + vestingDuration;
    }

    /**
     * @notice Calculates the total amount of tokens that have vested up to the current timestamp.
     */
    function vestedAmount() public view returns (uint256) {
        return _vestedAmountAtTimestamp(block.timestamp);
    }

    /**
     * @notice Calculates the total amount of tokens vested at a specific timestamp.
     */
    function _vestedAmountAtTimestamp(uint256 timestamp) internal view returns (uint256) {
        if (timestamp < cliffTimestamp()) {
            return 0;
        } else if (timestamp >= endTimestamp()) {
            return totalAllocation;
        } else {
            uint256 timePastCliff = timestamp - cliffTimestamp();
            return (totalAllocation * timePastCliff) / vestingDuration;
        }
    }

    /**
     * @notice Returns the amount of tokens currently available to be released.
     */
    function releasableAmount() public view returns (uint256) {
        return vestedAmount() - released;
    }

    /**
     * @notice Returns the unreleased amount of tokens remaining in the vault.
     */
    function remainingAmount() public view returns (uint256) {
        return totalAllocation - released;
    }

    /**
     * @notice Releases all currently vested and unreleased tokens to the beneficiary.
     */
    function release() external nonReentrant {
        uint256 releasable = releasableAmount();
        require(releasable > 0, "No tokens are due for release");

        released += releasable;
        token.safeTransfer(beneficiary, releasable);

        emit TokensReleased(beneficiary, releasable, released);
    }
}
