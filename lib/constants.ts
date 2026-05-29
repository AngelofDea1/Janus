// Contract addresses (update after deployment)
export const VAULT_ADDRESS = '0x764bd84928249ead3ce79e164bd94531841b3c2a' as const;
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
export const MULTISIG_ADDRESS = '0x8ac5eE52F70AE01dB914bE459D8B3d50126fd6aE' as const;
export const TIMELOCK_ADDRESS = '0x892a0bcf87baee1e390c9b88a8d11cfa98b0f22d' as const;
export const INSURANCE_FUND_ADDRESS = '0x325c8Df4CFb5B068675AFF8f62aA668D1dEc3C4B' as const;

// Vault ABI
export const VAULT_ABI = [
  {
    "inputs": [
      {"type": "uint256", "name": "assets"},
      {"type": "address", "name": "receiver"}
    ],
    "name": "deposit",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "uint256", "name": "assets"},
      {"type": "address", "name": "receiver"},
      {"type": "address", "name": "owner"}
    ],
    "name": "withdraw",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "account"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "userValue",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "estimatedAPY",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "shares"}],
    "name": "requestWithdrawal",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "requestId"}],
    "name": "completeWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "requestId"}],
    "name": "getWithdrawalRequest",
    "outputs": [
      {"type": "address", "name": "user"},
      {"type": "uint256", "name": "shares"},
      {"type": "uint256", "name": "requestTime"},
      {"type": "bool", "name": "completed"},
      {"type": "uint256", "name": "timeRemaining"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vaultCap",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawalDelay",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPerformanceFees",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "index"}],
    "name": "getAuditLog",
    "outputs": [
      {"type": "uint256"},
      {"type": "string"},
      {"type": "address"},
      {"type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuditLogCount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "name": "asset", "type": "string"},
      {"indexed": false, "name": "route", "type": "string"},
      {"indexed": false, "name": "volume", "type": "uint256"},
      {"indexed": false, "name": "spread", "type": "string"},
      {"indexed": false, "name": "yieldHarvested", "type": "uint256"}
    ],
    "name": "ArbitrageExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "totalAssetsAfter", "type": "uint256"}
    ],
    "name": "ArbitrageYieldHarvested",
    "type": "event"
  }
] as const;

// USDC ABI (minimal)
export const USDC_ABI = [
  {
    "inputs": [
      {"type": "address", "name": "spender"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "approve",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "owner"},
      {"type": "address", "name": "spender"}
    ],
    "name": "allowance",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "account"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Insurance Fund ABI
export const INSURANCE_FUND_ABI = [
  {
    "inputs": [],
    "name": "getAvailableBalance",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalInsured",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalClaimed",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "claimId"}],
    "name": "getClaim",
    "outputs": [
      {"type": "address"},
      {"type": "uint256"},
      {"type": "string"},
      {"type": "bool"},
      {"type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// MultiSig ABI
export const MULTISIG_ABI = [
  {
    "inputs": [],
    "name": "vaultPaused",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes32", "name": "proposalId"}],
    "name": "getProposal",
    "outputs": [
      {"type": "string"},
      {"type": "address"},
      {"type": "uint256"},
      {"type": "bool"},
      {"type": "bool"},
      {"type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProposalCount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
