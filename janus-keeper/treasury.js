require("dotenv").config();
const { createWalletClient, createPublicClient, http, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { arcTestnet } = require('viem/chains');

// Custom chain definition for Arc Testnet if needed
const arcTestnetConfig = {
  id: 48624856,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'Arc', symbol: 'ARC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
};

const PRIVATE_KEY = process.env.PRIVATE_KEY; // The deployer / treasury wallet
const KEEPER_ADDRESS = process.env.KEEPER_ADDRESS;
const USDC_ADDRESS = process.env.USDC_ADDRESS;
const RPC_URL = 'https://rpc.testnet.arc.network';

const REFILL_THRESHOLD = 5_000000; // 5 USDC
const REFILL_AMOUNT = 10_000000; // 10 USDC
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

if (!PRIVATE_KEY || !KEEPER_ADDRESS || !USDC_ADDRESS) {
  console.error("Missing required environment variables in treasury.js");
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({ chain: arcTestnetConfig, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: arcTestnetConfig, transport: http(RPC_URL) });

const erc20Abi = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
]);

async function checkAndRefill() {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [KEEPER_ADDRESS],
    });

    console.log(`[Treasury] Keeper balance: ${Number(balance) / 1e6} USDC`);

    if (balance < BigInt(REFILL_THRESHOLD)) {
      console.log(`[Treasury] Balance below threshold! Refilling with 10 USDC...`);
      const tx = await walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [KEEPER_ADDRESS, BigInt(REFILL_AMOUNT)],
      });
      console.log(`[Treasury] Refill TX submitted: ${tx}`);
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log(`[Treasury] Refill successful!`);
    } else {
      console.log(`[Treasury] Balance is healthy. No refill needed.`);
    }
  } catch (error) {
    console.error(`[Treasury Error] Failed to check or refill:`, error);
  }
}

console.log("=================================================");
console.log("🏦 Janus Treasury Auto-Funder Service Started");
console.log(`Threshold: 5 USDC | Refill: 10 USDC | Interval: 5m`);
console.log("=================================================");

checkAndRefill();
setInterval(checkAndRefill, CHECK_INTERVAL);
