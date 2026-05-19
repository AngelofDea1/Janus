import { VAULT_ADDRESS, USDC_ADDRESS, MULTISIG_ADDRESS, TIMELOCK_ADDRESS, INSURANCE_FUND_ADDRESS } from "./constants";

export { TIMELOCK_ADDRESS, MULTISIG_ADDRESS, INSURANCE_FUND_ADDRESS };

export const TIMELOCK_ABI = [
  {
    "inputs": [],
    "name": "delay",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes32"}],
    "name": "queuedTransactions",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const MULTISIG_ABI = [
  {
    "inputs": [],
    "name": "requiredConfirmations",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTransactionCount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const INSURANCE_FUND_ABI = [
  {
    "inputs": [],
    "name": "totalAccrued",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserveBalance",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
