const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy Insurance Fund
  const InsuranceFund = await ethers.getContractFactory("JanusInsuranceFund");
  const insuranceFund = await InsuranceFund.deploy(
    "0x3600000000000000000000000000000000000000", // USDC
    "0xc4e08de98a87f930abefeafdd5d253a753f8232f"  // Vault (update with your vault)
  );
  await insuranceFund.waitForDeployment();
  const insuranceFundAddress = await insuranceFund.getAddress();
  console.log("Insurance Fund:", insuranceFundAddress);

  // 2. Deploy MultiSig (5-of-9)
  const signers = [
    "0x0000000000000000000000000000000000000001", // Arc core 1
    "0x0000000000000000000000000000000000000002", // Arc core 2
    "0x0000000000000000000000000000000000000003", // Arc core 3
    "0x0000000000000000000000000000000000000004", // Community 1
    "0x0000000000000000000000000000000000000005", // Community 2
    deployer.address,                             // You
    "0x0000000000000000000000000000000000000007", // Others
    "0x0000000000000000000000000000000000000008",
    "0x0000000000000000000000000000000000000009",
  ];
  const MultiSig = await ethers.getContractFactory("JanusMultiSig");
  const multiSig = await MultiSig.deploy(signers);
  await multiSig.waitForDeployment();
  const multiSigAddress = await multiSig.getAddress();
  console.log("MultiSig:", multiSigAddress);

  // 3. Deploy Timelock
  const Timelock = await ethers.getContractFactory("JanusTimelock");
  const timelock = await Timelock.deploy(
    [multiSigAddress], // proposers
    [deployer.address], // executors
    deployer.address // admin
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("Timelock:", timelockAddress);

  console.log("\n✅ Deployment complete!");
  console.log(`Insurance Fund: ${insuranceFundAddress}`);
  console.log(`MultiSig: ${multiSigAddress}`);
  console.log(`Timelock: ${timelockAddress}`);
}

main().catch(console.error);
