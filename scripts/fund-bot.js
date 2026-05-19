const { createWalletClient, http, publicActions, parseAbi, parseEther, parseUnits } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { arcTestnet } = require('viem/chains');

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
const BOT_ADDRESS = "0x59e2532e40982e4233b2cec2d074ad9e6a120f00";
const account = privateKeyToAccount("0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40");

const client = createWalletClient({
  account,
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network")
}).extend(publicActions);

const abi = parseAbi([
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function approve(address spender, uint256 amount) public returns (bool)'
]);

async function main() {
  console.log("Funding Circle Wallet...");
  // Send Native Gas
  const gasHash = await client.sendTransaction({
    to: BOT_ADDRESS,
    value: parseEther("10"),
  });
  console.log("Sent 10 Native USDC for gas:", gasHash);

  // Check ERC20 Balance
  const bal = await client.readContract({
    address: USDC_ADDRESS,
    abi, functionName: 'balanceOf', args: [account.address]
  });
  console.log("Deployer ERC20 Balance:", bal.toString());

  // Send some ERC20
  if (bal > 100n) {
    const ercHash = await client.writeContract({
      address: USDC_ADDRESS,
      abi, functionName: 'transfer', args: [BOT_ADDRESS, 100n] // 100 units
    });
    console.log("Sent 100 wei of ERC20 to bot:", ercHash);
  }
}

main().catch(console.error);
