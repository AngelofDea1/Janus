const { ethers } = require("ethers");
const rpc = "https://rpc.testnet.arc.network";
const eurcAddress = "0xeb51E844d1BDeD6A6b9d628D4a4C06aAcd607186"; // Checking this from constants
const provider = new ethers.JsonRpcProvider(rpc);

const abi = [
  "function decimals() view returns (uint8)"
];

async function main() {
  const contract = new ethers.Contract(eurcAddress, abi, provider);
  const decimals = await contract.decimals();
  console.log("EURC Decimals:", decimals);
}
main();
