const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");
require("dotenv").config();

async function main() {
  const client = initiateDeveloperControlledWalletsClient({ 
    apiKey: process.env.CIRCLE_API_KEY, 
    entitySecret: process.env.CIRCLE_ENTITY_SECRET 
  });

  // Check the most recent harvest transaction
  const txId = "91c82d3e-d0e4-5aae-9232-0c924c49346b";
  try {
    const result = await client.getTransaction({ id: txId });
    console.log("TX Status:", JSON.stringify(result.data, null, 2));
  } catch(e) {
    console.error("Error:", e.response?.data || e.message);
  }
}
main();
