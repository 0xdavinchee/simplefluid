// SPDX-License-Identifier: AGPLv3
// solhint-disable not-rely-on-time
pragma solidity 0.8.19;

import {
    ISuperfluidToken
} from "../interfaces/superfluid/ISuperfluidToken.sol";
import {
    IConstantFlowAgreementV1
} from "../interfaces/agreements/IConstantFlowAgreementV1.sol";
import {
    IConstantInflowNFT
} from "../interfaces/superfluid/IConstantInflowNFT.sol";
import {
    IConstantOutflowNFT
} from "../interfaces/superfluid/IConstantOutflowNFT.sol";
import { FlowNFTBase, IFlowNFTBase } from "./FlowNFTBase.sol";

/// @title ConstantOutflowNFT contract (COF NFT)
/// @author Superfluid | Modified by 0xdavinchee
/// @notice The ConstantOutflowNFT contract to be minted to the flow sender on flow creation.
/// @dev This contract uses mint/burn interface for flow creation/deletion and holds the actual storage for both NFTs.
contract ConstantOutflowNFT is FlowNFTBase, IConstantOutflowNFT {
    /// @notice A mapping from token id to FlowNFTData
    /// FlowNFTData: { address flowSender, uint32 flowStartDate, address flowReceiver, address superToken }
    /// @dev The token id is uint256(keccak256(abi.encode(flowSender, flowReceiver)))
    mapping(uint256 => FlowNFTData) internal _flowDataByTokenId;

    // note that this is used so we don't upgrade to wrong logic contract
    function proxiableUUID() public pure override returns (bytes32) {
        return
            keccak256(
                "org.superfluid-finance.contracts.ConstantOutflowNFT.implementation"
            );
    }

    /// @notice An external function for querying flow data by `tokenId``
    /// @param tokenId the token id
    /// @return flowData the flow data associated with `tokenId`
    function flowDataByTokenId(
        uint256 tokenId
    )
        public
        view
        override(FlowNFTBase, IFlowNFTBase)
        returns (FlowNFTData memory flowData)
    {
        flowData = _flowDataByTokenId[tokenId];
    }

    /// @notice Hook called by CFA contract on flow creation
    /// @dev This function mints the COF NFT to the flow sender and mints the CIF NFT to the flow receiver
    /// @param superToken the SuperToken contract address
    /// @param flowSender the flow sender
    /// @param flowReceiver the flow receiver
    /// NOTE: We do an existence check in here to determine whether or not to execute the hook
    function onCreate(
        ISuperfluidToken superToken,
        address flowSender,
        address flowReceiver
    )
        external
        onlyFlowAgreements
    {
        // we don't check matching super token because the nft token id 
        // is generated based on the superToken
        uint256 newTokenId = _getTokenId(
            address(superToken),
            flowSender,
            flowReceiver
        );
        if (_flowDataByTokenId[newTokenId].flowSender == address(0)) {
            _mint(
                address(superToken),
                flowSender,
                flowReceiver,
                newTokenId
            );

            IConstantInflowNFT constantInflowNFT = superTokenLogic
                .constantInflowNFT();
            constantInflowNFT.mint(flowReceiver, newTokenId);
        }
    }

    /// @notice Hook called by CFA contract on flow update
    /// @dev This function triggers the metadata update of both COF and CIF NFTs
    /// @param superToken the SuperToken contract address
    /// @param flowSender the flow sender
    /// @param flowReceiver the flow receiver
    /// NOTE: We do an existence check in here to determine whether or not to execute the hook
    function onUpdate(
        ISuperfluidToken superToken,
        address flowSender,
        address flowReceiver
    )
        external
        onlyFlowAgreements
    {
        uint256 tokenId = _getTokenId(
            address(superToken),
            flowSender,
            flowReceiver
        );
        if (_flowDataByTokenId[tokenId].flowSender != address(0)) {
            _triggerMetadataUpdate(tokenId);

            IConstantInflowNFT constantInflowNFT = superTokenLogic
                .constantInflowNFT();
            constantInflowNFT.triggerMetadataUpdate(tokenId);
        }
    }

    /// @notice Hook called by CFA contract on flow deletion
    /// @dev This function burns the COF NFT and burns the CIF NFT
    /// @param superToken the SuperToken contract address
    /// @param flowSender the flow sender
    /// @param flowReceiver the flow receiver
    /// NOTE: We do an existence check in here to determine whether or not to execute the hook
    function onDelete(
        ISuperfluidToken superToken,
        address flowSender,
        address flowReceiver
    )
        external
        onlyFlowAgreements
    {
        uint256 tokenId = _getTokenId(
            address(superToken),
            flowSender,
            flowReceiver
        );
        if (_flowDataByTokenId[tokenId].flowSender != address(0)) {
            // must "burn" inflow NFT first because we clear storage when burning outflow NFT
            IConstantInflowNFT constantInflowNFT = superTokenLogic
                .constantInflowNFT();
            constantInflowNFT.burn(tokenId);

            _burn(tokenId);
        }
    }

    /// @inheritdoc FlowNFTBase
    function _ownerOf(
        uint256 tokenId
    ) internal view virtual override returns (address) {
        return _flowDataByTokenId[tokenId].flowSender;
    }

    /// @notice Reverts - Transfer of outflow NFT is not allowed.
    /// @dev We revert when users attempt to transfer outflow NFTs.
    function _transfer(
        address, // from,
        address, // to,
        uint256 // tokenId
    ) internal virtual override {
        revert CFA_NFT_TRANSFER_IS_NOT_ALLOWED();
    }

    /// @notice Mints `newTokenId` and transfers it to `flowSender`
    /// @dev `newTokenId` must not exist `flowSender` cannot be `address(0)` and we emit a {Transfer} event.
    /// `flowSender` cannot be equal to `flowReceiver`.
    /// @param superToken the SuperToken contract address
    /// @param flowSender the receiver of the newly minted outflow nft (to)
    /// @param flowReceiver the flow receiver (owner of the InflowNFT)
    /// @param newTokenId the new token id to be minted
    function _mint(
        address superToken,
        address flowSender,
        address flowReceiver,
        uint256 newTokenId
    ) internal {
        if (flowSender == address(0)) {
            revert COF_NFT_MINT_TO_ZERO_ADDRESS();
        }

        if (flowSender == flowReceiver) {
            revert COF_NFT_MINT_TO_AND_FLOW_RECEIVER_SAME();
        }

        if (_exists(newTokenId)) {
            revert COF_NFT_TOKEN_ALREADY_EXISTS();
        }

        // update mapping for new NFT to be minted
        _flowDataByTokenId[newTokenId] = FlowNFTData(
            superToken,
            flowSender,
            flowReceiver,
            uint32(block.timestamp) // flowStartDate
        );

        // emit mint of new outflow token with newTokenId
        emit Transfer(address(0), flowSender, newTokenId);
    }

    /// @notice Destroys token with `tokenId` and clears approvals from previous owner.
    /// @dev `tokenId` must exist AND we emit a {Transfer} event
    /// @param tokenId the id of the token we are destroying
    function _burn(uint256 tokenId) internal override {
        address owner = FlowNFTBase.ownerOf(tokenId);

        super._burn(tokenId);

        // remove previous tokenId flow data mapping
        delete _flowDataByTokenId[tokenId];

        // emit burn of outflow token with tokenId
        emit Transfer(owner, address(0), tokenId);
    }

    modifier onlyFlowAgreements() {
        if (msg.sender != address(constantFlowAgreementV1)) {
            revert COF_NFT_ONLY_FLOW_AGREEMENTS();
        }
        _;
    }
}
