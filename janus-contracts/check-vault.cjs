const { ethers } = require("ethers");
const rpc = "https://rpc.testnet.arc.network";
const usdcVaultAddress = "0x764bd84928249ead3ce79e164bd94531841b3c2a".toLowerCase(); // from constants
const eurcVaultAddress = "0xb8d81f1874fe9679a5512ad3acfc22755498b153".toLowerCase();

const provider = new ethers.JsonRpcProvider(rpc);

const abi = [
  "function totalAssets() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const usdcVault = new ethers.Contract(usdcVaultAddress, abi, provider);
  const eurcVault = new ethers.Contract(eurcVaultAddress, abi, provider);

  console.log("=== USDC Vault ===");
  console.log("Decimals:", await usdcVault.decimals());
  console.log("Total Assets:", await usdcVault.totalAssets());
  console.log("Total Supply:", await usdcVault.totalSupply());

  console.log("\n=== EURC Vault ===");
  console.log("Decimals:", await eurcVault.decimals());
  console.log("Total Assets:", await eurcVault.totalAssets());
  console.log("Total Supply:", await eurcVault.totalSupply());
}
main();
