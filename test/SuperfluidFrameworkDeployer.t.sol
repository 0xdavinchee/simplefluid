// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

import { ISuperToken } from "../src/interfaces/superfluid/ISuperToken.sol";
import { ISuperTokenFactory } from "../src/interfaces/superfluid/ISuperTokenFactory.sol";
import { SuperfluidFrameworkDeployer } from "../src/utils/SuperfluidFrameworkDeployer.sol";

contract SuperfluidFrameworkDeployerTest is Test {
    SuperfluidFrameworkDeployer internal _deployer;

    function setUp() public {
        _deployer = new SuperfluidFrameworkDeployer();
    }

    function test_Passing_All_Contracts_Deployed() public {
        SuperfluidFrameworkDeployer.Framework memory framework = _deployer.getFramework();
        assert(address(framework.governance) != address(0));
        assert(address(framework.cfa) != address(0));
        assert(address(framework.ida) != address(0));
        assert(address(framework.host) != address(0));
        assert(address(framework.superTokenFactory) != address(0));
        assert(address(framework.resolver) != address(0));
        assert(address(framework.superfluidLoader) != address(0));
        assert(address(framework.cfaV1Forwarder) != address(0));
    }

    function test_Resolver_Set_Contracts() public {
        SuperfluidFrameworkDeployer.Framework memory framework = _deployer.getFramework();
        assertEq(
            framework.resolver.get("TestGovernance.test"), address(framework.governance), "SuperfluidGovernance unset"
        );
        assertEq(framework.resolver.get("Superfluid.test"), address(framework.host), "SuperfluidHost unset");
        assertEq(
            framework.resolver.get("SuperfluidLoader-v1"), address(framework.superfluidLoader), "SuperfluidLoader unset"
        );
        assertEq(
            framework.resolver.get("CFAv1Forwarder.test"),
            address(framework.cfaV1Forwarder),
            "SuperfluidCFAV1Forwarder unset"
        );
        assertEq(
            framework.resolver.get("SuperTokenFactory.test"),
            address(framework.superTokenFactory),
            "SuperTokenFactory unset"
        );

        address superTokenFactoryLogic = framework.host.getSuperTokenFactoryLogic();
        ISuperTokenFactory superTokenFactory = ISuperTokenFactory(superTokenFactoryLogic);
        ISuperToken superTokenLogic = superTokenFactory.getSuperTokenLogic();
        assertEq(framework.resolver.get("SuperTokenLogic.test"), address(superTokenLogic), "SuperTokenLogic unset");
        assertEq(
            framework.resolver.get("SuperTokenBeacon.test"),
            address(superTokenFactory.getSuperTokenBeacon()),
            "SuperTokenBeacon unset"
        );
        assertEq(
            framework.resolver.get("ConstantOutflowNFT.test"),
            address(superTokenLogic.constantOutflowNFT()),
            "ConstantOutflowNFT unset"
        );
        assertEq(
            framework.resolver.get("ConstantInflowNFT.test"),
            address(superTokenLogic.constantInflowNFT()),
            "ConstantInflowNFT unset"
        );
    }
}
