const { createWalletClient, createPublicClient, http, parseUnits } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const fs = require('fs');
const path = require('path');

const rpcUrl = 'https://rpc.testnet.arc.network';

const PRIVATE_KEY = '0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40';
const account = privateKeyToAccount(PRIVATE_KEY);

const VAULT_ADDRESS = '0xc4e08de98a87f930abefeafdd5d253a753f8232f';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

const publicClient = createPublicClient({ transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, transport: http(rpcUrl) });

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "harvestYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const usdcAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function run() {
  console.log(`Approving Vault to spend USDC...`);
  const amountToHarvest1 = parseUnits("458.20", 18);
  const amountToHarvest2 = parseUnits("442.15", 18);
  
  let tx = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: usdcAbi,
    functionName: 'approve',
    args: [VAULT_ADDRESS, amountToHarvest1 + amountToHarvest2]
  });
  console.log(`Approval Hash: ${tx}`);
  await publicClient.waitForTransactionReceipt({ hash: tx });

  console.log(`Harvesting 442.15 USDC...`);
  tx = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi,
    functionName: 'harvestYield',
    args: [amountToHarvest2]
  });
  console.log(`Harvest Hash 1: ${tx}`);
  await publicClient.waitForTransactionReceipt({ hash: tx });

  console.log(`Harvesting 458.20 USDC...`);
  tx = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi,
    functionName: 'harvestYield',
    args: [amountToHarvest1]
  });
  console.log(`Harvest Hash 2: ${tx}`);
  await publicClient.waitForTransactionReceipt({ hash: tx });
  
  console.log("Successfully generated real on-chain events!");
}

run().catch(console.error);
