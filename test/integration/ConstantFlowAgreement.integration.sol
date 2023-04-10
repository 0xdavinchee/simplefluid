// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import { SuperTokenV1Library } from "../../src/apps/SuperTokenV1Library.sol";
import { SimplefluidFoundryTester, SuperToken } from "../SimplefluidFoundryTester.sol";

contract ConstantFlowAgreementIntegration is SimplefluidFoundryTester {
    using SuperTokenV1Library for SuperToken;

    function setUp() public override {
        super.setUp();
        _wrapperToken.mint(address(1), 100 ether);
        vm.startPrank(address(1));
        _wrapperToken.approve(address(_wrapperSuperToken), 50 ether);
        _wrapperSuperToken.upgrade(50 ether);
        vm.stopPrank();
    }

    function test_Create_Flow() public {
        vm.prank(address(1));
        _wrapperSuperToken.createFlow(address(2), 69_420, new bytes(0));
    }
}
