// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title JanusVaultUpgradeable
 * @notice Upgradeable ERC-4626 standard delta-neutral vault with UUPS proxy support,
 * allowing safe future integrations as perp protocols deploy on Arc L1.
 */
contract JanusVaultUpgradeable is Initializable, ERC4626Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    address public constant ARC_USDC = 0x3600000000000000000000000000000000000000;
    address public keeper;
    uint256 public estimatedAPY;

    event KeeperUpdated(address indexed oldKeeper, address indexed newKeeper);
    event APYUpdated(uint256 oldAPY, uint256 newAPY);
    event ArbitrageYieldHarvested(address indexed source, uint256 amount, uint256 totalAssetsAfter);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _asset,
        address _initialKeeper,
        address _initialOwner
    ) public initializer {
        require(address(_asset) == ARC_USDC, "Must use native Arc USDC");
        
        __ERC4626_init(_asset);
        __ERC20_init("Janus Upgradeable Shares", "JANUS");
        __Ownable_init(_initialOwner);

        keeper = _initialKeeper;
        estimatedAPY = 3240; // Default 32.4%
        emit KeeperUpdated(address(0), _initialKeeper);
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper || msg.sender == owner(), "Caller is not keeper");
        _;
    }

    function updateAPY(uint256 _newAPY) external onlyOwner {
        emit APYUpdated(estimatedAPY, _newAPY);
        estimatedAPY = _newAPY;
    }

    function updateKeeper(address _newKeeper) external onlyOwner {
        emit KeeperUpdated(keeper, _newKeeper);
        keeper = _newKeeper;
    }

    function harvestYield(uint256 amount) external onlyKeeper {
        require(amount > 0, "Yield must exceed zero");
        SafeERC20.safeTransferFrom(IERC20(asset()), msg.sender, address(this), amount);
        emit ArbitrageYieldHarvested(msg.sender, amount, totalAssets());
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
