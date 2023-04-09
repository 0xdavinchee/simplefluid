// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { ISuperToken, CustomSuperTokenBase } from "../interfaces/superfluid/CustomSuperTokenBase.sol";
import { ISETHCustom } from "../interfaces/tokens/ISETH.sol";
/**
 * @dev Super ETH (SETH) custom super token implementation
 * @author Superfluid | Modified by 0xdavinchee
 *
 * It is also called a Native-Asset Super Token.
 */
// @note there may be some specifics with SETHProxy due to the nature of receiving the native asset, make sure things make sense here...
contract SETHProxy is ISETHCustom, CustomSuperTokenBase, UUPSUpgradeable {
    event TokenUpgraded(address indexed account, uint256 amount);
    event TokenDowngraded(address indexed account, uint256 amount);

    function _authorizeUpgrade(address newImplementation) internal override {
        // if (msg.sender != host) revert?
    }

    // fallback function which mints Super Tokens for received ETH
    receive() external payable {
        ISuperToken(address(this)).selfMint(msg.sender, msg.value, new bytes(0));
        emit TokenUpgraded(msg.sender, msg.value);
    }

    function upgradeByETH() external payable override {
        ISuperToken(address(this)).selfMint(msg.sender, msg.value, new bytes(0));
        emit TokenUpgraded(msg.sender, msg.value);
    }

    function upgradeByETHTo(address to) external payable override {
        ISuperToken(address(this)).selfMint(to, msg.value, new bytes(0));
        emit TokenUpgraded(to, msg.value);
    }

    function downgradeToETH(uint256 wad) external override {
        ISuperToken(address(this)).selfBurn(msg.sender, wad, new bytes(0));
        payable(msg.sender).transfer(wad);
        emit TokenDowngraded(msg.sender, wad);
    }
}
