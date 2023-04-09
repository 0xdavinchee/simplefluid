// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { ISuperAgreement } from "../interfaces/superfluid/ISuperAgreement.sol";

/**
 * @title AgreementBase Contract
 * @author Superfluid | Modified by 0xdavinchee
 */
abstract contract AgreementBase is ISuperAgreement, Initializable, UUPSUpgradeable {
    address internal _host;

    // Custom Erorrs
    error AGREEMENT_BASE_ONLY_HOST(); // 0x1601d91e

    function initialize(address host_) external initializer {
        _host = host_;
    }

    function _authorizeUpgrade(
        address // newImplementation_
    ) internal view override {
        if (msg.sender != _host) revert AGREEMENT_BASE_ONLY_HOST();
    }
}
