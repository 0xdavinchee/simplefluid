// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import {WETH9} from "../../src/WETH9.sol";
import {ForcePush} from "../attack/ForcePush.sol";
import "../libs/AddressesSetLibrary.sol";

/// @title WETH9Handler
/// @author 0xdavinchee
/// @notice A Handler Contract for Invariant Testing
/// @dev Note: As soon as we introduce a handler, we are introducing assumptions about the system under test.
contract WETH9Handler is Test {
    using LibAddressSet for AddressSet;

    AddressSet internal _actors;
    address internal currentActor;

    uint256 public constant ETH_SUPPLY = 120_500_000 ether;

    WETH9 public weth;

    uint256 public ghost_depositSum;
    uint256 public ghost_withdrawSum;
    uint256 public ghost_forcePushSum;
    uint256 public ghost_zeroWithdrawalsCount;
    uint256 public ghost_zeroApprovalCount;

    mapping(bytes32 => uint256) public calls;

    constructor(WETH9 _weth) {
        weth = _weth;
        deal(address(this), ETH_SUPPLY);
    }

    /**
     * Handler Functions
     */
    function deposit(uint256 amount) public createActor countCall("deposit") {
        amount = bound(amount, 0, address(this).balance);

        _pay(currentActor, amount);
        vm.prank(currentActor);
        weth.deposit{value: amount}();

        ghost_depositSum += amount;
    }

    function withdraw(uint256 actorSeed, uint256 amount) public useActor(actorSeed) countCall("withdraw") {
        amount = bound(amount, 0, weth.balanceOf(currentActor));

        if (amount == 0) ghost_zeroWithdrawalsCount++;

        vm.startPrank(currentActor);
        weth.withdraw(amount);
        _pay(address(this), amount);
        vm.stopPrank();

        ghost_withdrawSum += amount;
    }

    function sendFallback(uint256 amount) public createActor countCall("sendFallback") {
        amount = bound(amount, 0, address(this).balance);

        _pay(currentActor, amount);
        vm.prank(currentActor);
        (bool success,) = address(weth).call{value: amount}("");
        require(success, "sendFallback failed");

        ghost_depositSum += amount;
    }

    receive() external payable {}

    function approve(uint256 actorSeed, uint256 spenderSeed, uint256 amount)
        public
        useActor(actorSeed)
        countCall("approve")
    {
        address spender = _actors.rand(spenderSeed);

        vm.prank(currentActor);
        weth.approve(spender, amount);
    }

    function transfer(uint256 actorSeed, uint256 toSeed, uint256 amount)
        public
        useActor(actorSeed)
        countCall("transfer")
    {
        address to = _actors.rand(toSeed);

        amount = bound(amount, 0, weth.balanceOf(currentActor));

        vm.prank(currentActor);
        weth.transfer(to, amount);
    }

    function transferFrom(uint256 actorSeed, uint256 fromSeed, uint256 toSeed, bool approve, uint256 amount)
        public
        useActor(actorSeed)
        countCall("transferFrom")
    {
        address from = _actors.rand(fromSeed);
        address to = _actors.rand(toSeed);

        amount = bound(amount, 0, weth.balanceOf(from));

        if (weth.allowance(from, to) == 0) ghost_zeroApprovalCount++;

        if (approve) {
            vm.prank(from);
            weth.approve(currentActor, amount);
        } else {
            amount = bound(amount, 0, weth.allowance(currentActor, from));
        }

        vm.prank(currentActor);
        weth.transferFrom(from, to, amount);
    }

    function _pay(address to, uint256 amount) internal {
        (bool s,) = to.call{value: amount}("");
        require(s, "pay() failed");
    }

    /**
     * Attack
     */
    function forcePush(uint256 amount) public countCall("forcePush") {
        amount = bound(amount, 0, address(this).balance);
        new ForcePush{ value: amount }(address(weth));
        ghost_forcePushSum += amount;
    }

    /**
     * Actor Management
     */
    function actors() external view returns (address[] memory) {
        return _actors.addrs;
    }

    function forEachActor(function(address) external func) public {
        return _actors.forEach(func);
    }

    function reduceActors(uint256 acc, function(uint256, address) external returns (uint256) func)
        public
        returns (uint256)
    {
        return _actors.reduce(acc, func);
    }

    modifier createActor() {
        currentActor = msg.sender;
        _actors.add(currentActor);
        _;
    }

    modifier useActor(uint256 actorIndexSeed) {
        currentActor = _actors.rand(actorIndexSeed);
        _;
    }

    /**
     * Call Summary
     */

    function callSummary() external view {
        console.log("Call summary:");
        console.log("-------------------");
        console.log("deposit", calls["deposit"]);
        console.log("withdraw", calls["withdraw"]);
        console.log("sendFallback", calls["sendFallback"]);
        console.log("approve", calls["approve"]);
        console.log("transfer", calls["transfer"]);
        console.log("transferFrom", calls["transferFrom"]);

        console.log("Zero withdrawals:", ghost_zeroWithdrawalsCount);
        console.log("Zero approvals:", ghost_zeroApprovalCount);
    }

    modifier countCall(bytes32 key) {
        calls[key]++;
        _;
    }
}
