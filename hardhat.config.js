import "@nomicfoundation/hardhat-ethers";

export default {
  solidity: "0.8.24",
  networks: {
    arcTestnet: {
      type: "http",
      url: "https://rpc.testnet.arc.network",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    }
  }
};
