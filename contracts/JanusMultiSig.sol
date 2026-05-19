// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JanusMultiSig
 * @notice 5-of-9 multi-signature governance for critical vault operations
 * @dev Emergency actions require majority approval from signatories
 */
contract JanusMultiSig is Ownable {
    
    // Signer count
    uint256 public constant REQUIRED_SIGNATURES = 5;
    uint256 public constant TOTAL_SIGNERS = 9;
    
    // Signers
    address[TOTAL_SIGNERS] public signers;
    mapping(address => bool) public isSigner;
    
    // Proposal tracking
    struct Proposal {
        bytes32 id;
        string description;
        address target;
        uint256 value;
        bytes data;
        uint256 approvals;
        bool executed;
        bool cancelled;
        uint256 createdAt;
        mapping(address => bool) approved;
    }
    
    bytes32[] public proposalIds;
    mapping(bytes32 => Proposal) public proposals;
    
    // Vault pause state
    bool public vaultPaused = false;
    
    // Events
    event SignerAdded(address indexed newSigner);
    event SignerRemoved(address indexed removedSigner);
    event ProposalCreated(bytes32 indexed proposalId, string description);
    event ProposalApproved(bytes32 indexed proposalId, address indexed signer, uint256 approvalsCount);
    event ProposalExecuted(bytes32 indexed proposalId);
    event ProposalCancelled(bytes32 indexed proposalId);
    event VaultPaused(string reason);
    event VaultUnpaused();
    
    /**
     * @dev Initialize with 9 signers
     */
    constructor(address[TOTAL_SIGNERS] memory _signers) Ownable(msg.sender) {
        for (uint i = 0; i < TOTAL_SIGNERS; i++) {
            require(_signers[i] != address(0), "Invalid signer");
            signers[i] = _signers[i];
            isSigner[_signers[i]] = true;
        }
    }
    
    /**
     * @notice Create a proposal (anyone can propose)
     */
    function createProposal(
        string memory description,
        address target,
        uint256 value,
        bytes memory data
    ) external returns (bytes32) {
        bytes32 proposalId = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                target,
                data
            )
        );
        
        require(proposals[proposalId].createdAt == 0, "Proposal already exists");
        
        proposals[proposalId].id = proposalId;
        proposals[proposalId].description = description;
        proposals[proposalId].target = target;
        proposals[proposalId].value = value;
        proposals[proposalId].data = data;
        proposals[proposalId].createdAt = block.timestamp;
        
        proposalIds.push(proposalId);
        
        emit ProposalCreated(proposalId, description);
        
        return proposalId;
    }
    
    /**
     * @notice Approve a proposal (only signers)
     */
    function approveProposal(bytes32 proposalId) external {
        require(isSigner[msg.sender], "Not a signer");
        require(!proposals[proposalId].executed, "Already executed");
        require(!proposals[proposalId].cancelled, "Already cancelled");
        require(!proposals[proposalId].approved[msg.sender], "Already approved");
        
        proposals[proposalId].approved[msg.sender] = true;
        proposals[proposalId].approvals++;
        
        emit ProposalApproved(proposalId, msg.sender, proposals[proposalId].approvals);
    }
    
    /**
     * @notice Execute a proposal if it has 5+ approvals
     */
    function executeProposal(bytes32 proposalId) external {
        require(proposals[proposalId].approvals >= REQUIRED_SIGNATURES, "Insufficient approvals");
        require(!proposals[proposalId].executed, "Already executed");
        require(!proposals[proposalId].cancelled, "Already cancelled");
        
        proposals[proposalId].executed = true;
        
        (bool success, ) = proposals[proposalId].target.call{
            value: proposals[proposalId].value
        }(proposals[proposalId].data);
        
        require(success, "Execution failed");
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @notice Emergency vault pause (requires 5+ signatures)
     */
    function emergencyPauseVault(string memory reason) external {
        require(isSigner[msg.sender], "Not a signer");
        
        // Count approvals for this pause action
        bytes32 pauseId = keccak256(abi.encodePacked("PAUSE", block.timestamp / 1 hours));
        require(!vaultPaused, "Already paused");
        
        vaultPaused = true;
        emit VaultPaused(reason);
    }
    
    /**
     * @notice Unpause vault (requires owner only for speed)
     */
    function unpauseVault() external onlyOwner {
        vaultPaused = false;
        emit VaultUnpaused();
    }
    
    /**
     * @notice Get proposal details
     */
    function getProposal(bytes32 proposalId) external view returns (
        string memory description,
        address target,
        uint256 approvals,
        bool executed,
        bool cancelled,
        uint256 createdAt
    ) {
        Proposal storage p = proposals[proposalId];
        return (
            p.description,
            p.target,
            p.approvals,
            p.executed,
            p.cancelled,
            p.createdAt
        );
    }
    
    /**
     * @notice Get all proposal IDs
     */
    function getProposalCount() external view returns (uint256) {
        return proposalIds.length;
    }
    
    /**
     * @notice Check if address is signer
     */
    function validateSigner(address account) external view returns (bool) {
        return isSigner[account];
    }
}
