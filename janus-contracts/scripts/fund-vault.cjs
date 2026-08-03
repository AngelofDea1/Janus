const { createWalletClient, createPublicClient, http, parseAbi, encodeFunctionData } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const PRIVATE_KEY = '0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40';
const VAULT_ADDRESS = '0x764bd84928249ead3ce79e164bd94531841b3c2a';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const RPC_URL = 'https://rpc.testnet.arc.network';

const DEPOSIT_AMOUNT = 80_000000; // 80 USDC (6 decimals)

const account = privateKeyToAccount(PRIVATE_KEY);

const publicClient = createPublicClient({ transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, transport: http(RPC_URL) });

const erc20Abi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

const vaultAbi = parseAbi([
  'function deposit(uint256 assets, address receiver) returns (uint256)',
  'function totalAssets() view returns (uint256)',
]);

async function main() {
  console.log(`Deployer: ${account.address}`);
  
  // Check deployer USDC balance
  const balance = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
  });
  console.log(`Deployer USDC balance: ${Number(balance) / 1e6} USDC`);

  if (Number(balance) < DEPOSIT_AMOUNT) {
    console.error(`Insufficient balance: have ${Number(balance)/1e6}, need ${DEPOSIT_AMOUNT/1e6}`);
    process.exit(1);
  }

  // Step 1: Approve USDC
  console.log(`\nApproving ${DEPOSIT_AMOUNT / 1e6} USDC for vault...`);
  const approveTx = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'approve',
    args: [VAULT_ADDRESS, BigInt(DEPOSIT_AMOUNT)],
  });
  console.log(`Approve TX: ${approveTx}`);
  await publicClient.waitForTransactionReceipt({ hash: approveTx });
  console.log('Approve confirmed!');

  // Step 2: Deposit into vault
  console.log(`\nDepositing ${DEPOSIT_AMOUNT / 1e6} USDC into vault...`);
  const depositTx = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'deposit',
    args: [BigInt(DEPOSIT_AMOUNT), account.address],
  });
  console.log(`Deposit TX: ${depositTx}`);
  await publicClient.waitForTransactionReceipt({ hash: depositTx });
  console.log('Deposit confirmed!');

  // Step 3: Verify totalAssets
  const totalAssets = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'totalAssets',
  });
  console.log(`\n✅ Vault totalAssets: ${Number(totalAssets) / 1e6} USDC`);
}

main().catch(console.error);
