import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Starting full system deployment with account:", deployer.address);

  const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

  // 1. Deploy MultiSig (5-of-9)
  console.log("Deploying MultiSig...");
  const signers = [
    deployer.address,
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003",
    "0x0000000000000000000000000000000000000004",
    "0x0000000000000000000000000000000000000005",
    "0x0000000000000000000000000000000000000006",
    "0x0000000000000000000000000000000000000007",
    "0x0000000000000000000000000000000000000008",
  ];
  const MultiSig = await ethers.getContractFactory("JanusMultiSig");
  const multiSig = await MultiSig.deploy(signers);
  await multiSig.waitForDeployment();
  const multiSigAddress = await multiSig.getAddress();
  console.log(`MultiSig deployed to: ${multiSigAddress}`);

  // 2. Deploy Insurance Fund
  console.log("Deploying Insurance Fund...");
  const InsuranceFund = await ethers.getContractFactory("JanusInsuranceFund");
  const insuranceFund = await InsuranceFund.deploy(USDC_ADDRESS, deployer.address); // temp vault
  await insuranceFund.waitForDeployment();
  const insuranceFundAddress = await insuranceFund.getAddress();
  console.log(`Insurance Fund deployed to: ${insuranceFundAddress}`);

  // 3. Deploy JanusVault
  console.log("Deploying JanusVault...");
  const Vault = await ethers.getContractFactory("JanusVault");
  const vault = await Vault.deploy(
    USDC_ADDRESS,
    deployer.address, // keeper
    multiSigAddress,  // properly deployed multisig!
    insuranceFundAddress
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`JanusVault deployed to: ${vaultAddress}`);

  // Update lib/constants.ts
  const constantsPath = path.resolve("lib", "constants.ts");
  let content = fs.readFileSync(constantsPath, "utf8");

  content = content.replace(
    /export const VAULT_ADDRESS = '0x[0-9a-fA-F]{40}'/g,
    `export const VAULT_ADDRESS = '${vaultAddress}'`
  );

  content = content.replace(
    /export const MULTISIG_ADDRESS = '0x[0-9a-fA-F]{40}'/g,
    `export const MULTISIG_ADDRESS = '${multiSigAddress}'`
  );

  content = content.replace(
    /export const INSURANCE_FUND_ADDRESS = '0x[0-9a-fA-F]{40}'/g,
    `export const INSURANCE_FUND_ADDRESS = '${insuranceFundAddress}'`
  );

  fs.writeFileSync(constantsPath, content, "utf8");
  console.log("\n🎉 ALL CONTRACTS SUCCESSFULLY REDEPLOYED AND CONSTANTS.TS UPDATED!");
}

main().catch(console.error);
