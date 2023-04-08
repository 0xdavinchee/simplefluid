// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "../src/Custom.sol";

contract CustomTest is Test {
    function test_V1_Deploy() public {
        CustomLogicV1 logic = new CustomLogicV1();
        CustomProxyV1 proxy = new CustomProxyV1(address(logic));
        CustomLogicV1(payable(proxy)).initialize(address(this));
        CustomLogicV1 leProxy = CustomLogicV1(payable(proxy));
        assertEq(leProxy.owner(), address(this));
    }

    function test_V2_Deploy() public {
        CustomLogicV2 logic = new CustomLogicV2();
        CustomProxyV2 proxy =
            new CustomProxyV2(address(logic), abi.encodeWithSelector(CustomLogicV2.initialize.selector, address(this)));
        CustomLogicV2 leProxy = CustomLogicV2(payable(proxy));
        assertEq(leProxy.owner(), address(this));
    }
}
