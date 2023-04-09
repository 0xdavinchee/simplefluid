// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.19;

import {
    ISuperfluid,
    ISuperfluidToken
} from "../../src/interfaces/superfluid/ISuperfluid.sol";
import { SuperfluidGovernanceBase } from "../../src/gov/SuperfluidGovernanceBase.sol";

/**
 * @title Test governance contract
 * @author Superfluid
 * @dev A initializable version of the governance for testing purpose
 */
contract TestGovernance is
    SuperfluidGovernanceBase
{
    ISuperfluid private _host;
    address public owner;

    // @note in the real governance, be explicit whether or not governance is upgradeable
    // you probably want it to be, but it is decided by the votes of the members
    function initialize(
        ISuperfluid host,
        address rewardAddress,
        uint256 liquidationPeriod,
        uint256 patricianPeriod,
        address[] calldata trustedForwarders
    )
        external
    {
        // can initialize only once
        assert(address(host) != address(0));
        assert(address(_host) == address(0));
        
        owner = msg.sender;

        _host = host;

        setRewardAddress(_host, ISuperfluidToken(address(0)), rewardAddress);

        setPPPConfig(host, ISuperfluidToken(address(0)), liquidationPeriod, patricianPeriod);

        for (uint i = 0; i < trustedForwarders.length; ++i) {
            enableTrustedForwarder(_host, ISuperfluidToken(address(0)), trustedForwarders[i]);
        }
    }

    function _requireAuthorised(ISuperfluid host)
        internal view override
    {
        assert(host == _host);
        assert(msg.sender == owner);
    }

    function transferOwnership(address newOwner_) external {
        assert(msg.sender == owner);
        owner = newOwner_;
    }
}
