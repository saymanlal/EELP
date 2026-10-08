// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @title EELPGovernor
 * @notice On-chain signal voting system for the EELP Terminal ecosystem.
 * @dev Powered by OpenZeppelin Governor and ERC20Votes for transparent community signaling.
 * 
 * Parameters:
 * - Voting Delay: 1 day (7200 blocks / ~7200 slots on Arbitrum)
 * - Voting Period: 5 days (~36000 blocks / slots)
 * - Proposal Threshold: 100,000 EELP (Elite tier)
 * - Quorum: 4% of total voting power
 */
contract EELPGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    /**
     * @param _token The EELPToken contract address implementing IVotes.
     * @param _initialVotingDelay Initial voting delay in timepoints/blocks (e.g. 7200).
     * @param _initialVotingPeriod Initial voting period in timepoints/blocks (e.g. 36000).
     * @param _initialProposalThreshold Initial minimum votes required to create a proposal (e.g. 100,000 * 10^18).
     * @param _quorumPercentage Percentage of total voting supply needed for quorum (e.g. 4 = 4%).
     */
    constructor(
        IVotes _token,
        uint48 _initialVotingDelay,
        uint32 _initialVotingPeriod,
        uint256 _initialProposalThreshold,
        uint256 _quorumPercentage
    )
        Governor("EELP Governor")
        GovernorSettings(
            _initialVotingDelay,
            _initialVotingPeriod,
            _initialProposalThreshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
