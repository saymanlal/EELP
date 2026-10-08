// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title EELPToken
 * @notice Native utility token for the EELP Terminal ecosystem.
 * @dev Fixed supply ERC20 token with EIP-2612 Permit and ERC-5805 / ERC-6372 Votes support.
 * 
 * Invariants & Security Guarantees:
 * - Total fixed supply: 1,000,000,000 EELP (1 billion tokens with 18 decimals) minted once at deployment.
 * - No additional minting capability.
 * - No burning capability outside of standard zero-address transfers.
 * - No pause, blacklist, whitelist, or freeze mechanisms.
 * - No transaction taxes, buy/sell fees, or transfer deductions.
 * - No owner, admin, or privileged monetary controls.
 * - Fully decentralized, standard ERC-20 + Permit + Votes token.
 */
contract EELPToken is ERC20, ERC20Permit, ERC20Votes {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    /**
     * @notice Deploys the EELP token and mints the entire fixed supply to the initial recipient.
     * @param initialRecipient Address receiving the initial token allocation for distribution / vaults.
     */
    constructor(address initialRecipient)
        ERC20("EELP Token", "EELP")
        ERC20Permit("EELP Token")
    {
        require(initialRecipient != address(0), "Invalid initial recipient");
        _mint(initialRecipient, TOTAL_SUPPLY);
    }

    // Required overrides for ERC20Votes and ERC20Permit

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
