# Janus Protocol — Overview

## What is Janus?

Janus is an **institutional-grade, automated funding rate arbitrage vault** built on the **Arc L1 Network**. Deposit USDC or EURC and earn 24–50% APY through fully automated, market-neutral trading strategies — no active management required.


## The Problem

- Funding rate arbitrage generates 20–50% annual returns but requires sophisticated infrastructure to execute
- Retail users have no access to this institutional strategy
- Existing DeFi yield products expose users to directional price risk

## The Solution

1. **One-click deposits** — Connect wallet, deposit USDC or EURC, earn automatically
2. **Market-neutral** — Zero directional risk (BTC price movement doesn't affect your yield)
3. **Fully automated** — Keeper bot monitors, executes, and rebalances 24/7
4. **Institutional safety** — 5-of-9 multisig governance, insurance fund, on-chain audit trail


## How It Works

### Funding Rate Arbitrage

Perpetual futures have "funding rates" — periodic payments between long and short traders that keep perpetual prices anchored to spot.

**Example:**
- Protocol A: +0.05% funding (longs pay shorts)
- Protocol B: +0.02% funding
- **Spread: 0.03%**

**Janus does this:**
1. Opens SHORT on Protocol A (collects 0.05%)
2. Opens LONG on Protocol B (pays 0.02%)
3. Net: +0.03% every 8 hours = **~32% APY**
4. **Zero directional risk** — BTC price direction is irrelevant

### User Flow

```
User deposits USDC/EURC
          ↓
Receives jUSDC / jEURC vault tokens (ERC-4626)
          ↓
Keeper bot finds funding rate spreads
          ↓
Opens market-neutral positions
          ↓
Collects funding payments every 8 hours
          ↓
Yield automatically compounds
          ↓
User withdraws anytime (2-day settlement)
```


## Key Features

### Safety Architecture

| Feature | Details |
|---------|---------|
| 5-of-9 Multisig | Critical decisions require majority approval |
| 24-Hour Timelock | All parameter changes delayed — users can exit |
| Insurance Fund | 5% of performance fees protect against exploits |
| 2-Day Withdrawal Delay | Settlement period prevents bank runs |
| On-Chain Audit Trail | Every action logged permanently and verifiable |

### Transparency

- Live TVL, APY, and positions on the dashboard
- Real-time funding rate data from Binance, Bybit, and Hyperliquid
- Market Monitor showing all active opportunities
- All governance proposals visible with vote counts


## Financial Model

| Metric | Value |
|--------|-------|
| Estimated APY | 24–50% (market dependent) |
| Performance Fee | 15% of profits only |
| Management Fee | 1% annual |
| User Net APY | ~20–42% after fees |
| Minimum Deposit | None |
| Withdrawal | Anytime (2-day settlement) |


## Smart Contracts (Testnet)

| Contract | Address |
|----------|---------|
| USDC Vault (JanusVault) | `0x764BD748e0FaFBE92Aa7C4e0B85DB8EC96B3C2A` |
| EURC Vault | `0xb8d89A3B35E07B5E26eaB39Df11B05C79d51B153` |
| USDC (Arc Native) | `0x3600000000000000000000000000000000000000` |
| Governance Timelock | `0x892a0bcf87baee1e390c9b88a8d11cfa98b0f22d` |
| 5-of-9 Multisig | `0x8ac5eE52F70AE01dB914bE459D8B3d50126fd6aE` |
| Insurance Fund | `0x325c8Df4CFb5B068675AFF8f62aA668D1dEc3C4B` |


## Network & Access

| | |
|-|-|
| **Blockchain** | Arc L1 Testnet (Chain ID: `5042002`) |
| **RPC** | `https://rpc.testnet.arc.network` |
| **Explorer** | `https://testnet.arcscan.app` |
| **App** | `https://janushq.xyz` |


## Risk Disclosure

**Smart Contract Risk** — Contracts are audited but DeFi is experimental. Only deposit what you can afford to lose. Insurance fund covers known exploits but does not guarantee 100% coverage.

**Market Risk** — Funding rates can go to zero (strategy pauses) or negative (strategy reverses). Extreme volatility can cause liquidation; this is mitigated by safety parameters.

**Operational Risk** — Keeper bot redundancy and monitoring minimize downtime. All protocol parameter changes are subject to a 24-hour timelock during which users may exit.


## Contact & Support

- **Website**: [janushq.xyz](https://janushq.xyz)
- **Twitter**: [@janusprotocol_](https://x.com/janusprotocol_)
- **Discord**: [discord.gg/23skEWUbbk](https://discord.gg/23skEWUbbk)
- **Email**: team@janushq.xyz


*Janus Protocol is experimental software. Cryptocurrency and DeFi carry risk. Do your own research. Not financial advice.*
