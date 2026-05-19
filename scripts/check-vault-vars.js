const { createPublicClient, http } = require('viem');

const rpcUrl = 'https://rpc.testnet.arc.network';
const VAULT_ADDRESS = '0x70E5370b8981Abc6e14C91F4AcE823954EFC8eA3';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const USER_ADDRESS = '0xe18c569888162f561efeE84D69Bc4A5d20236d14';

const client = createPublicClient({ transport: http(rpcUrl) });

async function main() {
  const abi = [
    { "inputs": [], "name": "asset", "outputs": [{"type": "address"}], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalAssets", "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "vaultCap", "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "multiSig", "outputs": [{"type": "address"}], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "keeper", "outputs": [{"type": "address"}], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{"type": "uint8"}], "stateMutability": "view", "type": "function" }
  ];

  const usdcAbi = [
    { "inputs": [{"type": "address", "name": "account"}], "name": "balanceOf", "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function" },
    { "inputs": [{"type": "address", "name": "owner"}, {"type": "address", "name": "spender"}], "name": "allowance", "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function" }
  ];

  const asset = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'asset' });
  const totalAssets = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'totalAssets' });
  const vaultCap = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'vaultCap' });
  const multiSig = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'multiSig' });
  const keeper = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'keeper' });
  const decimals = await client.readContract({ address: VAULT_ADDRESS, abi, functionName: 'decimals' });

  const usdcBalance = await client.readContract({ address: USDC_ADDRESS, abi: usdcAbi, functionName: 'balanceOf', args: [USER_ADDRESS] });
  const usdcAllowance = await client.readContract({ address: USDC_ADDRESS, abi: usdcAbi, functionName: 'allowance', args: [USER_ADDRESS, VAULT_ADDRESS] });

  console.log(`--- Vault Status ---`);
  console.log(`Vault Address: ${VAULT_ADDRESS}`);
  console.log(`Asset: ${asset}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Total Assets: ${totalAssets}`);
  console.log(`Vault Cap: ${vaultCap}`);
  console.log(`MultiSig Address: ${multiSig}`);
  console.log(`Keeper Address: ${keeper}`);
  console.log(`--- User Status ---`);
  console.log(`User USDC Balance: ${usdcBalance}`);
  console.log(`User USDC Allowance to Vault: ${usdcAllowance}`);

  // Query if multisig is paused if multisig is not zero
  if (multiSig !== '0x0000000000000000000000000000000000000000') {
    try {
      const vaultPaused = await client.readContract({
        address: multiSig,
        abi: [{ "inputs": [], "name": "vaultPaused", "outputs": [{"type": "bool"}], "stateMutability": "view", "type": "function" }],
        functionName: 'vaultPaused'
      });
      console.log(`Vault Paused on MultiSig: ${vaultPaused}`);
    } catch (e) {
      console.log(`Failed to query vaultPaused from MultiSig: ${e.message}`);
    }
  }
}

main().catch(console.error);
