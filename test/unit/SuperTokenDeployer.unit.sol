// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import { SuperTokenV1Library } from "../../src/apps/SuperTokenV1Library.sol";
import { SimplefluidFoundryTester, SuperToken } from "../utils/SimplefluidFoundryTester.sol";

contract SuperTokenDeployerUnitTest is SimplefluidFoundryTester {
    using SuperTokenV1Library for SuperToken;

    function setUp() public override {
        super.setUp();
    }

    function testPassingDeployWrapperSuperToken() public {
        assertEq(_wrapperSuperToken.getUnderlyingToken(), address(_wrapperToken));
    }
}
