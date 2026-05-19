const { createPublicClient, createWalletClient, http, parseAbi, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { arcTestnet } = require('viem/chains');

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
const account = privateKeyToAccount("0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40");

const client = createWalletClient({
  account,
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network")
});

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network")
});

const abi = parseAbi([
  'function deposit() public payable',
  'function mint(address, uint256) public',
  'function balanceOf(address) public view returns (uint256)'
]);

async function run() {
  try {
    const bal = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi,
      functionName: 'balanceOf',
      args: [account.address]
    });
    console.log("ERC-20 Balance:", bal.toString());

    console.log("Trying mint...");
    await client.writeContract({
      address: USDC_ADDRESS,
      abi,
      functionName: 'mint',
      args: [account.address, parseEther("1000")]
    });
    console.log("Mint succeeded!");
  } catch(e) {
    console.log("Mint failed:", e.details || e.message);
    try {
      console.log("Trying deposit...");
      await client.writeContract({
        address: USDC_ADDRESS,
        abi,
        functionName: 'deposit',
        value: parseEther("10")
      });
      console.log("Deposit succeeded!");
    } catch(e2) {
      console.log("Deposit failed:", e2.details || e2.message);
    }
  }
}
run();
