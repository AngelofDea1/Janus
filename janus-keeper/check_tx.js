require('dotenv').config();
const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");

const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  try {
    const res = await circleDeveloperSdk.getTransaction({
      id: "0d5209ab-663e-5add-8669-2496e756db9d"
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}
main();
