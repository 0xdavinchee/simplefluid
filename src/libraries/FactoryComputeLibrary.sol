// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {BoringToken} from "../BoringToken.sol";

/// @title FactoryComputeLibrary
/// @author 0xdavinchee
/// @notice A library which deterministically computes addresses.
library FactoryComputeLibrary {
    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
    }

    /// @notice Computes the deterministic address (EIP-1041)
    /// @param factory_ the address of the factory contract
    /// @param tokenInfo_ the TokenInfo struct which contains the token name, symbol and decimals
    /// @return token the address of the token
    function computeTokenAddress(address factory_, TokenInfo memory tokenInfo_) internal pure returns (address token) {
        bytes32 salt = keccak256(abi.encode(tokenInfo_.name, tokenInfo_.symbol, tokenInfo_.decimals));
        bytes memory bytecode =
            abi.encodePacked(type(BoringToken).creationCode, abi.encode(tokenInfo_.name, tokenInfo_.symbol, tokenInfo_.decimals));
        token = address(uint160(uint256(keccak256(abi.encodePacked(hex"ff", factory_, salt, keccak256(bytecode))))));
    }
}
