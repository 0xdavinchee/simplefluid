// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract UpgradeableThing is Initializable {
    address public gm;

    function initialize(address gm_) external initializer {
        gm = gm_;
    }
}

contract UpgradeableThingV2 is Initializable {
    address public gm;
    uint256 public boop;

    function initialize(address gm_) external initializer {
        gm = gm_;
    }
}