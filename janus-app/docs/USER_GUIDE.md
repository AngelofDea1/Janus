# Janus User Guide

## Getting Started

### Step 1: Set Up Your Wallet

1. Install an EVM-compatible wallet, with MetaMask, Rabby, or Phantom recommended
2. Add the Arc Testnet network:
   - **Network Name:** Arc Testnet
   - **RPC URL:** `https://rpc.testnet.arc.network`
   - **Chain ID:** `5042002`
   - **Currency Symbol:** ETH
3. Get testnet tokens:
   - **USDC/EURC:** Claim free tokens from the [Circle Faucet](https://faucet.circle.com/): select Arc Testnet and paste your wallet address
   - **ETH (for gas):** Visit the Arc Testnet faucet or ask in Discord

### Step 2: Connect to Janus

1. Go to [janushq.xyz](https://janushq.xyz)
2. Click **Connect** in the top navigation
3. Select your wallet from the list
4. Approve the network switch to Arc Testnet when prompted
5. You're connected


## Depositing

### Step 1: Approve Token Spending

1. Navigate to the **Trade** page
2. Select your asset (USDC or EURC) from the dropdown
3. Enter the amount you want to deposit
4. Click **Approve USDC** (or EURC)
5. Your wallet will open: click **Confirm**
6. Wait for the approval transaction to confirm (~30 seconds)

*This step gives the vault permission to receive your tokens. It only needs to be done once per token.*

### Step 2: Deposit

1. After approval confirms, click **Deposit**
2. Your wallet will open: click **Confirm**
3. Wait for the transaction to confirm (~1–2 minutes)
4. Your dashboard will update showing your vault balance (jUSDC or jEURC)

**What happens:**
- Your USDC/EURC is transferred to the vault
- You receive vault tokens (jUSDC or jEURC) representing your share
- Yield begins compounding automatically


## Understanding Your Dashboard

### TVL (Total Value Locked)
Total assets deposited across the vault. Higher TVL means more capital available for arbitrage and better spread capture.

### Live APY
Current annualised yield estimate, updated every 8 hours when funding rates change. This reflects real market conditions — it fluctuates.

### Your Balance
Your current USDC/EURC value in the vault. Equals your vault tokens × current share price. Grows as yield compounds.

### Your Shares
The jUSDC or jEURC tokens you hold, representing your ownership percentage of the vault. Used when withdrawing.

### Est. Daily / Est. Monthly
Project earnings based on the current APY and your balance. These are estimates — actual returns depend on market conditions.


## Withdrawing

### Step 1: Request Withdrawal

1. Switch to the **Withdraw** tab on the Trade page
2. Enter the number of shares to redeem (or click **Max**)
3. Click **Withdraw**
4. Confirm in your wallet
5. Your withdrawal is now queued

### Step 2: Wait 2 Days

- A countdown timer shows when your withdrawal will be ready
- You cannot complete the withdrawal during this period
- This delay protects all vault users by giving the keeper bot time to safely unwind positions

### Step 3: Complete Withdrawal

1. After the 2-day timer, return to the Withdraw tab
2. Click **Complete Withdrawal**
3. Confirm in your wallet
4. USDC/EURC is transferred back to your wallet
5. Your jUSDC/jEURC vault tokens are burned


## Checking Your Earnings

### Method 1: Dashboard
Your balance updates in real-time. Profit = Current Balance − Initial Deposit.

### Method 2: On-Chain
1. Go to [testnet.arcscan.app](https://testnet.arcscan.app)
2. Search your wallet address
3. Find your jUSDC or jEURC token balance
4. Call `convertToAssets(balance)` on the vault contract to see the USDC equivalent

### Method 3: Governance Tab → Audit Trail
Search your address to see a full history of your deposits, withdrawals, and yield events.


## Governance & Safety

### Governance Tab
- View multisig status (5-of-9 required for any critical change)
- View timelock status and countdown (24-hour delay before changes take effect)
- View insurance fund balance

### Insurance Fund
- Funded by 5% of all performance fees
- Covers smart contract exploits up to the available fund balance
- Balance is shown on the Governance tab

### Audit Trail
- Every vault action is logged on-chain permanently
- Verifiable by anyone on [testnet.arcscan.app](https://testnet.arcscan.app)


## Troubleshooting

### Wallet won't connect
1. Confirm Arc Testnet is added with the correct RPC and Chain ID
2. Switch your wallet's active network to Arc Testnet manually
3. Hard-refresh the page (`Cmd+Shift+R`)
4. Try a different browser or incognito mode

### Deposit fails
1. Make sure you have ETH in your wallet for gas (~$0.05 worth)
2. Confirm the approval transaction completed before attempting the deposit
3. Check your USDC/EURC balance is sufficient
4. Try again — occasional RPC timeouts can cause transient failures

### Withdrawal button is greyed out
1. The 2-day timer has not elapsed yet — check the countdown
2. Confirm you submitted a withdrawal request (not just entered an amount)
3. Check the Governance tab to see if the vault is paused

### Balance shows incorrectly
1. Hard-refresh the page
2. Verify on-chain at [testnet.arcscan.app](https://testnet.arcscan.app)
3. Expected value = shares × current share price (call `convertToAssets` on the contract)

### Numbers don't match after a deposit
Block confirmations can take 1–2 minutes on Arc Testnet. Wait a moment and refresh.


## Need Help?

- **Discord**: [discord.gg/23skEWUbbk](https://discord.gg/23skEWUbbk) (fastest support)
- **Twitter**: [@janusprotocol_](https://x.com/janusprotocol_)
- **Email**: support@janushq.xyz
