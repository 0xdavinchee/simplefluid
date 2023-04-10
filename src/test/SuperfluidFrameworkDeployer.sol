// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { UpgradeableBeacon } from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import { TestGovernance } from "./TestGovernance.sol";
import { TestResolver } from "./TestResolver.sol";
import { SuperfluidLoader } from "../../src/utils/SuperfluidLoader.sol";
import { CFAv1Forwarder } from "../../src/utils/CFAv1Forwarder.sol";
import { SuperfluidERC1967Proxy } from "../../src/upgradability/SuperfluidERC1967Proxy.sol";
import { ISuperfluid, ISuperfluidToken, Superfluid } from "../../src/superfluid/Superfluid.sol";
import { IFlowNFTBase } from "../../src/interfaces/superfluid/IFlowNFTBase.sol";
import { AgreementBase } from "../../src/agreements/AgreementBase.sol";
import { ConstantFlowAgreementV1 } from "../../src/agreements/ConstantFlowAgreementV1.sol";
import { ConstantOutflowNFT, IConstantOutflowNFT } from "../../src/superfluid/ConstantOutflowNFT.sol";
import { ConstantInflowNFT, IConstantInflowNFT } from "../../src/superfluid/ConstantInflowNFT.sol";
import { InstantDistributionAgreementV1 } from "../../src/agreements/InstantDistributionAgreementV1.sol";
import { SuperToken, SuperTokenFactory, ERC20WithTokenInfo } from "../../src/superfluid/SuperTokenFactory.sol";
import { ISuperToken, SuperToken } from "../../src/superfluid/SuperToken.sol";
import { SETHProxy } from "../../src/tokens/SETH.sol";
import { PureSuperToken } from "../../src/tokens/PureSuperToken.sol";

/// @title Superfluid Framework Deployer
/// @author Superfluid | Modified by 0xdavinchee
/// @notice This is NOT for deploying public nets, but rather only for tesing envs
contract SuperfluidFrameworkDeployer {
    struct Framework {
        TestGovernance governance;
        Superfluid host;
        ConstantFlowAgreementV1 cfa;
        InstantDistributionAgreementV1 ida;
        SuperTokenFactory superTokenFactory;
        TestResolver resolver;
        SuperfluidLoader superfluidLoader;
        CFAv1Forwarder cfaV1Forwarder;
    }

    address public constant DEFAULT_REWARD_ADDRESS = address(69);

    TestGovernance internal testGovernance;
    Superfluid internal host;
    ConstantFlowAgreementV1 internal cfaV1;
    InstantDistributionAgreementV1 internal idaV1;
    SuperTokenFactory internal superTokenFactory;
    TestResolver internal testResolver;
    SuperfluidLoader internal superfluidLoader;
    CFAv1Forwarder internal cfaV1Forwarder;

    constructor() {
        // @note ERC1820 must be deployed for this to work

        // Deploy TestGovernance Logic Contract
        TestGovernance testGovernanceLogic = SuperfluidGovDeployerLibrary.deployTestGovernanceLogic();
        // Deploy TestGovernance Proxy (Initialize after Host is deployed)
        SuperfluidERC1967Proxy governanceProxy = new SuperfluidERC1967Proxy(
            address(testGovernanceLogic),
            ""
        );
        // Set TestGovernance
        testGovernance = TestGovernance(address(governanceProxy));

        // Deploy Superfluid Host Logic Contract
        Superfluid hostLogic = SuperfluidHostDeployerLibrary.deploySuperfluidHostLogic();
        // Deploy Superfluid Host Proxy
        SuperfluidERC1967Proxy hostProxy = new SuperfluidERC1967Proxy(
            address(hostLogic),
            abi.encodeWithSelector(
                ISuperfluid.initialize.selector,
                TestGovernance(address(governanceProxy)),
                true,
                false
            )
        );
        // Set Superfluid Host
        host = Superfluid(address(hostProxy));

        // Initialize TestGovernance (trust assumption: anyone can call initialize, should limit to owner)
        address[] memory trustedForwarders = new address[](0);
        testGovernance.initialize(host, DEFAULT_REWARD_ADDRESS, 4 hours, 30 minutes, trustedForwarders);

        // Deploy ConstantFlowAgreementV1 Logic Contract
        ConstantFlowAgreementV1 cfaV1Logic = SuperfluidCFAv1DeployerLibrary.deployConstantFlowAgreementV1();
        // Deploy ConstantFlowAgreementV1 Proxy Contract
        SuperfluidERC1967Proxy cfaV1Proxy = new SuperfluidERC1967Proxy(
            address(cfaV1Logic),
            abi.encodeWithSelector(
                AgreementBase.initialize.selector,
                host
            )
        );
        // Set ConstantFlowAgreementV1
        cfaV1 = ConstantFlowAgreementV1(address(cfaV1Proxy));
        // Register ConstantFlowAgreementV1 TestGovernance
        testGovernance.registerAgreementClass(host, address(cfaV1));

        // Deploy CFAv1Forwarder
        cfaV1Forwarder = new CFAv1Forwarder(host);
        // Enable CFAv1Forwarder as a Trusted Forwarder
        testGovernance.enableTrustedForwarder(host, ISuperfluidToken(address(0)), address(cfaV1Forwarder));

        // Deploy InstantDistributionAgreementV1 Logic Contract
        InstantDistributionAgreementV1 idaV1Logic =
            SuperfluidIDAv1DeployerLibrary.deployInstantDistributionAgreementV1();
        // Deploy InstantDistributionAgreementV1 Proxy Contract
        SuperfluidERC1967Proxy idaV1Proxy = new SuperfluidERC1967Proxy(
            address(idaV1Logic),
            abi.encodeWithSelector(
                AgreementBase.initialize.selector,
                host
            )
        );
        // Set InstantDistributionAgreementV1
        idaV1 = InstantDistributionAgreementV1(address(idaV1Proxy));
        // Register InstantDistributionAgreementV1 with Governance
        testGovernance.registerAgreementClass(host, address(idaV1));

        // Deploy canonical SuperToken logic contract
        SuperToken superTokenLogic = SuperToken(SuperTokenDeployerLibrary.deploySuperTokenLogic());
        // Deploy SuperTokenFactory logic
        SuperTokenFactory superTokenFactoryLogic = SuperfluidPeripheryDeployerLibrary.deploySuperTokenFactory();
        // Deploy SuperToken Beacon
        UpgradeableBeacon superTokenBeacon = new UpgradeableBeacon(
            address(superTokenLogic)
        );
        // Deploy SuperTokenFactory proxy
        SuperfluidERC1967Proxy superTokenFactoryProxy = new SuperfluidERC1967Proxy(
            address(superTokenFactoryLogic),
            abi.encodeWithSelector(
                SuperTokenFactory.initialize.selector,
                host,
                address(superTokenBeacon)
            )
        );
        // Set SuperTokenFactory
        superTokenFactory = SuperTokenFactory(address(superTokenFactoryProxy));

        // Deploy canonical Constant Outflow NFT logic contract
        ConstantOutflowNFT constantOutflowNFTLogic = new ConstantOutflowNFT();
        // Deploy canonical Constant Outflow NFT proxy contract
        SuperfluidERC1967Proxy constantOutflowNFTProxy = new SuperfluidERC1967Proxy(
                address(constantOutflowNFTLogic),
                abi.encodeWithSelector(
                    IFlowNFTBase.initialize.selector,
                    superTokenLogic,
                    cfaV1,
                    "Constant Outflow NFT",
                    "COF"
                )
            );
        // Set Constant Outflow NFT
        ConstantOutflowNFT constantOutflowNFT = ConstantOutflowNFT(address(constantOutflowNFTProxy));

        // Deploy canonical Constant Inflow NFT logic contract
        ConstantInflowNFT constantInflowNFTLogic = new ConstantInflowNFT();
        // // Deploy canonical Constant Outflow NFT proxy contract
        SuperfluidERC1967Proxy constantInflowNFTProxy = new SuperfluidERC1967Proxy(
                address(constantInflowNFTLogic),
                abi.encodeWithSelector(
                    IFlowNFTBase.initialize.selector,
                    superTokenLogic,
                    cfaV1,
                    "Constant Inflow NFT",
                    "CIF"
                )
            );
        ConstantInflowNFT constantInflowNFT = ConstantInflowNFT(address(constantInflowNFTProxy));

        // 'Update' code with Governance and register SuperTokenFactory with Superfluid
        testGovernance.updateContracts(
            host, address(0), new address[](0), address(superTokenFactory), address(superTokenBeacon)
        );

        superTokenLogic.initializeLogic(host, constantOutflowNFT, constantInflowNFT);

        // Deploy Resolver and grant the deployer of SuperfluidFrameworkDeployer admin privileges
        testResolver = SuperfluidPeripheryDeployerLibrary.deployTestResolver(msg.sender);

        // Deploy SuperfluidLoader
        superfluidLoader = new SuperfluidLoader(testResolver);

        // Register Governance with Resolver
        testResolver.set("TestGovernance.test", address(testGovernance));
        // Register Superfluid with Resolver
        testResolver.set("Superfluid.test", address(host));
        // Register SuperfluidLoader with Resolver
        testResolver.set("SuperfluidLoader-v1", address(superfluidLoader));
        // Register CFAv1Forwarder with Resolver
        testResolver.set("CFAv1Forwarder.test", address(cfaV1Forwarder));
        // Register SuperTokenFactory with Resolver
        testResolver.set("SuperTokenFactory.test", address(superTokenFactory));
        // Register SuperTokenLogic with Resolver
        testResolver.set("SuperTokenLogic.test", address(superTokenLogic));
        // Register SuperTokenBeacon with Resolver
        testResolver.set("SuperTokenBeacon.test", address(superTokenBeacon));
        // Register ConstantOutflowNFT with Resolver
        testResolver.set("ConstantOutflowNFT.test", address(constantOutflowNFT));
        // Register ConstantInflowNFT with Resolver
        testResolver.set("ConstantInflowNFT.test", address(constantInflowNFT));
    }

    /// @notice Fetches the framework contracts
    function getFramework() external view returns (Framework memory sf) {
        sf = Framework({
            governance: testGovernance,
            host: host,
            cfa: cfaV1,
            ida: idaV1,
            superTokenFactory: superTokenFactory,
            resolver: testResolver,
            superfluidLoader: superfluidLoader,
            cfaV1Forwarder: cfaV1Forwarder
        });
        return sf;
    }

    /// @notice Transfer ownership of the TestGovernance contract
    /// @dev This function allows you to transfer ownership of TestGovernance when testing
    /// @param newOwner the new owner of the TestGovernance contract
    function transferOwnership(address newOwner) public {
        testGovernance.transferOwnership(newOwner);
    }
}

/**
 *
 * External Libraries
 *
 */

/// @title SuperfluidGovDeployerLibrary
/// @author Superfluid
/// @notice An external library that deploys the Superfluid TestGovernance contract with additional functions
/// @dev This library is used for testing purposes only, not deployments to test OR production networks
library SuperfluidGovDeployerLibrary {
    /// @notice deploys the Superfluid TestGovernance Logic Contract
    /// @return newly deployed TestGovernance Logic Contract
    function deployTestGovernanceLogic() external returns (TestGovernance) {
        return new TestGovernance();
    }

    /// @notice transfers ownership of _gov to _newOwner
    /// @dev _gov must be deployed from this contract
    /// @param _gov address of the TestGovernance contract
    /// @param _newOwner the new owner of the governance contract
    function transferOwnership(TestGovernance _gov, address _newOwner) external {
        _gov.transferOwnership(_newOwner);
    }
}

/// @title SuperfluidHostDeployerLibrary
/// @author Superfluid
/// @notice An external library that deploys the Superfluid Host Logic contract with additional functions.
/// @dev This library is used for testing purposes only, not deployments to test OR production networks
library SuperfluidHostDeployerLibrary {
    /// @notice Deploys the Superfluid Host Logic Contract
    /// @return Superfluid newly deployed Superfluid Host Logic contract
    function deploySuperfluidHostLogic() external returns (Superfluid) {
        return new Superfluid();
    }
}

/// @title SuperfluidIDAv1DeployerLibrary
/// @author Superfluid
/// @notice An external library that deploys the Superfluid InstantDistributionAgreementV1 contract.
/// @dev This library is used for testing purposes only, not deployments to test OR production networks
library SuperfluidIDAv1DeployerLibrary {
    /// @notice deploys the Superfluid InstantDistributionAgreementV1 Contract
    /// @return newly deployed InstantDistributionAgreementV1 contract
    function deployInstantDistributionAgreementV1() external returns (InstantDistributionAgreementV1) {
        return new InstantDistributionAgreementV1();
    }
}

/// @title SuperfluidCFAv1DeployerLibrary
/// @author Superfluid
/// @notice An external library that deploys Superfluid ConstantFlowAgreementV1 contract
/// @dev This library is used for testing purposes only, not deployments to test OR production networks
library SuperfluidCFAv1DeployerLibrary {
    /// @notice deploys ConstantFlowAgreementV1 contract
    /// @return newly deployed ConstantFlowAgreementV1 contract
    function deployConstantFlowAgreementV1() external returns (ConstantFlowAgreementV1) {
        return new ConstantFlowAgreementV1();
    }
}

/// @title SuperToken deployer library
/// @author Superfluid
/// @notice This is an external library used to deploy SuperToken logic contracts
library SuperTokenDeployerLibrary {
    /// @notice Deploy a SuperToken logic contract
    function deploySuperTokenLogic() external returns (address) {
        return address(new SuperToken());
    }
}

/// @title SuperfluidPeripheryDeployerLibrary
/// @author Superfluid
/// @notice An external library that deploys Superfluid periphery contracts (Super Token Factory and Test Resolver)
/// @dev This library is used for testing purposes only, not deployments to test OR production networks
library SuperfluidPeripheryDeployerLibrary {
    /// @dev deploys Super Token Factory contract
    /// @return newly deployed SuperTokenFactory contract
    function deploySuperTokenFactory() external returns (SuperTokenFactory) {
        return new SuperTokenFactory();
    }

    /// @dev deploys Test Resolver contract
    /// @param _additionalAdmin address of the additional administrator of the Test Resolver contract
    /// @return newly deployed Test Resolver contract
    function deployTestResolver(address _additionalAdmin) external returns (TestResolver) {
        return new TestResolver(_additionalAdmin);
    }
}
