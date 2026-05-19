const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// Define directories
const contractPath = path.resolve('contracts', 'JanusVault.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Custom resolver for solc imports
function findImports(importPath) {
  try {
    if (importPath.startsWith('@openzeppelin/')) {
      const filePath = path.resolve('node_modules', importPath);
      return { contents: fs.readFileSync(filePath, 'utf8') };
    }
  } catch (err) {
    return { error: 'File not found: ' + importPath };
  }
  return { error: 'File not found' };
}

console.log('Compiling Solidity contract with solc...');
const input = {
  language: 'Solidity',
  sources: {
    'JanusVault.sol': {
      content: source
    }
  },
  settings: {
    evmVersion: 'cancun',
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  const errors = output.errors.filter(err => err.severity === 'error');
  if (errors.length > 0) {
    console.error('Compilation failed:');
    console.error(errors);
    process.exit(1);
  }
}

const contract = output.contracts['JanusVault.sol']['JanusVault'];
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

console.log('Solidity compilation successful!');

// Deploy contract using Viem
const PRIVATE_KEY = '0x97c0670e27a58e7da4b55a8c6dfdd2a7ec92cb97f4c174605a857213ff05ee40';
const account = privateKeyToAccount(PRIVATE_KEY);

const rpcUrl = 'https://rpc.testnet.arc.network';
console.log(`Connecting to Arc Testnet via RPC: ${rpcUrl}`);

const publicClient = createPublicClient({
  transport: http(rpcUrl)
});

const walletClient = createWalletClient({
  account,
  transport: http(rpcUrl)
});

async function deploy() {
  console.log(`Deploying JanusVault using deployer address: ${account.address}`);
  
  // Verify deployer has balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer Wallet Balance: ${parseFloat(balance.toString()) / 1e6} USDC`);

  console.log('Sending deployment transaction...');
  const hash = await walletClient.deployContract({
    abi,
    bytecode: `0x${bytecode}`,
    args: [
      '0x3600000000000000000000000000000000000000', // Underlying asset (Arc USDC)
      account.address // Initial Keeper address
    ]
  });

  console.log(`Transaction submitted with hash: ${hash}`);
  console.log('Waiting for sub-second deterministic block finalization...');
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const deployedAddress = receipt.contractAddress;

  console.log(`\n🎉 SUCCESS! JanusVault deployed to Arc Testnet!`);
  console.log(`Vault Address: ${deployedAddress}`);

  // Automatically update constants.ts
  const constantsPath = path.resolve('lib', 'constants.ts');
  let constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  constantsContent = constantsContent.replace(
    /export const VAULT_ADDRESS = '0x[0-9a-fA-F]{40}'/g,
    `export const VAULT_ADDRESS = '${deployedAddress}'`
  );

  fs.writeFileSync(constantsPath, constantsContent, 'utf8');
  console.log(`Updated lib/constants.ts with new Vault Address!`);
}

deploy().catch(console.error);
