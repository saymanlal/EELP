// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {ELPToken} from "../src/ELPToken.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

contract ELPTokenTest is Test {
    ELPToken public token;
    address public deployer;
    address public alice;
    address public bob;
    uint256 internal alicePrivateKey;
    uint256 internal bobPrivateKey;

    uint256 public constant EXPECTED_TOTAL_SUPPLY = 1_000_000_000 * 1e18;

    bytes32 private constant PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    function setUp() public {
        deployer = address(this);
        alicePrivateKey = 0xA11CE;
        bobPrivateKey = 0xB0B;
        alice = vm.addr(alicePrivateKey);
        bob = vm.addr(bobPrivateKey);

        token = new ELPToken(deployer);
    }

    // 1. Basic Metadata & Supply Tests
    function test_MetadataAndFixedSupply() public view {
        assertEq(token.name(), "ELP Token");
        assertEq(token.symbol(), "ELP");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), EXPECTED_TOTAL_SUPPLY);
        assertEq(token.balanceOf(deployer), EXPECTED_TOTAL_SUPPLY);
    }

    function test_ConstructorZeroAddressReverts() public {
        vm.expectRevert("Invalid initial recipient");
        new ELPToken(address(0));
    }

    // 2. Transfer & Allowances
    function test_Transfers() public {
        uint256 transferAmount = 10_000 * 1e18;
        token.transfer(alice, transferAmount);

        assertEq(token.balanceOf(alice), transferAmount);
        assertEq(token.balanceOf(deployer), EXPECTED_TOTAL_SUPPLY - transferAmount);

        // Alice transfers to Bob
        vm.prank(alice);
        token.transfer(bob, 2_000 * 1e18);

        assertEq(token.balanceOf(alice), 8_000 * 1e18);
        assertEq(token.balanceOf(bob), 2_000 * 1e18);
    }

    function test_TransferFromAndApprove() public {
        uint256 approveAmount = 50_000 * 1e18;
        token.approve(alice, approveAmount);
        assertEq(token.allowance(deployer, alice), approveAmount);

        vm.prank(alice);
        token.transferFrom(deployer, bob, 20_000 * 1e18);

        assertEq(token.balanceOf(bob), 20_000 * 1e18);
        assertEq(token.allowance(deployer, alice), 30_000 * 1e18);
    }

    function test_TransferExceedsBalanceReverts() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientBalance.selector,
                alice,
                0,
                1000 * 1e18
            )
        );
        token.transfer(bob, 1000 * 1e18);
    }

    // 3. EIP-2612 Permit Tests
    function test_PermitValidSignature() public {
        uint256 value = 5_000 * 1e18;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 nonce = token.nonces(alice);

        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, alice, bob, value, nonce, deadline)
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, digest);

        token.permit(alice, bob, value, deadline, v, r, s);

        assertEq(token.allowance(alice, bob), value);
        assertEq(token.nonces(alice), nonce + 1);
    }

    function test_PermitExpiredReverts() public {
        uint256 value = 5_000 * 1e18;
        uint256 deadline = block.timestamp - 1; // Expired
        uint256 nonce = token.nonces(alice);

        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, alice, bob, value, nonce, deadline)
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, digest);

        vm.expectRevert();
        token.permit(alice, bob, value, deadline, v, r, s);
    }

    function test_PermitInvalidSignerReverts() public {
        uint256 value = 5_000 * 1e18;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 nonce = token.nonces(alice);

        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, alice, bob, value, nonce, deadline)
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );

        // Signed by Bob instead of Alice
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(bobPrivateKey, digest);

        vm.expectRevert();
        token.permit(alice, bob, value, deadline, v, r, s);
    }

    // 4. ERC20Votes & Delegation Tests
    function test_DelegationAndVotingPower() public {
        uint256 amount = 100_000 * 1e18;
        token.transfer(alice, amount);

        // Before delegation, voting power is 0
        assertEq(token.getVotes(alice), 0);

        // Alice self-delegates
        vm.prank(alice);
        token.delegate(alice);
        assertEq(token.getVotes(alice), amount);
        assertEq(token.numCheckpoints(alice), 1);

        // Alice transfers some tokens to Bob
        vm.prank(alice);
        token.transfer(bob, 30_000 * 1e18);

        assertEq(token.getVotes(alice), 70_000 * 1e18);
        assertEq(token.numCheckpoints(alice), 2);

        // Bob delegates to Alice
        vm.prank(bob);
        token.delegate(alice);
        assertEq(token.getVotes(alice), 100_000 * 1e18);
    }

    function test_PastVotesCheckpoints() public {
        uint256 amount = 50_000 * 1e18;
        token.transfer(alice, amount);

        vm.prank(alice);
        token.delegate(alice);

        uint256 block1 = block.number;
        vm.roll(block1 + 10);

        token.transfer(alice, amount);

        uint256 block2 = block.number;
        vm.roll(block2 + 10);

        assertEq(token.getPastVotes(alice, block1), amount);
        assertEq(token.getPastVotes(alice, block2), amount * 2);
    }

    // 5. Privilege & Supply Immutability Invariant
    function test_NoSupplyModificationOrPrivilegedTax() public {
        // Total supply must remain exactly 1 billion regardless of transfers
        token.transfer(alice, 500_000 * 1e18);
        vm.prank(alice);
        token.transfer(bob, 250_000 * 1e18);

        assertEq(token.totalSupply(), EXPECTED_TOTAL_SUPPLY);
    }
}
