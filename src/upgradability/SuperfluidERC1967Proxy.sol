// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract SuperfluidERC1967Proxy is ERC1967Proxy {
    constructor(address logic_, bytes memory data_) ERC1967Proxy(logic_, data_) { }

    function getImplementation() external view returns( address) {
        return _implementation();
    }
}
