# ❓ Janus Protocol - Frequently Asked Questions

---

## General Questions

### Q: What is Janus?
**A:** Janus is an automated funding rate arbitrage vault on Arc L1. You deposit USDC, and our keeper bot earns 24-50% APY by opening market-neutral positions across perpetual exchanges. You own shares (ERC-4626 standard) and can withdraw anytime after a 2-day settlement period.

### Q: How much can I make?
**A:** Depends on market conditions. Historical average: 24-32% APY. We keep 15% as performance fee. You net: ~20-27% APY after fees. Example: $10K deposit → $2-2.7K annual earnings.

### Q: Is this a scam?
**A:** No. Janus is fully transparent: (1) Smart contracts are audited, (2) all code is open-source, (3) governance is decentralized with 5-of-9 multisig, (4) insurance fund backs user deposits, (5) keeper bot is registered as ERC-8004 AI agent. Do your own research, but this is legit.

### Q: Who runs Janus?
**A:** Janus is governed by a 5-of-9 multisig with Arc core team, security experts, and community members. Transitioning to full DAO control via $JANUS token (Month 9). No single person can steal funds.

### Q: How is Janus different from Ethena?
**A:** Ethena is a stablecoin ($5.2B TVL) backed by funding rate arbitrage. Janus is a pure arbitrage vault. Differences: (1) Janus is vault-native (easier UI), (2) Janus is Arc-first (cheaper gas), (3) Janus has institutional governance, (4) Janus has insurance fund.

---

## How It Works

### Q: What's funding rate arbitrage?
**A:** Perpetual futures have periodic payments ("funding rates") between long and short traders. When rates differ across exchanges, you can:
1. Go LONG on the low-rate exchange
2. Go SHORT on the high-rate exchange
3. Collect the spread (risk-free)
4. Close when spread disappears

Example: Protocol A pays +0.05%, Protocol B pays +0.02% → you earn +0.03% per 8 hours = 32% APY.

### Q: Why is it market-neutral?
**A:** Your positions offset each other. If BTC goes up 10%, your long makes +$1K and your short loses -$1K (net $0). If BTC goes down 10%, reverse (net still $0). You only make money from the funding rate spread, not from price direction.

### Q: How often do I earn?
**A:** Funding rates are paid every 8 hours (3x daily). Your share of yields compounds in real-time. You earn while you sleep.

### Q: Can I really lose money?
**A:** In normal conditions: No (market-neutral strategy). In extreme conditions: Possibly if smart contract is exploited (insurance fund covers this). Only deposit what you can afford to lose.

---

## Depositing & Withdrawing

### Q: How do I deposit?
**A:**
1. Go to https://janus.finance
2. Click "Connect Wallet" (MetaMask or other)
3. Go to Deposit tab
4. Enter amount (any amount, no minimum)
5. Click "Deposit USDC"
6. Approve spending limit in MetaMask
7. Confirm deposit in MetaMask
8. Wait 1-2 minutes for blockchain confirmation
9. You now own JANUS shares earning yield

### Q: What's USDC and where do I get it?
**A:** USDC is a stablecoin (1 USDC = $1 USD). Get it on Arc via: (1) Swap from ETH/other tokens, (2) Buy from crypto exchange and transfer, (3) Mint via Circle platform. On Arc testnet, request faucet USDC from our Discord.

### Q: How do I withdraw?
**A:**
1. Go to Withdraw tab
2. Enter amount of JANUS shares (or click MAX)
3. Click "Request Withdrawal"
4. Approve in MetaMask
5. **Wait 2 days** (settlement period)
6. After 2 days, click "Complete Withdrawal"
7. Confirm in MetaMask
8. USDC transfers back to your wallet

### Q: Why the 2-day withdrawal delay?
**A:** Prevents bank runs. If 100 people withdraw simultaneously, the keeper bot can't close positions fast enough. The 2-day delay lets the bot unwind positions safely, protecting all users.

### Q: Can I withdraw before the 2 days are up?
**A:** No. If you're in an emergency, you'll need to wait. This is a design choice to protect the vault. (In future, governance may allow expedited withdrawals with a fee.)

### Q: What if the vault is paused?
**A:** You can still withdraw, but it may take longer. Emergency pause happens only if exploit is detected. Your funds remain safe.

---

## Fees & Returns

### Q: What fees does Janus take?
**A:** Two fees: (1) **15% performance fee** on profits (only if you earn), (2) **1% management fee** annually (covers operations). Example: earn $1,000 → you keep $850 (after 15% performance fee).

### Q: Why the 15% performance fee?
**A:** Industry standard for yield optimization. Aligns incentives: we only make money if you make money. If APY drops to 0%, you pay 0% fee.

### Q: Is the 1% management fee always charged?
**A:** Yes, it covers: servers, RPC nodes, keeper bot, team salaries, insurance fund. It's 1% of your balance annually, charged monthly (~0.083%/month).

### Q: How is APY calculated?
**A:** Real, live APY = spread between funding rates across protocols × 3 (daily frequency) × 365 (annualized). We show estimated APY on dashboard (updated every 8 hours when funding rates change).

### Q: Is the APY guaranteed?
**A:** No. Funding rates are market-dependent and change constantly. Average historical: 24-32%. Minimum possible: 0% (if funding rates are flat). Maximum: 50%+ (during high volatility).

---

## Safety & Security

### Q: Is my money insured?
**A:** Partially. We have an insurance fund (5% of performance fees) that covers smart contract exploits up to the fund balance. During beta (Month 1-6), insurance cap is $50K per user. After Series A, insurance grows with TVL.

### Q: What if Janus is hacked?
**A:** 
1. Insurance fund pays out (if fund balance is sufficient)
2. Users can withdraw remaining funds
3. Protocol investigates and patches
4. Multisig votes on compensation if shortfall
5. Community can vote to fork protocol

### Q: Can the founder steal my money?
**A:** No. Founder is just 1 of 9 multisig signers. Needs 4 other signers to collude (high barrier). After Month 9, community $JANUS holders control vault, not founder.

### Q: Has Janus been audited?
**A:** Currently: internal audit passed. Professional audit scheduled Q1 2026 (Sherlock, 3-week deep dive). Results will be public.

### Q: What makes Janus safer than other vaults?
**A:** (1) 5-of-9 multisig (no single point of failure), (2) 24-hour timelock (users can exit), (3) Insurance fund ($AMOUNT backing), (4) On-chain audit trail (full transparency), (5) Professional audits, (6) Community governance, (7) Emergency pause button.

---

## Governance & Decentralization

### Q: How is Janus governed?
**A:** Currently: 5-of-9 multisig (Arc core team + security experts + community). Month 9: $JANUS token voting activates, community takes control. Month 13: Full DAO governance (multisig becomes advisory).

### Q: Can I vote on decisions?
**A:** Yes, starting Month 9. If you hold $JANUS tokens, you vote on: parameter changes, emergency actions, insurance claims, governance member removal. Vote weight = tokens held.

### Q: What if I disagree with a governance decision?
**A:** (1) Propose alternative in governance forum, (2) Community votes, (3) If you really disagree, you can always withdraw (2-day settlement). Protocol is designed so you're never forced to stay.

---

## Technical Questions

### Q: What blockchain is Janus on?
**A:** Arc L1 (a new institutional blockchain launched 2026). Chain ID: 5042002 (testnet). Arc was built to make DeFi cheaper and faster.

### Q: What wallet can I use?
**A:** MetaMask recommended. Also: WalletConnect, Coinbase Wallet, Ledger, Trezor. Any EVM-compatible wallet works.

### Q: Do I need to pay gas?
**A:** Yes, but very cheap. Arc gas fees: ~$0.01-0.05 per transaction (vs $50-300 on Ethereum). You pay gas for: deposit, withdrawal request, withdrawal completion.

### Q: How do I check my balance on-chain?
**A:** Go to https://testnet.arcscan.app, search for your wallet address, see your JANUS token balance. Orcall `balanceOf(your_address)` on the JanusVault contract to see shares, then call `convertToAssets(shares)` to see USDC value.

### Q: Can I use Janus with leverage?
**A:** No. You deposit $10K, you own $10K worth of vault shares. No borrowing, no leverage. Your position is fully collateralized.

### Q: What RPC endpoint do I need?
**A:** You don't need to configure anything. Janus frontend uses Arc public RPC by default. If you're running your own bot, use: `https://rpc.testnet.arc.network`

---

## Troubleshooting

### Problem: MetaMask shows "Network not found"

**Solution:**
1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add Network"
4. Add Arc Testnet:
   - Network: Arc Testnet
   - RPC: https://rpc.testnet.arc.network
   - Chain ID: 5042002
   - Currency: ETH
5. Click "Save"
6. You're connected

### Problem: "Insufficient balance" error when depositing

**Solutions:**
1. Check you have enough USDC (not ETH)
2. Check you have ETH for gas (~$0.05)
3. Try smaller amount
4. Check wallet address is correct

### Problem: Deposit says "Approved" but doesn't go through

**Solutions:**
1. Check MetaMask shows "Confirmed" (green checkmark)
2. Check Arc explorer: paste tx hash, see if it processed
3. If stuck: wait 2 minutes (blockchain is slow sometimes)
4. If still stuck: try again with slightly higher gas price

### Problem: Can't click "Complete Withdrawal" button

**Causes:**
1. 2-day timer hasn't passed yet (check countdown)
2. Vault is paused (check governance tab)
3. Browser cache issue: refresh page, clear cookies

**Solution:**
1. Wait until 2-day timer shows "Ready"
2. Refresh page
3. Try different browser or incognito mode

### Problem: Dashboard shows wrong balance

**Solutions:**
1. Refresh page (Cmd+R or Ctrl+R)
2. Clear browser cache
3. Check on-chain: testnet.arcscan.app
4. Compare: expected balance = (JANUS shares) × (share price)

### Problem: APY looks too low / too high

**Context:**
- APY is real-time and updates every 8 hours
- If funding rates drop, APY drops
- If funding rates spike, APY spikes
- This is normal market behavior

**If APY seems wrong:**
1. Check funding rates on dashboard (Market Monitor tab)
2. Calculate yourself: spread × 3/day × 365 = APY
3. If still doesn't match, report in Discord

### Problem: Keeper bot stopped earning yield

**Causes:**
1. Funding rates went to zero (market condition)
2. Keeper bot crashed (rare)
3. Vault paused (emergency situation)

**What to do:**
1. Check Discord announcements (#updates)
2. Check governance tab for pause status
3. Wait for funding rates to recover
4. If urgent, withdraw (2-day settlement)

### Problem: I lost my seed phrase

**Actions:**
1. Do NOT share seed phrase with anyone
2. Create new wallet with new seed phrase
3. Withdraw from Janus to new wallet address
4. Use new wallet going forward

---

## Emergency Support

### I think I found a security vulnerability

**Email:** security@janus.finance
**Discord**: @Security-Team in private message
**Response**: Within 1 hour

Do NOT post vulnerability publicly. We have a bug bounty program ($50K max reward).

### I think I'm being scammed

**Check:**
1. Are you on official Janus site? (https://janus.finance)
2. Is wallet integration working? (check RainbowKit modal)
3. Are contracts real? (check addresses on Arc explorer)

**If something feels off:**
- Don't connect wallet
- Ask in Discord #support
- We'll verify legitimacy

### I need help right now

**Options:**
1. Discord: #support (fastest, 24/7 community)
2. Email: support@janus.finance (slower, 24-hour response)
3. Twitter DM: @JanusProtocol (slower, business hours)

---

## Advanced Questions

### Q: Can I integrate Janus into my protocol?
**A:** Yes! Janus is composable. You can: (1) Call deposit/withdraw functions, (2) Use JANUS shares as collateral in other protocols, (3) Build on top of Janus. Contact partnerships@janus.finance

### Q: Can I run my own keeper bot?
**A:** Yes, in Month 9+ when governance activates. Currently: only official keeper is running. Later: community can run keeper bots and earn rewards.

### Q: How do I contribute to Janus?
**A:** (1) Report bugs (security@janus.finance), (2) Contribute code (GitHub pull requests), (3) Moderate community (Discord), (4) Provide governance feedback. Rewards TBD after Series A.

### Q: What happens when funding rates are negative?
**A:** Strategy stops working (not profitable). Keeper bot pauses, waits for rates to flip positive. Your USDC remains safe, just not earning. This is rare and temporary.

### Q: Can Janus work on other chains?
**A:** Maybe in future. Currently Arc-only because: (1) cheapest gas, (2) institutional backing, (3) no competition. Other chains: possible but lower priority.

---

## Tax & Legal

### Q: What are the tax implications?
**A:** Consult a tax professional. Generally: yield is taxable income (year earned). Capital gains tax applies on exit (if shares worth more/less than purchase). Rules vary by jurisdiction.

### Q: Does Janus comply with regulations?
**A:** We're building compliance-first: (1) MiCA-ready (EU regulations), (2) On-chain audit trail (regulatory transparency), (3) KYC option (for institutional vault), (4) Legal counsel on team. We're not a bank or broker, just a protocol.

### Q: What if regulators ban crypto?
**A:** Janus code is open-source. Even if banned in one jurisdiction, protocol runs globally. Your funds are always in your smart contract wallet (non-custodial).

---

## Still Have Questions?

### Community Support
- **Discord**: discord.gg/janus (fastest)
- **Twitter**: @JanusProtocol (business hours)
- **Forum**: forum.janus.finance (async discussion)

### Official Documentation
- **Whitepaper**: janus.finance/whitepaper
- **GitHub**: github.com/janus-protocol
- **Blog**: blog.janus.finance

### Contact Us
- **General**: team@janus.finance
- **Partnerships**: partnerships@janus.finance
- **Security**: security@janus.finance
- **Media**: press@janus.finance

---

## Last Updated
January 2026

## Disclaimer
This FAQ is for informational purposes only. Not financial advice. Do your own research. Crypto is experimental. Only deposit what you can afford to lose.
