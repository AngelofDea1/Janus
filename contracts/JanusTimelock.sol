// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title JanusTimelock
 * @notice 24-hour governance delay for all vault parameter changes
 * @dev Anyone can schedule, only proposers can execute
 */
contract JanusTimelock is TimelockController {
    
    // 24 hours in seconds
    uint256 public constant DELAY = 1 days;
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    
    /**
     * @dev Initialize with proposers and executors
     * @param proposers Array of addresses that can propose transactions
     * @param executors Array of addresses that can execute transactions
     * @param admin Address that can manage roles
     */
    constructor(
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(
        DELAY,
        proposers,
        executors,
        admin
    ) {}
}
