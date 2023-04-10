// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

import { SuperTokenV1Library } from "../../src/apps/SuperTokenV1Library.sol";
import { SuperfluidFrameworkDeployer } from "../../src/test/SuperfluidFrameworkDeployer.sol";
import { SuperToken, SuperTokenDeployer, TestToken } from "../../src/test/SuperTokenDeployer.sol";

contract SimplefluidFoundryTester is Test {
    using SuperTokenV1Library for SuperToken;

    uint256 internal constant _TOTAL_SUPPLY = 100_000_000 ether;
    SuperfluidFrameworkDeployer internal _deployer;
    SuperTokenDeployer internal _superTokenDeployer;
    SuperfluidFrameworkDeployer.Framework internal _framework;
    SuperToken internal _wrapperSuperToken;
    TestToken internal _wrapperToken;

    function setUp() public virtual {
        _deployer = new SuperfluidFrameworkDeployer();
        _framework = _deployer.getFramework();
        _superTokenDeployer = new SuperTokenDeployer(_framework);
        (_wrapperToken, _wrapperSuperToken) =
            _superTokenDeployer.deployWrapperSuperToken("Test Super Token", "TST", 18, _TOTAL_SUPPLY);

        _wrapperSuperToken.warmUp();
    }
}
