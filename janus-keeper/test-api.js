const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");
require("dotenv").config();

const PROFIT_THRESHOLD = 0.0005; // 0.05%
async function run() {
  console.log("Checking for opportunities...");
  // just pretend to fetch them to see if it's the Circle SDK failing
  const circleClient = initiateDeveloperControlledWalletsClient({ 
    apiKey: process.env.CIRCLE_API_KEY, 
    entitySecret: process.env.CIRCLE_ENTITY_SECRET 
  });
  console.log("Circle SDK initialized");
  
  try {
      const usdcVault = process.env.CONTRACT_ADDRESS;
      const massiveApproval = "100000000000000"; // 100M
      console.log("Creating tx to approve USDC...");
      const approveUsdc = await circleClient.createContractExecutionTransaction({
        walletId: process.env.WALLET_ID,
        abiFunctionSignature: "approve(address,uint256)",
        abiParameters: [usdcVault, massiveApproval],
        contractAddress: "0x3600000000000000000000000000000000000000",
        fee: { type: "level", config: { feeLevel: "MEDIUM" } }
      });
      console.log("Approve TX ID:", approveUsdc.data?.id);
  } catch (e) {
      console.error("Circle error:", e.response ? e.response.data : e.message);
  }
}
run();
