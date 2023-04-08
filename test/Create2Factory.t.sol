// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Test.sol";

import {Create2Factory} from "../src/Create2Factory.sol";
import {BoringToken} from "../src/BoringToken.sol";
import {FactoryComputeLibrary} from "../src/libraries/FactoryComputeLibrary.sol";

/// @title Create2FactoryTest
/// @author 0xdavinchee
contract Create2FactoryTest is Test {
    Create2Factory public factory;

    function setUp() external {
        factory = new Create2Factory();
    }

    function helper_DeployToken(string memory name_, string memory symbol_, uint8 decimals_)
        internal
        returns (address token)
    {
        token = factory.deployToken(name_, symbol_, decimals_);
    }

    function test_Passing_DeployToken(string memory name_, string memory symbol_, uint8 decimals_) public {
        address token = helper_DeployToken(name_, symbol_, decimals_);
        assertTrue(token != address(0));
        assertEq(BoringToken(token).name(), name_, "name not equal");
        assertEq(BoringToken(token).symbol(), symbol_, "symbol not equal");
        assertEq(BoringToken(token).decimals(), decimals_, "decimals not equal");
        console.logBytes(type(BoringToken).creationCode);
    }

    function test_Passing_DeployToken_Is_Retrievable(string memory name_, string memory symbol_, uint8 decimals_)
        public
    {
        address token = helper_DeployToken(name_, symbol_, decimals_);

        address computedToken = FactoryComputeLibrary.computeTokenAddress(
            address(factory), FactoryComputeLibrary.TokenInfo(name_, symbol_, decimals_)
        );
        assertEq(token, computedToken, "computed token not equal");
    }
}
