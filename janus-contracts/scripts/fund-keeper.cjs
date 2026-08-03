const { createWalletClient, createPublicClient, http, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const PRIVATE_KEY = '0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40';
const KEEPER_ADDRESS = '0x59e2532e40982e4233b2cec2d074ad9e6a120f00';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const RPC_URL = 'https://rpc.testnet.arc.network';

const TRANSFER_AMOUNT = 8_000000; // 8 USDC

const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({ transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, transport: http(RPC_URL) });

const erc20Abi = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
]);

async function main() {
  console.log(`Sending ${TRANSFER_AMOUNT / 1e6} USDC to Keeper...`);
  const tx = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [KEEPER_ADDRESS, BigInt(TRANSFER_AMOUNT)],
  });
  console.log(`TX: ${tx}`);
  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log('Confirmed!');
}

main().catch(console.error);
