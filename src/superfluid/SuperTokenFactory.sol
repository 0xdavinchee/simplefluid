// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IBeacon } from "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import { BeaconProxy } from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import { SuperfluidERC1967Proxy } from "../upgradability/SuperfluidERC1967Proxy.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {
    ISuperTokenFactory,
    ISuperToken,
    IERC20,
    ERC20WithTokenInfo
} from "../interfaces/superfluid/ISuperTokenFactory.sol";
import { ISuperfluid } from "../interfaces/superfluid/ISuperfluid.sol";
import { SuperToken } from "../superfluid/SuperToken.sol";
import { ConstantOutflowNFT, IConstantOutflowNFT } from "../superfluid/ConstantOutflowNFT.sol";
import { ConstantInflowNFT, IConstantInflowNFT } from "../superfluid/ConstantInflowNFT.sol";

/// @title SuperTokenFactory
/// @author Superfluid | Modified by 0xdavinchee
contract SuperTokenFactory is Initializable, UUPSUpgradeable, ISuperTokenFactory {
    struct InitializeData {
        address underlyingToken;
        address superToken;
    }

    /* WARNING: NEVER RE-ORDER VARIABLES! Including the base contracts.
        Always double-check that new
        variables are added APPEND-ONLY. Re-ordering variables can
        permanently BREAK the deployed proxy contract. */

    IBeacon internal _superTokenBeacon;

    ISuperfluid internal _host;
    // @dev This is the old SuperToken logic contract that is no longer used
    // It is kept here for backwards compatibility due to the fact that we cannot
    // change the storage layout of the contract
    ISuperToken internal _superTokenLogicDeprecated;

    /// @notice A mapping from underlying token addresses to canonical wrapper super token addresses
    /// @dev Reasoning: (1) provide backwards compatibility for existing listed wrapper super tokens
    /// @dev (2) prevent address retrieval issues if we ever choose to modify the bytecode of the UUPSProxy contract
    /// @dev NOTE: address(0) key points to the NativeAssetSuperToken on the network.
    mapping(address => address) internal _canonicalWrapperSuperTokens;

    /// NOTE: Whenever modifying the storage layout here it is important to update the validateStorageLayout
    /// function in its respective mock contract to ensure that it doesn't break anything or lead to unexpected
    /// behaviors/layout when upgrading

    error SUPER_TOKEN_FACTORY_ONLY_GOVERNANCE_OWNER();

    /// @inheritdoc ISuperTokenFactory
    function getHost() external view override(ISuperTokenFactory) returns (address host) {
        return address(_host);
    }

    /**
     *
     * UUPSUpgradeable
     *
     */
    function getSuperTokenBeacon() external view returns (address) {
        return address(_superTokenBeacon);
    }

    /// @inheritdoc ISuperTokenFactory
    function initialize(ISuperfluid host_, IBeacon superTokenBeacon_)
        external
        initializer // OpenZeppelin Initializable
    // solhint-disable-next-line no-empty-blocks
    {
        _host = host_;

        // SuperToken logic is now deployed prior to new factory logic deployment
        // and passed in as a parameter to SuperTokenFactory constructor
        _superTokenBeacon = superTokenBeacon_;

        // UUPSProxiable(address(superTokenBeacon_)).castrate();

        // emit SuperTokenLogicCreated event
        // note that creation here means the setting of the super token logic contract
        // as the canonical super token logic for the Superfluid framework and not the
        // actual contract creation
        emit SuperTokenLogicCreated(ISuperToken(superTokenBeacon_.implementation()));
    }

    function _authorizeUpgrade(address)
        // newImplementation
        internal
        view
        override
    {
        if (msg.sender != address(_host)) revert SUPER_TOKEN_FACTORY_ONLY_HOST();
    }

    function proxiableUUID() public pure override returns (bytes32) {
        return keccak256("org.superfluid-finance.contracts.SuperTokenFactory.implementation");
    }

    // @note this is the pattern of using UUPSProxiable, we are removing this and using a new pattern
    // /// @notice Updates the logic contract for the SuperTokenFactory
    // /// @dev This function updates the logic contract for the SuperTokenFactory
    // /// @param newSuperTokenFactoryLogic_ the new address of the SuperTokenFactory logic contract
    // /// @param newSuperTokenBeacon_ the new address of the SuperToken logic contract
    // function updateCode(address newSuperTokenFactoryLogic_, IBeacon newSuperTokenBeacon_) external {
    //     if (msg.sender != address(_host)) {
    //         revert SUPER_TOKEN_FACTORY_ONLY_HOST();
    //     }
    //     // @note newSuperTokenBeacon_ should basically never change over time
    //     bytes memory data = abi.encodeWithSelector(ISuperTokenFactory.initialize.selector, _host,
    // newSuperTokenBeacon_);
    //     _upgradeToAndCallUUPS(newSuperTokenFactoryLogic_, data, true);
    // }

    /**
     *
     * ISuperTokenFactory
     *
     */
    /// @inheritdoc ISuperTokenFactory
    function getSuperTokenLogic() external view override returns (ISuperToken) {
        return ISuperToken(_superTokenBeacon.implementation());
    }

    /// @inheritdoc ISuperTokenFactory
    function createCanonicalERC20Wrapper(ERC20WithTokenInfo _underlyingToken) external returns (ISuperToken) {
        // we use this to check if we have initialized the _canonicalWrapperSuperTokens mapping
        // @note we must set this during initialization
        if (_canonicalWrapperSuperTokens[address(0)] == address(0)) {
            revert SUPER_TOKEN_FACTORY_UNINITIALIZED();
        }

        address underlyingTokenAddress = address(_underlyingToken);
        address canonicalSuperTokenAddress = _canonicalWrapperSuperTokens[underlyingTokenAddress];

        // if the canonical super token address exists, revert with custom error
        if (canonicalSuperTokenAddress != address(0)) {
            revert SUPER_TOKEN_FACTORY_ALREADY_EXISTS();
        }

        // use create2 to deterministically create the proxy contract for the wrapper super token
        bytes32 salt = keccak256(abi.encode(underlyingTokenAddress));
        bytes memory data;
        BeaconProxy proxy = new BeaconProxy{ salt: salt }(_superTokenBeacon.implementation(), data);

        // NOTE: address(proxy) is equivalent to address(superToken)
        _canonicalWrapperSuperTokens[underlyingTokenAddress] = address(proxy);

        // cast it as the same type as the logic contract
        ISuperToken superToken = ISuperToken(address(proxy));

        // get underlying token info
        uint8 underlyingDecimals = _underlyingToken.decimals();
        string memory underlyingName = _underlyingToken.name();
        string memory underlyingSymbol = _underlyingToken.symbol();
        // initialize the contract (proxy constructor)
        superToken.initializeProxy(
            _underlyingToken,
            underlyingDecimals,
            string.concat("Super ", underlyingName),
            string.concat(underlyingSymbol, "x")
        );

        emit SuperTokenCreated(superToken);

        return superToken;
    }

    /// @inheritdoc ISuperTokenFactory
    function createERC20Wrapper(
        IERC20 underlyingToken,
        uint8 underlyingDecimals,
        Upgradability upgradability,
        string calldata name,
        string calldata symbol
    ) public override returns (ISuperToken superToken) {
        if (address(underlyingToken) == address(0)) {
            revert SUPER_TOKEN_FACTORY_ZERO_ADDRESS();
        }
        
        ISuperToken superTokenLogic = ISuperToken(_superTokenBeacon.implementation());
        IConstantOutflowNFT constantOutflowNFT = IConstantOutflowNFT(superTokenLogic.constantOutflowNFT());
        IConstantInflowNFT constantInflowNFT = IConstantInflowNFT(superTokenLogic.constantInflowNFT());
        
        bytes memory data = abi.encodeWithSelector(
            ISuperToken.initializeLogic.selector,
            _host,
            constantOutflowNFT,
            constantInflowNFT
        );
        if (upgradability == Upgradability.NON_UPGRADABLE) {
            revert SUPER_TOKEN_FACTORY_NON_UPGRADEABLE_IS_DEPRECATED();
        } else if (upgradability == Upgradability.SEMI_UPGRADABLE) {
            SuperfluidERC1967Proxy proxy = new SuperfluidERC1967Proxy(_superTokenBeacon.implementation(), data);
            // initialize the wrapper
            superToken = ISuperToken(address(proxy));
        } /* if (type == Upgradability.FULL_UPGRADABLE) */ else {
            BeaconProxy proxy = new BeaconProxy(address(_superTokenBeacon), data);
            superToken = ISuperToken(address(proxy));
        }

        // initialize the token
        superToken.initializeProxy(underlyingToken, underlyingDecimals, name, symbol);

        emit SuperTokenCreated(superToken);
    }

    /// @inheritdoc ISuperTokenFactory
    function createERC20Wrapper(
        ERC20WithTokenInfo underlyingToken,
        Upgradability upgradability,
        string calldata name,
        string calldata symbol
    ) external override returns (ISuperToken superToken) {
        return createERC20Wrapper(underlyingToken, underlyingToken.decimals(), upgradability, name, symbol);
    }

    /// @inheritdoc ISuperTokenFactory
    function initializeCustomSuperToken(address customSuperTokenProxy) external override {
        // TODO think about how to be friendler to custom super tokens
        emit CustomSuperTokenCreated(ISuperToken(customSuperTokenProxy));
    }

    /// @inheritdoc ISuperTokenFactory
    function computeCanonicalERC20WrapperAddress(address _underlyingToken)
        external
        view
        returns (address superTokenAddress, bool isDeployed)
    {
        address existingAddress = _canonicalWrapperSuperTokens[_underlyingToken];

        if (existingAddress != address(0)) {
            superTokenAddress = existingAddress;
            isDeployed = true;
        } else {
            bytes memory bytecode = type(BeaconProxy).creationCode;
            superTokenAddress = address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xff),
                                address(this),
                                keccak256(abi.encode(_underlyingToken)),
                                keccak256(bytecode)
                            )
                        )
                    )
                )
            );
            isDeployed = false;
        }
    }

    /// @inheritdoc ISuperTokenFactory
    function getCanonicalERC20Wrapper(address _underlyingTokenAddress)
        external
        view
        returns (address superTokenAddress)
    {
        superTokenAddress = _canonicalWrapperSuperTokens[_underlyingTokenAddress];
    }

    /// @notice Initializes list of canonical wrapper super tokens.
    /// @dev Note that this should also be kind of a throwaway function which will be executed only once.
    /// @param _data an array of canonical wrappper super tokens to be set
    function initializeCanonicalWrapperSuperTokens(InitializeData[] calldata _data) external virtual {
        Ownable gov = Ownable(address(_host.getGovernance()));
        if (msg.sender != gov.owner()) revert SUPER_TOKEN_FACTORY_ONLY_GOVERNANCE_OWNER();

        // once the list has been set, it cannot be reset
        // @note this means that we must set the 0 address (Native Asset Super Token) when we call this the first time
        if (_canonicalWrapperSuperTokens[address(0)] != address(0)) {
            revert SUPER_TOKEN_FACTORY_ALREADY_EXISTS();
        }

        // initialize mapping
        for (uint256 i = 0; i < _data.length; i++) {
            _canonicalWrapperSuperTokens[_data[i].underlyingToken] = _data[i].superToken;
        }
    }
}
