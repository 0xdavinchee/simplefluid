// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { SuperfluidGovernanceBase } from "./SuperfluidGovernanceBase.sol";
import { ISuperfluid } from "../interfaces/superfluid/ISuperfluid.sol";

// @note just get this to compile first, we will not be using this governance
contract SuperfluidGovernanceII is Ownable, UUPSUpgradeable, SuperfluidGovernanceBase {
    error SF_GOV_II_ONLY_OWNER();

    function _requireAuthorised() private view {
        if (owner() != _msgSender()) revert SF_GOV_II_ONLY_OWNER();
    }

    function _authorizeUpgrade(address)
        // newImplementation
        internal
        view
        override
    {
        if (owner() != _msgSender()) revert SF_GOV_II_ONLY_OWNER();
    }

    /**
     *
     * UUPSProxiable
     *
     */

    function proxiableUUID() public pure override returns (bytes32) {
        return keccak256("org.superfluid-finance.contracts.SuperfluidGovernanceII.implementation");
    }

    // function updateCode(address newAddress)
    //     external override
    // {
    //     _requireAuthorised();
    //     // _updateCodeAddress(newAddress);
    // }

    /**************************************************************************
    * SuperfluidGovernanceBase
    **************************************************************************/

    function _requireAuthorised(ISuperfluid /*host*/ ) internal view override {
        _requireAuthorised();
    }
}
