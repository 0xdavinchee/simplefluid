// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import {
    ISuperToken,
    CustomSuperTokenBase
}
from "../interfaces/superfluid/CustomSuperTokenBase.sol";
import { IPureSuperTokenCustom } from "../interfaces/tokens/IPureSuperToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Native SuperToken custom super token implementation
 * @author Superfluid | Modified by 0xdavinchee
 * @dev This is a simple implementation where the supply is pre-minted.
 */
contract PureSuperToken is IPureSuperTokenCustom, CustomSuperTokenBase {
    function initialize(string calldata name, string calldata symbol, uint256 initialSupply)
        external override
    {
        ISuperToken(address(this)).initializeProxy(
            // NOTE this is the verbose intention
            IERC20(0x0000000000000000000000000000000000000000), // no underlying/wrapped token
            18, // shouldn't matter if there's no wrapped token
            name,
            symbol
        );
        ISuperToken(address(this)).selfMint(msg.sender, initialSupply, new bytes(0));
    }
}
