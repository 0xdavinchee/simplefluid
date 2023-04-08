// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CustomProxyV1 {
    address public immutable logic;

    constructor(address logic_) {
        logic = logic_;
    }

    fallback(bytes calldata callData) external payable returns (bytes memory returnData) {
        // Forward any calls to the logic contract via delegatecall.
        returnData = _forwardCall(callData);
    }

    function _forwardCall(bytes memory callData) private returns (bytes memory returnData) {
        (bool s, bytes memory r) = logic.delegatecall(callData);
        if (!s) {
            assembly {
                revert(add(r, 0x20), mload(r))
            }
        }
        return r;
    }

    receive() external payable {}
}

contract CustomProxyV2 {
    address public immutable logic;

    constructor(address logic_, bytes memory initCallData_) {
        logic = logic_;
        // call init here
        _forwardCall(initCallData_);
    }

    fallback(bytes calldata callData) external payable returns (bytes memory returnData) {
        // Forward any calls to the logic contract via delegatecall.
        returnData = _forwardCall(callData);
    }

    function _forwardCall(bytes memory callData) private returns (bytes memory returnData) {
        (bool s, bytes memory r) = logic.delegatecall(callData);
        if (!s) {
            assembly {
                revert(add(r, 0x20), mload(r))
            }
        }
        return r;
    }

    receive() external payable {}
}

contract CustomLogicV1 {
    bool public initialized;
    address public owner;

    // Set the owner once and only once.
    function initialize(address owner_) external {
        require(!initialized, "already initialized");
        initialized = true;
        owner = owner_;
    }

    // Move ETH out of this contract.
    function transferOut(address payable to, uint256 amount) external {
        require(msg.sender == owner, "only owner");
        to.transfer(amount);
    }

    // Allow this contract to receive ETH.
    receive() external payable {}
}

contract CustomLogicV2 {
    address public owner;

    // Set the owner once and only once.
    function initialize(address owner_) external {
        require(address(this).code.length == 0, "not in constructor");
        owner = owner_;
    }

    // Move ETH out of this contract.
    function transferOut(address payable to, uint256 amount) external {
        require(msg.sender == owner, "only owner");
        to.transfer(amount);
    }

    // Allow this contract to receive ETH.
    receive() external payable {}
}