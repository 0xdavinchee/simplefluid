// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {WETH9} from "../src/WETH9.sol";
import {WETH9Handler} from "./handlers/WETH9.handler.sol";

contract WETH9Invariants is Test {
    WETH9 public weth;
    WETH9Handler public handler;

    function setUp() public {
        weth = new WETH9();
        handler = new WETH9Handler(weth);

        bytes4[] memory selectors = new bytes4[](7);
        selectors[0] = WETH9Handler.deposit.selector;
        selectors[1] = WETH9Handler.withdraw.selector;
        selectors[2] = WETH9Handler.sendFallback.selector;
        selectors[3] = WETH9Handler.approve.selector;
        selectors[4] = WETH9Handler.transfer.selector;
        selectors[5] = WETH9Handler.transferFrom.selector;
        selectors[6] = WETH9Handler.forcePush.selector;

        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));

        targetContract(address(handler));
    }

    /**
     * Global Invariants
     */

    // ETH can only be wrapped into WETH, WETH can only
    // be unwrapped back into ETH. The sum of the Handler's
    // ETH balance plus the WETH totalSupply() should always
    // equal the total ETH_SUPPLY.
    function invariant_Conservation_Of_ETH() public {
        assertEq(handler.ETH_SUPPLY(), address(handler).balance + weth.totalSupply());
    }

    // The WETH contract's Ether balance should always
    // equal the sum of all the individual deposits
    // minus all the individual withdrawals
    function invariant_Solvency_Deposit() public {
        assertEq(
            address(weth).balance,
            handler.ghost_depositSum() + handler.ghost_forcePushSum() - handler.ghost_withdrawSum()
        );
    }

    // The WETH contract's Ether balance should always be
    // at least as much as the sum of individual balances
    function invariant_Solvency_Balances() public {
        uint256 sumOfBalances = handler.reduceActors(0, this.accumulateBalance);
        assertEq(address(weth).balance - handler.ghost_forcePushSum(), sumOfBalances);
    }

    function accumulateBalance(uint256 balance, address caller) external view returns (uint256) {
        return balance + weth.balanceOf(caller);
    }

    /**
     * Account Invariants
     */

    // No individual account balance can exceed the
    // WETH totalSupply().
    function invariant_Depositor_Balances() public {
        handler.forEachActor(this.assert_Account_Balance_Lte_Total_Supply);
    }

    function assert_Account_Balance_Lte_Total_Supply(address account) external {
        assertLe(weth.balanceOf(account), weth.totalSupply());
    }

    function invariant_Call_Summary() public view {
        handler.callSummary();
    }
}
