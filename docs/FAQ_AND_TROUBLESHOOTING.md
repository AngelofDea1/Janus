# Janus Protocol — Frequently Asked Questions

---

## General Questions

### Q: What is Janus?
**A:** Janus is an automated funding rate arbitrage vault on Arc L1. You deposit USDC or EURC, and our keeper bot earns yield by opening market-neutral positions across perpetual exchanges. You own vault tokens (jUSDC/jEURC, ERC-4626 standard) and can withdraw anytime after a 2-day settlement period.

### Q: How much can I earn?
**A:** Depends on market conditions. Historical average: 24–32% APY. Janus takes a 15% performance fee on profits only. Your net is approximately 20–27% APY after fees. Example: $10,000 deposit → ~$2,000–2,700 annual earnings.

### Q: Who governs Janus?
**A:** Janus is governed by a 5-of-9 multisig with Arc core team members, security experts, and community representatives. No single person can unilaterally move funds. Governance is transitioning toward community control as the protocol matures.

---

## How It Works

### Q: What is funding rate arbitrage?
**A:** Perpetual futures have periodic payments ("funding rates") between long and short traders. When rates differ across exchanges, you can:
1. Go LONG on the low-rate exchange
2. Go SHORT on the high-rate exchange
3. Collect the spread (market-neutral)
4. Close when the spread disappears

Example: Protocol A pays +0.05%, Protocol B pays +0.02% → you earn +0.03% per 8 hours = ~32% APY.

### Q: Why is the strategy market-neutral?
**A:** Your positions offset each other. If BTC goes up 10%, your long makes +$1K and your short loses -$1K (net $0). You only make money from the funding rate spread, not from price direction.

### Q: How often do I earn?
**A:** Funding rates are paid every 8 hours (3× daily). Your share of yield compounds in real-time. You earn continuously.

### Q: Can I lose money?
**A:** In normal conditions: No (market-neutral strategy). In extreme conditions: Possibly, if the smart contract is exploited. The insurance fund helps cover this. Only deposit what you can afford to lose.

---

## Depositing & Withdrawing

### Q: How do I deposit?
**A:**
1. Go to [janushq.xyz](https://janushq.xyz)
2. Click "Connect Wallet"
3. Go to the Deposit tab
4. Enter your amount (no minimum)
5. Click "Approve USDC" — confirm in your wallet
6. Click "Deposit" — confirm in your wallet
7. Wait 1–2 minutes for blockchain confirmation
8. You now own jUSDC/jEURC vault tokens earning yield

### Q: What is USDC and where do I get it?
**A:** USDC is a stablecoin (1 USDC = $1 USD). On Arc Testnet, you can claim free test tokens from the [Circle Faucet](https://faucet.circle.com/) — select Arc Testnet, paste your wallet address, and click Send.

### Q: How do I withdraw?
**A:**
1. Go to the Withdraw tab
2. Enter your shares amount (or click MAX)
3. Click "Request Withdrawal" and confirm in your wallet
4. **Wait 2 days** (settlement period)
5. After 2 days, click "Complete Withdrawal" and confirm
6. USDC/EURC transfers back to your wallet

### Q: Why the 2-day withdrawal delay?
**A:** Prevents bank runs. If many users withdraw simultaneously, the keeper bot needs time to unwind positions safely — protecting everyone's funds.

### Q: Can I withdraw before 2 days are up?
**A:** No. This is a deliberate safety mechanism. Plan your withdrawals accordingly.

### Q: What if the vault is paused?
**A:** You can still withdraw, but processing may take longer. Emergency pauses only happen if an exploit is detected. Your funds remain in the smart contract at all times.

---

## Fees & Returns

### Q: What fees does Janus take?
**A:** Two fees:
- **15% performance fee** — only on profits (if you earn $1,000, you keep $850)
- **1% management fee** — annually, covers operations (~0.083%/month)

### Q: Is the APY guaranteed?
**A:** No. Funding rates are market-dependent and change constantly. Historical range: 24–50%. Minimum possible: 0% if rates are flat. We show live APY on the dashboard, updated every 8 hours.

---

## Safety & Security

### Q: Is my money insured?
**A:** Partially. We maintain an insurance fund (funded by 5% of performance fees) that covers smart contract exploits up to the fund balance. This is not a guarantee of full coverage — DeFi is experimental.

### Q: What if Janus is hacked?
**A:**
1. Insurance fund pays out (up to fund balance)
2. Users can withdraw remaining funds
3. Multisig investigates and patches
4. Community can vote on compensation if there is a shortfall

### Q: Has Janus been audited?
**A:** Internal audit has been completed. A professional third-party audit is in progress. Results will be published publicly when complete.

### Q: What makes Janus safer than other vaults?
**A:** (1) 5-of-9 multisig — no single point of failure, (2) 24-hour timelock on all parameter changes, (3) Insurance fund, (4) On-chain audit trail — full transparency, (5) Emergency pause functionality.

---

## Governance & Decentralization

### Q: How is Janus governed?
**A:** Currently via a 5-of-9 multisig (Arc core team + security experts + community members). Governance will progressively decentralize toward community token-holder control as the protocol grows.

### Q: What if I disagree with a governance decision?
**A:** You can propose alternatives in our Discord governance channel, or simply withdraw your funds (2-day settlement). You are never locked in.

---

## Technical Questions

### Q: What blockchain is Janus on?
**A:** Arc L1 (Chain ID: 5042002 on testnet). Arc is an institutional EVM-compatible blockchain with cheap gas and fast finality.

### Q: What wallet can I use?
**A:** Any EVM-compatible wallet — MetaMask, Rabby, Phantom, OKX Wallet, Coinbase Wallet, WalletConnect, Ledger, Trezor.

### Q: How much does gas cost?
**A:** Arc gas fees are approximately $0.01–0.05 per transaction — far cheaper than Ethereum mainnet.

### Q: How do I verify my balance on-chain?
**A:** Go to [testnet.arcscan.app](https://testnet.arcscan.app), search your wallet address, and check your jUSDC/jEURC token balance. Or call `balanceOf(your_address)` on the JanusVault contract, then `convertToAssets(shares)` to see your USDC value.

### Q: Can I use Janus with leverage?
**A:** No. You deposit $10K and own $10K worth of vault shares. No borrowing, no leverage. Fully collateralized.

---

## Troubleshooting

### Problem: Wallet shows "Network not found"
**Solution:**
1. Open your wallet → Network dropdown → Add Network
2. Add Arc Testnet:
   - Network: Arc Testnet
   - RPC: https://rpc.testnet.arc.network
   - Chain ID: 5042002
   - Currency: ETH
3. Save and switch to Arc Testnet

### Problem: "Insufficient balance" when depositing
**Check:**
1. You have enough USDC (not ETH) in your wallet
2. You have a small amount of ETH for gas (~$0.05)
3. Try a smaller deposit amount

### Problem: Approval goes through but deposit doesn't
**Steps:**
1. Confirm the approval transaction shows "Confirmed" in your wallet history
2. Check [testnet.arcscan.app](https://testnet.arcscan.app) for your transaction hash
3. Wait 2 minutes — the network may be processing
4. Try submitting the deposit again

### Problem: Can't click "Complete Withdrawal"
**Causes:**
1. The 2-day timer hasn't elapsed yet (check the countdown)
2. The vault is paused (check Governance tab)
3. Browser cache — try a hard refresh or incognito mode

### Problem: Dashboard shows wrong balance
**Steps:**
1. Hard refresh the page (Cmd+Shift+R)
2. Verify on-chain at [testnet.arcscan.app](https://testnet.arcscan.app)
3. Expected balance = jUSDC/jEURC shares × current share price

### Problem: APY looks wrong
**Context:** APY updates every 8 hours with live funding rates. Fluctuations are normal. Check the Market Monitor tab for current funding rate data. If you believe there is a bug, report it in Discord.

---

## Advanced Questions

### Q: Can I integrate Janus into my protocol?
**A:** Yes — Janus is ERC-4626 composable. You can call deposit/withdraw functions directly, or use jUSDC/jEURC as collateral in other protocols. Contact partnerships@janushq.xyz.

### Q: What happens when funding rates are negative?
**A:** The strategy pauses. The keeper bot waits for rates to flip positive. Your USDC stays safe in the vault — just not earning yield during that period.

---

## Tax & Legal

### Q: What are the tax implications?
**A:** Consult a tax professional in your jurisdiction. Generally, yield is treated as taxable income. Gains or losses on exit may be taxable events. Janus is not financial or tax advice.

### Q: Does Janus comply with regulations?
**A:** Janus is a non-custodial DeFi protocol. Your funds are always in a smart contract wallet, not held by any company. We actively monitor regulatory developments and build with compliance in mind.

---

## Support

- **Discord**: [discord.gg/23skEWUbbk](https://discord.gg/23skEWUbbk) — fastest response
- **Twitter**: [@janusprotocol_](https://x.com/janusprotocol_)
- **Email**: support@janushq.xyz
- **Security reports**: security@janushq.xyz (do NOT post vulnerabilities publicly — we have a bug bounty program)

---

*Last Updated: June 2026*

*This FAQ is for informational purposes only. Not financial advice. Crypto is experimental. Only deposit what you can afford to lose.*
