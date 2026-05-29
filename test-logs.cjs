const { createPublicClient, http } = require('viem');
const { arcTestnet } = require('viem/chains');

// Custom chain definition for Arc Testnet if it's missing in viem/chains
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

const publicClient = createPublicClient({
  chain: arcTestnetConfig,
  transport: http(),
});

const VAULT_ADDRESS = '0x764bd84928249ead3ce79e164bd94531841b3c2a';

async function main() {
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock > 5000n ? latestBlock - 5000n : 0n;
  
  console.log(`Checking blocks ${fromBlock} to ${latestBlock}...`);

  const logs = await publicClient.getLogs({
    address: VAULT_ADDRESS,
    event: {
      inputs: [
        { indexed: false, name: 'asset', type: 'string' },
        { indexed: false, name: 'route', type: 'string' },
        { indexed: false, name: 'volume', type: 'uint256' },
        { indexed: false, name: 'spread', type: 'string' },
        { indexed: false, name: 'yieldHarvested', type: 'uint256' },
      ],
      name: 'ArbitrageExecuted',
      type: 'event',
    },
    fromBlock,
    toBlock: latestBlock,
  });

  console.log('Logs found:', logs.length);
  if (logs.length > 0) {
    console.log(logs[0].args);
  }
}

main().catch(console.error);
