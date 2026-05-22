# Janus User Guide - Step-by-Step

## Getting Started

### Step 1: Prepare Your Wallet

1. Install a Web3 Wallet (e.g. Rabby, Rainbow, MetaMask)
2. Add Arc Testnet network:
 - Network Name: `Arc Testnet`
 - RPC URL: `https://rpc.testnet.arc.network`
 - Chain ID: `5042002`
 - Currency: `ETH`
3. Get testnet funds:
 - ETH (gas): Visit Arc faucet
 - USDC: Request from Janus team or swap ETH

### Step 2: Connect to Janus

1. Go to `https://janus.finance`
2. Click "Connect Wallet"
3. Choose your wallet provider
4. Approve network switch to Arc
5. You're connected!

---

## Depositing USDC

### Step 1: Approve USDC Spending

1. On the dashboard, find "Deposit Amount"
2. Enter amount (e.g., 1000 USDC)
3. Click "Deposit USDC"
4. Web3 Wallet popup: "Approve spending limit"
5. Click "Approve"
6. Wait for transaction (30-60 seconds)

**What's happening:** You're giving the vault permission to transfer your USDC.

### Step 2: Execute Deposit

1. After approval, click "Deposit USDC" again
2. Web3 Wallet popup: "Confirm transaction"
3. Click "Confirm"
4. Wait for blockchain confirmation
5. Dashboard updates with your JANUS shares

**What you get:**
- USDC is transferred to vault
- You receive JANUS shares (ERC-4626 standard)
- Shares represent your vault ownership
- Yield compounds automatically

---

## Understanding Your Dashboard

### TVL (Total Value Locked)
- Total USDC in vault
- Shows vault health
- Larger TVL = more capital for arbitrage = better spread capture

### Current APY
- Annual percentage yield
- Updated every 8 hours (funding rate changes)
- **Net of all fees** (you get this after the 15% performance fee)
- Varies with market conditions

### Your Balance
- Your USDC value in the vault
- = JANUS shares × share price
- Updates as yield compounds

### Your Shares
- JANUS shares you own
- Represents your ownership %
- Used for withdrawals

---

## Withdrawing USDC

### Step 1: Request Withdrawal

1. Go to "Withdraw" section
2. Enter shares amount (or click "MAX")
3. Click "Request Withdrawal"
4. Web3 Wallet popup
5. Click "Confirm"

**Why the delay?** Prevents bank runs, protects other users.

### Step 2: Wait 2 Days

- Withdrawal is queued
- You'll see countdown timer
- Can't withdraw during this period (for vault stability)
- This is intentional safety feature

### Step 3: Complete Withdrawal

1. After 2 days, withdrawal is "ready"
2. Click "Complete Withdrawal"
3. Web3 Wallet popup
4. Click "Confirm"
5. USDC transferred back to your wallet
6. JANUS shares burned

**What you get back:**
- Original USDC + all earned yield
- Less 1% management fee
- Transaction complete

---

## Checking Your Earnings

### Method 1: Dashboard
- Shows "Your Balance" in real-time
- Compares to your initial deposit
- Profit = Current Balance - Initial Deposit

### Method 2: Audit Trail
1. Go to "Governance" tab
2. Click "Audit Trail"
3. Search for your address
4. See all transactions
5. Verify on Arc explorer (testnet.arcscan.app)

### Method 3: On-Chain Verification
1. Get your JANUS balance on-chain
2. Call `balanceOf(your_address)`
3. Call `convertToAssets(balance)`
4. That's your USDC value

---

## Governance & Safety Features

### View Governance Status
1. Go to "Governance" tab
2. See multi-sig status (5-of-9 required)
3. See timelock status (24-hour delays)
4. See insurance fund balance

### Monitor Insurance Fund
- **Total Insured**: How much protection exists
- **Available**: How much can cover claims
- **How it works**: 5% of all performance fees go here
- **Your coverage**: Your deposit is insured up to available balance

### Check Audit Trail
- Every vault action is logged
- Permanent, on-chain record
- Verifiable by anyone
- Proves no unauthorized actions

---

## Common Questions

### Q: Is my money safe?
**A:** Yes, for reasonable amounts. Insurance fund + multisig governance + audit trail + smart contract audit protect you. Not 100% risk-free (DeFi is experimental), but best-in-class safety.

### Q: Why the 2-day withdrawal delay?
**A:** Prevents bank runs that hurt other users. If 100 people withdraw simultaneously, liquidity problems occur. 2-day delay gives keeper time to unwind positions safely.

### Q: What if funding rates go negative?
**A:** Strategy stops working temporarily. Bot pauses, waits for positive rates. Your USDC is safe, just not earning yield.

### Q: Can I lose money?
**A:** In normal conditions: No (market-neutral). In extreme conditions: Possibly (liquidations, smart contract exploits). Insurance fund covers known exploits. Only deposit what you can afford to lose.

### Q: How often do I earn?
**A:** Continuously. Funding rates paid every 8 hours. Yield auto-compounds. You earn even while sleeping.

### Q: Can I withdraw anytime?
**A:** Yes, but with 2-day settlement. Request withdrawal, wait 2 days, complete withdrawal. Emergency: If vault is paused by multisig, longer delays possible.

### Q: What's the tax situation?
**A:** Consult a tax professional. Depends on your jurisdiction. Generally: Yield is taxable income. Gains on exit are taxable events.

### Q: How do I know the APY is real?
**A:** It's live on-chain. Check market monitor for funding rates. Calculate: spread × 3/day × 365 = APY. Verify on Arc explorer.

---

## Troubleshooting

### Wallet Won't Connect
1. Check Arc network is added correctly
2. Switch network dropdown to Arc
3. Refresh page
4. Try different wallet (WalletConnect)

### Deposit Fails
1. Check you have ETH for gas
2. Check you approved USDC first
3. Check USDC balance is sufficient
4. Try again (could be RPC issue)

### Withdrawal Blocked
1. Check 2-day timer hasn't passed
2. Check you requested withdrawal (not just set amount)
3. Check vault isn't paused (governance tab)

### Numbers Don't Match
1. Refresh dashboard
2. Check on-chain balance: `balanceOf(address)`
3. Convert shares to assets: `convertToAssets(shares)`
4. Compare to explorer value

### Need Help?
- Twitter: @JanusProtocol
- Discord: discord.gg/janus
- Email: support@janus.finance
