require('dotenv').config();
const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");

const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  try {
    const approveResponse = await circleDeveloperSdk.createContractExecutionTransaction({
      walletId: process.env.WALLET_ID,
      abiFunctionSignature: "approve(address,uint256)",
      abiParameters: [process.env.CONTRACT_ADDRESS, "1000"],
      contractAddress: "0x3600000000000000000000000000000000000000",
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    });
    console.log("Approve TX INITIATED:", approveResponse.data?.id);
    
    await new Promise(r => setTimeout(r, 10000));
    
    const { ethers } = require('ethers');
    const vaultInterface = new ethers.Interface(["function harvestYield(uint256 amount)"]);
    const harvestCalldata = vaultInterface.encodeFunctionData("harvestYield", ["1"]);
    const memoMetadata = {
      asset: "TEST",
      route: "TEST ➔ TEST",
      volume: "0",
      spread: "1.00"
    };
    const memoDataHex = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(memoMetadata)));
    const memoId = ethers.keccak256(ethers.toUtf8Bytes(`TEST-TEST-${Date.now()}`));

    const harvestResponse = await circleDeveloperSdk.createContractExecutionTransaction({
      walletId: process.env.WALLET_ID,
      abiFunctionSignature: "memo(address,bytes,bytes32,bytes)",
      abiParameters: [
        process.env.CONTRACT_ADDRESS,
        harvestCalldata,
        memoId,
        memoDataHex
      ],
      contractAddress: "0x5294E9927c3306DcBaDb03fe70b92e01cCede505",
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    });
    console.log("Harvest TX INITIATED:", harvestResponse.data?.id);
    
    await new Promise(r => setTimeout(r, 5000));
    
    const res = await circleDeveloperSdk.getTransaction({
      id: harvestResponse.data?.id
    });
    console.log("Status:", res.data?.transaction?.state);
    if(res.data?.transaction?.errorDetails) console.log(res.data.transaction.errorDetails);
    
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}
main();
