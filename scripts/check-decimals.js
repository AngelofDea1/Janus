const { createPublicClient, http } = require('viem');

const rpcUrl = 'https://rpc.testnet.arc.network';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

const client = createPublicClient({ transport: http(rpcUrl) });

async function main() {
  const decimals = await client.readContract({
    address: USDC_ADDRESS,
    abi: [{
      "inputs": [],
      "name": "decimals",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    }],
    functionName: 'decimals'
  });
  console.log(`USDC DECIMALS ON ARC TESTNET IS: ${decimals}`);
}

main().catch(console.error);
