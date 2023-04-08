// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {BoringToken} from "./BoringToken.sol";

/// @title Create2Factory
/// @author 0xdavinchee
/// @notice A simple Create2Factory used to deterministically deploy contracts.
/// @dev See https://eips.ethereum.org/EIPS/eip-1014 for more details.
contract Create2Factory {
    
    /// @notice Deterministically deploy an ERC20 token
    /// @param name_ the token name
    /// @param symbol_ the token symbol
    /// @param decimals_ the number of decimals for the token
    function deployToken(string memory name_, string memory symbol_, uint8 decimals_)
        external
        returns (address token)
    {
        token = address(new BoringToken{salt: keccak256(abi.encode(name_, symbol_, decimals_))}(name_, symbol_, decimals_));
    }
}
