import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";
import fs from "fs";
import path from "path";

const rpcUrl = "https://rpc.testnet.arc.network";
const provider = new JsonRpcProvider(rpcUrl);

const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new Wallet(PRIVATE_KEY, provider);

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

async function main() {
  console.log("Starting full system deployment via pure Ethers.js with account:", wallet.address);

  // Load artifact JSONs
  const multiSigArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/JanusMultiSig.sol/JanusMultiSig.json", "utf8"));
  const insuranceFundArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/JanusInsuranceFund.sol/JanusInsuranceFund.json", "utf8"));
  const vaultArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/JanusVault.sol/JanusVault.json", "utf8"));

  // 1. Deploy MultiSig (5-of-9)
  console.log("Deploying MultiSig...");
  const signers = [
    wallet.address,
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003",
    "0x0000000000000000000000000000000000000004",
    "0x0000000000000000000000000000000000000005",
    "0x0000000000000000000000000000000000000006",
    "0x0000000000000000000000000000000000000007",
    "0x0000000000000000000000000000000000000008",
  ];
  const MultiSigFactory = new ContractFactory(multiSigArtifact.abi, multiSigArtifact.bytecode, wallet);
  const multiSig = await MultiSigFactory.deploy(signers);
  await multiSig.waitForDeployment();
  const multiSigAddress = await multiSig.getAddress();
  console.log(`MultiSig deployed to: ${multiSigAddress}`);

  // 2. Deploy Insurance Fund
  console.log("Deploying Insurance Fund...");
  const InsuranceFundFactory = new ContractFactory(insuranceFundArtifact.abi, insuranceFundArtifact.bytecode, wallet);
  const insuranceFund = await InsuranceFundFactory.deploy(USDC_ADDRESS, wallet.address); // temp vault
  await insuranceFund.waitForDeployment();
  const insuranceFundAddress = await insuranceFund.getAddress();
  console.log(`Insurance Fund deployed to: ${insuranceFundAddress}`);

  // 3. Deploy JanusVault
  console.log("Deploying JanusVault...");
  const VaultFactory = new ContractFactory(vaultArtifact.abi, vaultArtifact.bytecode, wallet);
  const vault = await VaultFactory.deploy(
    USDC_ADDRESS,
    wallet.address, // keeper
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
