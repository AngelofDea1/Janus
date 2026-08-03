import "@nomicfoundation/hardhat-ethers";export default {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    arcTestnet: {
      url: "https://rpc.testnet.arc.network",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"] // standard test key
    }
  }
};
