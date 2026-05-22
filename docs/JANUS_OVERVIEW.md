# Janus Protocol - Complete Overview

## What is Janus?

Janus is an **institutional-grade, automated funding rate arbitrage vault** built on the **Arc L1 Network**. It enables users to deposit USDC and earn **24-50% APY** through fully automated, market-neutral trading strategies.

### The Problem We Solve

- **$75 billion** in USDC currently earning only 4% in DeFi
- Funding rate arbitrage generates 20-50% returns, but it's too complex for retail users
- Only sophisticated traders and hedge funds can access this strategy
- Institutional investors need compliance, safety, and transparency

### The Solution: Janus

1. **One-Click Deposits** - Connect wallet, deposit USDC, earn yield automatically
2. **Market-Neutral** - Zero directional risk (BTC up or down doesn't matter)
3. **Fully Automated** - Keeper bot monitors, executes, rebalances 24/7
4. **Institutional-Safe** - 5-of-9 multisig governance, insurance fund, audit trail
5. **Real APY** - 24-50% delivered, not promised

---

## How It Works (Simple)

### The Strategy: Funding Rate Arbitrage

Perpetual futures have "funding rates" - payments between long and short traders that anchor prices to spot.

**Example:**
- Protocol A: +0.05% funding (longs pay shorts)
- Protocol B: +0.02% funding
- **Spread: 0.03%**

**Janus does this:**
1. Opens SHORT on Protocol A (collects 0.05%)
2. Opens LONG on Protocol B (pays 0.02%)
3. Net: +0.03% every 8 hours = 32% APY
4. **Zero directional risk** - doesn't matter if BTC goes up or down

### User Flow

```
User deposits USDC
 
Receives JANUS shares (ERC-4626)
 
Keeper bot finds funding rate spreads
 
Opens market-neutral positions
 
Collects funding payments every 8 hours
 
Yield automatically compounds
 
User can withdraw anytime (2-day settlement)
```

---

## Key Features

### Institutional-Grade Safety

- **5-of-9 Multisig Governance**: Critical decisions require majority approval
- **24-Hour Timelock**: All parameter changes have 24-hour delay for users to exit
- **Insurance Fund**: 5% of performance fees protect against smart contract exploits
- **2-Day Withdrawal Delay**: Settlement period prevents bank runs
- **On-Chain Audit Trail**: Every action logged permanently, verifiable

### Predictive ML Engine

- **Funding Rate Forecasting**: ML model predicts spreads before they widen
- **Multi-Leg Arbitrage**: Captures 3-4 protocol cascading trades, not just 2-leg
- **Dynamic Position Sizing**: Scales with liquidity depth and gas costs
- **Slippage Optimization**: Routes through best liquidity sources

### Real-Time Transparency

- Live TVL, APY, positions on dashboard
- Real funding rate data from Binance, Bybit, Hyperliquid
- Market monitor showing all opportunities
- Governance proposals visible with vote counts

---

## Financial Model

| Metric | Value |
|--------|-------|
| Estimated APY | 24-50% (market dependent) |
| Performance Fee | 15% of profits |
| Management Fee | 1% annual |
| User Net APY | 20-42% after fees |
| Minimum Deposit | No minimum |
| Withdrawal | Anytime (2-day settlement) |
| Vault Cap (Beta) | $10M |

---

## Smart Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| JanusVault | `0x70E5370b8981Abc6e14C91F4AcE823954EFC8eA3` | Main ERC-4626 vault |
| USDC | `0x3600000000000000000000000000000000000000` | Native Arc USDC |
| Governance Timelock | `0x892a0bcf87baee1e390c9b88a8d11cfa98b0f22d` | 24-hour delays |
| 5-of-9 Multisig | `0xc8d77a0bf435ec92a4e21dae6c2789bd0bcf00e1` | Approval voting |
| Insurance Fund | `0x2500c4e08de98a87f930abefeafdd5d253a753f8` | Exploit protection |

---

## Network & Access

- **Blockchain**: Arc L1 Testnet (Chain ID: `5042002`)
- **RPC**: `https://rpc.testnet.arc.network`
- **Explorer**: `https://testnet.arcscan.app`
- **Frontend**: `https://janus.finance` (launching mainnet)
- **Demo**: `http://localhost:3000` (development)

---

## Team & Governance

- **Founder**: Solo builder, technical focus
- **Advisors**: Arc core team, DeFi OGs
- **Governance**: Community-driven via $JANUS token (launching Month 9)
- **Security**: Professional audits + bug bounty program

---

## Roadmap

### Month 1-3: Beta (Testnet)
- [ ] Smart contract audit
- [ ] Beta testing (100 users)
- [ ] Arc grants secured
- [ ] Target: $1M TVL

### Month 4-6: Launch (Mainnet)
- [ ] Deploy to Arc mainnet
- [ ] Public announcement
- [ ] Target: $10M TVL

### Month 7-9: Growth
- [ ] Launch $JANUS token
- [ ] Institutional features
- [ ] Multi-chain expansion
- [ ] Target: $100M TVL

### Month 10-12: Series A
- [ ] Fundraising ($5-10M)
- [ ] Team expansion
- [ ] Global marketing

---

## Risk Disclosure

### Smart Contract Risk
- Contracts are audited but DeFi is experimental
- Only deposit what you can afford to lose
- Insurance fund covers known exploits (not 100% coverage)

### Market Risk
- Funding rates can go to zero (strategy stops working)
- Funding rates can become negative (strategy reverses)
- Extreme volatility can cause liquidations (mitigated by safety parameters)

### Operational Risk
- Keeper bot can fail (mitigated by redundancy + monitoring)
- Protocol parameters can change (24-hour timelock for exits)
- Regulatory changes could affect DeFi (we monitor actively)

---

## Contact & Support

- **Website**: https://janus.finance
- **Twitter**: @JanusProtocol
- **Discord**: discord.gg/janus
- **Email**: team@janus.finance
- **Telegram**: t.me/janusprotocol
- **GitHub**: github.com/janus-protocol

---

## Disclaimer

Janus Protocol is experimental software. Cryptocurrency and DeFi carry risk. Do your own research. Not financial advice.
