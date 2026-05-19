const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Janus Vault with account:", deployer.address);

  const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
  const MULTISIG_ADDRESS = "0xc8d77a0bf435ec92a4e21dae6c2789bd0bcf00e1";
  const INSURANCE_FUND_ADDRESS = "0x2500c4e08de98a87f930abefeafdd5d253a753f";
  const KEEPER_ADDRESS = deployer.address;

  const Vault = await ethers.getContractFactory("JanusVault");
  const vault = await Vault.deploy(
    USDC_ADDRESS,
    KEEPER_ADDRESS,
    MULTISIG_ADDRESS,
    INSURANCE_FUND_ADDRESS
  );

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  
  console.log("\n✅ THE REAL DEAL DEPLOYED!");
  console.log(`Janus Vault Address: ${vaultAddress}`);
}

main().catch(console.error);
