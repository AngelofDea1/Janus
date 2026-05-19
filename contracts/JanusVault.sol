// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IInsuranceFund {
    function depositInsurance(uint256 amount) external;
}

interface IMultiSig {
    function vaultPaused() external view returns (bool);
}

/**
 * @title JanusVault
 * @notice Institutional-grade arbitrage vault with safety mechanisms
 */
contract JanusVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;
    
    address public constant ARC_USDC = 0x3600000000000000000000000000000000000000;
    
    // Governance contracts
    address public multiSig;
    address public insuranceFund;
    
    // Keeper
    address public keeper;
    
    // Vault parameters
    uint256 public estimatedAPY = 3240; // 32.4%
    uint256 public vaultCap = 10_000_000e6; // $10M max TVL
    uint256 public withdrawalDelay = 2 days; // 2-day settlement
    
    // Withdrawal queue
    struct WithdrawalRequest {
        address user;
        uint256 shares;
        uint256 requestTime;
        bool completed;
    }
    
    WithdrawalRequest[] public withdrawalQueue;
    mapping(address => uint256[]) public userWithdrawals;
    
    // Audit log
    struct AuditLog {
        uint256 timestamp;
        string action;
        address actor;
        uint256 amount;
    }
    
    AuditLog[] public auditLogs;
    
    // Performance fee tracking
    uint256 public totalPerformanceFees;
    uint256 public insuranceFeePercentage = 500; // 5% of performance fees
    
    // Events
    event KeeperUpdated(address indexed oldKeeper, address indexed newKeeper);
    event APYUpdated(uint256 oldAPY, uint256 newAPY);
    event ArbitrageYieldHarvested(uint256 indexed amount, uint256 totalAssetsAfter);
    event WithdrawalRequested(uint256 indexed requestId, address indexed user, uint256 shares);
    event WithdrawalCompleted(uint256 indexed requestId, address indexed user, uint256 amount);
    event AuditLogEntry(uint256 timestamp, string action, address actor, uint256 amount);
    event VaultCapUpdated(uint256 oldCap, uint256 newCap);
    event WithdrawalDelayUpdated(uint256 oldDelay, uint256 newDelay);
    
    modifier onlyKeeper() {
        require(msg.sender == keeper || msg.sender == owner(), "Not keeper");
        _;
    }
    
    modifier vaultNotPaused() {
        if (multiSig != address(0)) {
            require(!IMultiSig(multiSig).vaultPaused(), "Vault is paused");
        }
        _;
    }
    
    constructor(
        IERC20 _asset,
        address _initialKeeper,
        address _multiSig,
        address _insuranceFund
    ) ERC4626(_asset) ERC20("Janus Arbitrage Shares", "JANUS") Ownable(msg.sender) {
        require(address(_asset) == ARC_USDC, "Must use native Arc USDC");
        keeper = _initialKeeper;
        multiSig = _multiSig;
        insuranceFund = _insuranceFund;
        
        _logAudit("VaultInitialized", msg.sender, 0);
    }
    
    /**
     * @notice Deposit with vault cap check
     */
    function deposit(uint256 assets, address receiver) 
        public 
        override 
        vaultNotPaused 
        returns (uint256)
    {
        require(totalAssets() + assets <= vaultCap, "Vault cap exceeded");
        
        uint256 shares = super.deposit(assets, receiver);
        _logAudit("Deposit", receiver, assets);
        
        return shares;
    }
    
    /**
     * @notice Request withdrawal (implements 2-day delay)
     */
    function requestWithdrawal(uint256 shares) external returns (uint256 requestId) {
        require(shares > 0, "Shares must be > 0");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        requestId = withdrawalQueue.length;
        
        withdrawalQueue.push(WithdrawalRequest({
            user: msg.sender,
            shares: shares,
            requestTime: block.timestamp,
            completed: false
        }));
        
        userWithdrawals[msg.sender].push(requestId);
        
        emit WithdrawalRequested(requestId, msg.sender, shares);
        _logAudit("WithdrawalRequested", msg.sender, shares);
        
        return requestId;
    }
    
    /**
     * @notice Complete withdrawal after delay
     */
    function completeWithdrawal(uint256 requestId) external {
        require(requestId < withdrawalQueue.length, "Invalid request");
        
        WithdrawalRequest storage req = withdrawalQueue[requestId];
        require(req.user == msg.sender, "Not your request");
        require(!req.completed, "Already completed");
        require(
            block.timestamp >= req.requestTime + withdrawalDelay,
            "Withdrawal delay not met"
        );
        
        req.completed = true;
        
        // Burn shares and transfer assets
        uint256 assets = convertToAssets(req.shares);
        _burn(msg.sender, req.shares);
        IERC20(asset()).safeTransfer(msg.sender, assets);
        
        emit WithdrawalCompleted(requestId, msg.sender, assets);
        _logAudit("WithdrawalCompleted", msg.sender, assets);
    }
    
    /**
     * @notice Harvest yield with insurance fee deduction
     */
    function harvestYield(uint256 amount) external onlyKeeper vaultNotPaused {
        require(amount > 0, "Yield must be greater than zero");
        
        SafeERC20.safeTransferFrom(IERC20(asset()), msg.sender, address(this), amount);
        
        // Calculate insurance fee (5% of performance fees)
        uint256 insuranceFee = (amount * insuranceFeePercentage) / 10000;
        
        if (insuranceFee > 0 && insuranceFund != address(0)) {
            IERC20(asset()).approve(insuranceFund, insuranceFee);
            IInsuranceFund(insuranceFund).depositInsurance(insuranceFee);
        }
        
        totalPerformanceFees += amount;
        
        emit ArbitrageYieldHarvested(amount, totalAssets());
        _logAudit("YieldHarvested", msg.sender, amount);
    }
    
    /**
     * @notice Update APY (governance only)
     */
    function updateAPY(uint256 _newAPY) external onlyOwner {
        emit APYUpdated(estimatedAPY, _newAPY);
        estimatedAPY = _newAPY;
        _logAudit("APYUpdated", msg.sender, _newAPY);
    }
    
    /**
     * @notice Update vault cap (governance only)
     */
    function updateVaultCap(uint256 _newCap) external onlyOwner {
        emit VaultCapUpdated(vaultCap, _newCap);
        vaultCap = _newCap;
        _logAudit("VaultCapUpdated", msg.sender, _newCap);
    }
    
    /**
     * @notice Update withdrawal delay (governance only)
     */
    function updateWithdrawalDelay(uint256 _newDelay) external onlyOwner {
        emit WithdrawalDelayUpdated(withdrawalDelay, _newDelay);
        withdrawalDelay = _newDelay;
        _logAudit("WithdrawalDelayUpdated", msg.sender, _newDelay);
    }
    
    /**
     * @notice Update keeper (governance only)
     */
    function updateKeeper(address _newKeeper) external onlyOwner {
        require(_newKeeper != address(0), "Invalid keeper");
        emit KeeperUpdated(keeper, _newKeeper);
        keeper = _newKeeper;
        _logAudit("KeeperUpdated", msg.sender, 0);
    }
    
    /**
     * @notice Get user value (shares → assets)
     */
    function userValue(address user) external view returns (uint256) {
        return convertToAssets(balanceOf(user));
    }
    
    /**
     * @notice Get withdrawal request details
     */
    function getWithdrawalRequest(uint256 requestId) external view returns (
        address user,
        uint256 shares,
        uint256 requestTime,
        bool completed,
        uint256 timeRemaining
    ) {
        require(requestId < withdrawalQueue.length, "Invalid request");
        WithdrawalRequest storage req = withdrawalQueue[requestId];
        
        uint256 completeTime = req.requestTime + withdrawalDelay;
        uint256 remaining = block.timestamp >= completeTime ? 0 : completeTime - block.timestamp;
        
        return (
            req.user,
            req.shares,
            req.requestTime,
            req.completed,
            remaining
        );
    }
    
    /**
     * @notice Get audit log entry
     */
    function getAuditLog(uint256 index) external view returns (
        uint256 timestamp,
        string memory action,
        address actor,
        uint256 amount
    ) {
        require(index < auditLogs.length, "Invalid index");
        AuditLog storage log = auditLogs[index];
        return (log.timestamp, log.action, log.actor, log.amount);
    }
    
    /**
     * @notice Get audit log count
     */
    function getAuditLogCount() external view returns (uint256) {
        return auditLogs.length;
    }
    
    /**
     * @notice Internal audit logging
     */
    function _logAudit(string memory action, address actor, uint256 amount) internal {
        auditLogs.push(AuditLog({
            timestamp: block.timestamp,
            action: action,
            actor: actor,
            amount: amount
        }));
        emit AuditLogEntry(block.timestamp, action, actor, amount);
    }
}
