// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StakingTiers
 * @notice Allows ELP token holders to stake ELP to qualify for ecosystem access tiers.
 * @dev Staking does NOT mint tokens. Unstaking enforces a transparent on-chain cooldown.
 *
 * Tier Structure:
 * - FREE: 0 ELP
 * - PRO: 10,000 ELP
 * - ELITE: 100,000 ELP
 */
contract StakingTiers is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Tier {
        FREE,
        PRO,
        ELITE
    }

    struct UnstakeRequest {
        uint256 amount;
        uint256 unlockTime;
        bool claimed;
    }

    IERC20 public immutable elpToken;
    uint256 public constant PRO_THRESHOLD = 10_000 * 10 ** 18;
    uint256 public constant ELITE_THRESHOLD = 100_000 * 10 ** 18;

    // Cooldown duration (e.g. 7 days for production / testnet default)
    uint256 public immutable cooldownDuration;

    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalance;
    mapping(address => UnstakeRequest[]) private _unstakeRequests;

    event Staked(address indexed user, uint256 amount, uint256 newTotalStake);
    event UnstakeRequested(
        address indexed user,
        uint256 indexed requestIndex,
        uint256 amount,
        uint256 unlockTime
    );
    event UnstakeWithdrawn(
        address indexed user,
        uint256 indexed requestIndex,
        uint256 amount
    );
    event UnstakeCancelled(
        address indexed user,
        uint256 indexed requestIndex,
        uint256 amount
    );

    /**
     * @param _elpToken Address of the ELP ERC20 token.
     * @param _cooldownDuration Cooldown period in seconds before unstaked tokens can be withdrawn (e.g. 7 days).
     */
    constructor(address _elpToken, uint256 _cooldownDuration) {
        require(_elpToken != address(0), "Invalid token address");
        elpToken = IERC20(_elpToken);
        cooldownDuration = _cooldownDuration;
    }

    /**
     * @notice Stakes a specified amount of ELP tokens.
     * @param amount The amount of ELP tokens to stake (in wei).
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");

        stakedBalance[msg.sender] += amount;
        totalStaked += amount;

        elpToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, stakedBalance[msg.sender]);
    }

    /**
     * @notice Initiates an unstake request with a mandatory cooldown period.
     * @param amount The amount of ELP tokens to unstake.
     */
    function requestUnstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot unstake 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;

        uint256 unlockTime = block.timestamp + cooldownDuration;
        _unstakeRequests[msg.sender].push(
            UnstakeRequest({
                amount: amount,
                unlockTime: unlockTime,
                claimed: false
            })
        );

        uint256 requestIndex = _unstakeRequests[msg.sender].length - 1;
        emit UnstakeRequested(msg.sender, requestIndex, amount, unlockTime);
    }

    /**
     * @notice Withdraws tokens from a completed unstake request once the cooldown has elapsed.
     * @param requestIndex The index of the unstake request.
     */
    function withdraw(uint256 requestIndex) external nonReentrant {
        require(
            requestIndex < _unstakeRequests[msg.sender].length,
            "Invalid request index"
        );
        UnstakeRequest storage req = _unstakeRequests[msg.sender][requestIndex];
        require(!req.claimed, "Already withdrawn");
        require(block.timestamp >= req.unlockTime, "Cooldown period active");

        req.claimed = true;
        elpToken.safeTransfer(msg.sender, req.amount);

        emit UnstakeWithdrawn(msg.sender, requestIndex, req.amount);
    }

    /**
     * @notice Cancels a pending unstake request and returns the tokens back into the active stake.
     * @param requestIndex The index of the pending unstake request.
     */
    function cancelUnstake(uint256 requestIndex) external nonReentrant {
        require(
            requestIndex < _unstakeRequests[msg.sender].length,
            "Invalid request index"
        );
        UnstakeRequest storage req = _unstakeRequests[msg.sender][requestIndex];
        require(!req.claimed, "Already processed");

        req.claimed = true;
        stakedBalance[msg.sender] += req.amount;
        totalStaked += req.amount;

        emit UnstakeCancelled(msg.sender, requestIndex, req.amount);
    }

    /**
     * @notice Returns the user's current ecosystem tier.
     * @param user The address of the user.
     */
    function getTier(address user) external view returns (Tier) {
        uint256 balance = stakedBalance[user];
        if (balance >= ELITE_THRESHOLD) {
            return Tier.ELITE;
        } else if (balance >= PRO_THRESHOLD) {
            return Tier.PRO;
        }
        return Tier.FREE;
    }

    /**
     * @notice Returns the count of unstake requests for a user.
     */
    function getUnstakeRequestsCount(address user)
        external
        view
        returns (uint256)
    {
        return _unstakeRequests[user].length;
    }

    /**
     * @notice Returns a specific unstake request for a user.
     */
    function getUnstakeRequest(address user, uint256 index)
        external
        view
        returns (
            uint256 amount,
            uint256 unlockTime,
            bool claimed
        )
    {
        require(index < _unstakeRequests[user].length, "Index out of bounds");
        UnstakeRequest memory req = _unstakeRequests[user][index];
        return (req.amount, req.unlockTime, req.claimed);
    }

    /**
     * @notice Returns all unstake requests for a user.
     */
    function getUserUnstakeRequests(address user)
        external
        view
        returns (UnstakeRequest[] memory)
    {
        return _unstakeRequests[user];
    }
}
