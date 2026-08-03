const { createWalletClient, http, publicActions, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { arcTestnet } = require('viem/chains');

// 1. Paste your deployer private key here (the 0x97c0... one that deployed the contract)
const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY || "0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40";

const VAULT_ADDRESS = "0xc4e08de98a87f930abefeafdd5d253a753f8232f";
const NEW_KEEPER = "0x59e2532e40982e4233b2cec2d074ad9e6a120f00";

const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
const client = createWalletClient({
  account,
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network")
}).extend(publicActions);

const abi = parseAbi([
  'function updateKeeper(address _newKeeper) external'
]);

async function main() {
  console.log(`📡 Connecting to Arc Testnet...`);
  console.log(`Updating Keeper to: ${NEW_KEEPER}`);

  const hash = await client.writeContract({
    address: VAULT_ADDRESS,
    abi,
    functionName: 'updateKeeper',
    args: [NEW_KEEPER],
  });

  console.log(`✅ Transaction submitted! Hash: ${hash}`);
  console.log(`Waiting for block confirmation...`);
  const receipt = await client.waitForTransactionReceipt({ hash });
  console.log(`🚀 Keeper successfully updated in Block ${receipt.blockNumber}!`);
}

main().catch(console.error);
