// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JanusInsuranceFund
 * @notice Collects 5% of performance fees to protect against smart contract exploits
 */
contract JanusInsuranceFund is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdc;
    address public vaultAddress;
    
    uint256 public totalInsured;
    uint256 public totalClaimed;
    
    // Claim tracking
    struct Claim {
        uint256 id;
        address claimer;
        uint256 amount;
        string reason;
        uint256 timestamp;
        bool approved;
        bool paid;
    }
    
    Claim[] public claims;
    mapping(uint256 => bool) public claimApproved;
    
    // Events
    event InsuranceFunded(uint256 amount);
    event ClaimSubmitted(uint256 indexed claimId, address indexed claimer, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, uint256 amount);
    event ClaimPaid(uint256 indexed claimId, address indexed claimer, uint256 amount);
    
    constructor(address _usdc, address _vault) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        vaultAddress = _vault;
    }
    
    /**
     * @notice Deposit insurance funds (called by vault)
     */
    function depositInsurance(uint256 amount) external {
        require(msg.sender == vaultAddress, "Only vault");
        require(amount > 0, "Amount must be > 0");
        
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        totalInsured += amount;
        
        emit InsuranceFunded(amount);
    }
    
    /**
     * @notice Submit insurance claim
     */
    function submitClaim(
        uint256 amount,
        string memory reason
    ) external returns (uint256 claimId) {
        require(amount > 0, "Amount must be > 0");
        require(amount <= totalInsured - totalClaimed, "Insufficient insurance fund");
        
        claimId = claims.length;
        
        claims.push(Claim({
            id: claimId,
            claimer: msg.sender,
            amount: amount,
            reason: reason,
            timestamp: block.timestamp,
            approved: false,
            paid: false
        }));
        
        emit ClaimSubmitted(claimId, msg.sender, amount);
    }
    
    /**
     * @notice Approve claim (owner only)
     */
    function approveClaim(uint256 claimId) external onlyOwner {
        require(claimId < claims.length, "Invalid claim");
        require(!claims[claimId].approved, "Already approved");
        
        claims[claimId].approved = true;
        
        emit ClaimApproved(claimId, claims[claimId].amount);
    }
    
    /**
     * @notice Pay approved claim
     */
    function payClaim(uint256 claimId) external onlyOwner {
        require(claimId < claims.length, "Invalid claim");
        require(claims[claimId].approved, "Not approved");
        require(!claims[claimId].paid, "Already paid");
        
        claims[claimId].paid = true;
        totalClaimed += claims[claimId].amount;
        
        usdc.safeTransfer(claims[claimId].claimer, claims[claimId].amount);
        
        emit ClaimPaid(claimId, claims[claimId].claimer, claims[claimId].amount);
    }
    
    /**
     * @notice Get claim details
     */
    function getClaim(uint256 claimId) external view returns (
        address claimer,
        uint256 amount,
        string memory reason,
        bool approved,
        bool paid
    ) {
        require(claimId < claims.length, "Invalid claim");
        Claim storage c = claims[claimId];
        return (c.claimer, c.amount, c.reason, c.approved, c.paid);
    }
    
    /**
     * @notice Get insurance fund balance
     */
    function getAvailableBalance() external view returns (uint256) {
        return totalInsured - totalClaimed;
    }
    
    /**
     * @notice Get claim count
     */
    function getClaimCount() external view returns (uint256) {
        return claims.length;
    }
}
