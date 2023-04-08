// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ForcePush {
    constructor(address dst) payable {
        selfdestruct(payable(dst));
    }
}
