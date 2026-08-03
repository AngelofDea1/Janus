require('dotenv').config();
const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");

const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const ARC_USDC = "0x3600000000000000000000000000000000000000";
const AMOUNT = "9000000"; // 9 USDC (6 decimals)

async function deposit() {
  console.log(`Approving ${AMOUNT} USDC for vault...`);
  const approveRes = await circleDeveloperSdk.createContractExecutionTransaction({
    walletId: process.env.WALLET_ID,
    abiFunctionSignature: "approve(address,uint256)",
    abiParameters: [process.env.CONTRACT_ADDRESS, AMOUNT],
    contractAddress: ARC_USDC,
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  console.log("Approve TX INITIATED:", approveRes.data?.id);
  
  console.log("Waiting 15 seconds for approval to mine on Arc Testnet...");
  await new Promise(r => setTimeout(r, 15000));
  
  console.log("Depositing into Vault...");
  const depositRes = await circleDeveloperSdk.createContractExecutionTransaction({
    walletId: process.env.WALLET_ID,
    abiFunctionSignature: "deposit(uint256,address)",
    abiParameters: [AMOUNT, process.env.WALLET_ADDRESS],
    contractAddress: process.env.CONTRACT_ADDRESS,
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
  });
  console.log("Deposit TX INITIATED:", depositRes.data?.id);
}

deposit().catch(console.error);
