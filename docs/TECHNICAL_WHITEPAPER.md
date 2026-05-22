# Janus Protocol - Technical Whitepaper

## Executive Summary

Janus is a non-custodial, ERC-4626 standard yield vault implementing automated cross-protocol funding rate arbitrage on Arc L1. The protocol uses a decentralized keeper bot to identify and execute market-neutral positions across perpetual derivative exchanges, generating consistent returns independent of directional price movements.

**Version**: 1.0
**Date**: January 2026
**Status**: Live on Arc Testnet

---

## 1. Introduction

### 1.1 Background

Perpetual futures markets have grown to $61.8 trillion in annual trading volume (2025). These derivatives use funding rates—periodic payments between long and short traders—to anchor perpetual prices to spot markets.

When funding rates diverge across protocols, arbitrage opportunities emerge. Traditional finance has exploited basis trading for decades; Janus brings this strategy to DeFi with full automation.

### 1.2 Problem Statement

**For Retail Users:**
- Funding rate arbitrage requires manual monitoring across 10+ protocols
- Complex position management (long spot + short perp simultaneously)
- High gas fees on Ethereum eliminate profitability
- Liquidation risk from leverage mismanagement

**For Institutions:**
- Treasury USDC earning 0-4% in DeFi
- No compliant infrastructure for funding rate strategies
- MiCA compliance requirements (July 2026 deadline)
- Lack of institutional-grade governance and risk management

### 1.3 Solution Overview

Janus automates funding rate arbitrage through:
1. **Smart Contracts**: ERC-4626 vault with institutional governance
2. **Keeper Bot**: 24/7 autonomous execution engine
3. **Risk Management**: Multi-sig, timelock, insurance fund, audit trail
4. **Compliance**: On-chain transparency for all operations

---

## 2. Architecture

### 2.1 Smart Contract Layer

#### JanusVault (ERC-4626)

```solidity
contract JanusVault is ERC4626, Ownable {
 // ERC-20 USDC asset
 // User deposits → receive JANUS shares
 // Shares represent proportional vault ownership
 // Yield compounds automatically
}
```

**Key Functions:**
- `deposit(uint256 assets, address receiver)` - Accept USDC, mint shares
- `withdraw(uint256 shares)` - Burn shares, return USDC
- `requestWithdrawal(uint256 shares)` - Start 2-day settlement
- `harvestYield(uint256 amount)` - Keeper deposits profits
- `totalAssets()` - View total USDC in vault
- `estimatedAPY()` - Current annual percentage yield

**Safety Features:**
- Vault cap limits ($10M beta)
- 2-day withdrawal delays prevent bank runs
- Fee split: 15% performance, 1% management
- Insurance fund accrues from performance fees

#### JanusMultiSig (5-of-9 Governance)

```solidity
contract JanusMultiSig {
 // 9 signers (Arc core 3 + community 2 + builder 1 + others 3)
 // 5 signatures required for critical actions
 // All proposals are on-chain, verifiable
}
```

**Critical Actions:**
- Parameter changes (APY, caps, delays)
- Keeper updates
- Emergency vault pause
- Multi-sig member updates

#### JanusTimelock (24-Hour Delays)

```solidity
contract JanusTimelock is TimelockController {
 // 24-hour execution delay on all proposals
 // Users have time window to exit if they disagree
 // Prevents surprise parameter changes
}
```

#### JanusInsuranceFund (Exploit Protection)

```solidity
contract JanusInsuranceFund {
 // Accumulates 5% of performance fees
 // Available for claims if smart contract exploited
 // User claims require multi-sig approval
}
```

### 2.2 Keeper Bot Architecture

```
┌─────────────────────────┐
│ Keeper Bot (Node.js) │
├─────────────────────────┤
│ 1. Monitor Layer │
│ - Fetch funding │
│ rates │
│ - Cache in Redis │
│ - 30s polling │
├─────────────────────────┤
│ 2. Decision Engine │
│ - Find spreads │
│ - Score │
│ opportunities │
│ - Calculate size │
├─────────────────────────┤
│ 3. Execution Layer │
│ - Open positions │
│ - Close positions │
│ - Rebalance │
├─────────────────────────┤
│ 4. Risk Management │
│ - Monitor leverage │
│ - Check liquidity │
│ - Alert on issues │
└─────────────────────────┘
 ↓
 ┌──────────┐
 │ Arc L1 │
 └──────────┘
```

### 2.3 Data Flow

```
User Deposit (USDC)
 ↓
JanusVault.deposit() 
 ↓
Mint JANUS shares 
 ↓
Keeper Bot monitors funding rates
 ↓
Spread detected (e.g., 0.03%)
 ↓
Open market-neutral position:
 - SHORT on high-rate protocol
 - LONG on low-rate protocol
 ↓
Collect funding payments (every 8h)
 ↓
Close position when spread disappears
 ↓
Harvest yield via harvestYield()
 ↓
Yield compounds in vault
 ↓
User can withdraw (2-day settlement)
 ↓
Shares burn, USDC transferred back
```

---

## 3. Financial Model

### 3.1 Funding Rate Mechanics

**Funding Rate**: Payment between long and short traders

```
If funding rate = +0.05% per 8 hours:
- Longs pay shorts 0.05%
- Happens 3 times per day
- Annualizes to: 0.05% × 3 × 365 = 54.75% APY
```

### 3.2 Arbitrage Calculation

**Example:**
- Protocol A: +0.05% funding (8h)
- Protocol B: +0.02% funding (8h)
- **Spread**: 0.03% (8h)

**Position:**
- SHORT Protocol A (collect 0.05%)
- LONG Protocol B (pay 0.02%)
- **Net**: +0.03% per 8 hours

**Returns:**
- Daily: 0.03% × 3 = 0.09%
- Monthly: 0.09% × 30 = 2.7%
- Annual: 0.09% × 365 = 32.85%

### 3.3 Fee Structure

| Fee | Amount | Goes To |
|-----|--------|---------|
| Performance | 15% of profits | Treasury + Insurance |
| Management | 1% annually | Operations |
| Gas | Variable | Network |

**Example ($10K deposit, 30% APY):**
- Gross yield: $3,000
- Performance fee (15%): $450
- Management fee (1%): $100
- **User nets**: $2,450 (24.5% APY)

---

## 4. Risk Management

### 4.1 Smart Contract Risks

**Mitigations:**
- Multi-sig governance (5-of-9 required)
- 24-hour timelock on changes
- Professional audit (Sherlock, Q3 2026)
- Insurance fund for exploits
- Bug bounty program ($50K)

### 4.2 Market Risks

**Funding Rate Risk:**
- **Problem**: Rates can go negative or zero
- **Mitigation**: Strategy pauses, capital safe, waits for opportunity

**Liquidation Risk:**
- **Problem**: Extreme leverage can liquidate positions
- **Mitigation**: Max 10x leverage, 20% buffer before liquidation

**MEV Risk:**
- **Problem**: Sandwich bots steal profits
- **Mitigation**: Private RPC + MEV protection tools

### 4.3 Operational Risks

**Keeper Bot Failure:**
- **Problem**: Automation breaks down
- **Mitigation**: Redundant bots, monitoring, manual override

**RPC Failure:**
- **Problem**: Network goes down
- **Mitigation**: Multiple RPC endpoints, fallback nodes

**Governance Attack:**
- **Problem**: 5 signers conspire to steal funds
- **Mitigation**: Multi-sig distributed across trusted parties, timelock allows exits

---

## 5. Security Measures

### 5.1 On-Chain Security

- **ERC-4626 Standard**: Audited, battle-tested vault pattern
- **OpenZeppelin Contracts**: Industry-standard library
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency stop button
- **Access Control**: Owner, keeper, and multi-sig roles

### 5.2 Economic Security

- **Insurance Fund**: 5% of fees → exploit protection
- **Vault Caps**: Max $10M TVL → reduces concentration risk
- **Withdrawal Delays**: 2-day settlement → prevents bank runs
- **Audit Trail**: All actions logged on-chain → verifiable

### 5.3 Process Security

- **Code Review**: Internal audit pre-deployment
- **Testing**: Unit tests for all functions
- **Monitoring**: Real-time alerts on abnormal activity
- **Incident Response**: Pre-planned response procedures

---

## 6. Governance

### 6.1 5-of-9 Multisig

**Members:**
- Arc Core Team (3): Ensures network alignment
- Community Representatives (2): Ensures user voice
- Builder (1): Ensures technical input
- Additional Signers (3): Geographic/expertise diversity

**Voting Process:**
1. Proposal created on-chain
2. Signers review (7-day window)
3. 5+ sign proposal
4. 24-hour timelock
5. Execution allowed
6. All visible on-chain

### 6.2 Timelock Parameters

| Parameter | Current | Max Change | Delay |
|-----------|---------|------------|-------|
| APY | 3240 (32.4%) | Any | 24h |
| Vault Cap | $10M | Any | 24h |
| Withdrawal Delay | 2 days | 0-7 days | 24h |
| Performance Fee | 15% | 0-30% | 24h |
| Keeper Address | 0x... | Any | 24h |

---

## 7. Compliance

### 7.1 MiCA Readiness (EU)

- **KYC-Gated Vault**: Optional institutional vault with KYC
- **Audit Trail**: Every transaction logged and verifiable
- **Reporting**: Ready for CARF/DAC8 data submission
- **Treasury Tracking**: Full asset custody segregation

### 7.2 Regulatory Approach

- **Self-Regulatory**: Community governance
- **Transparent**: All code open-source
- **Compliant**: Built for regulatory integration
- **Defensive**: Insurance fund for regulatory fines

---

## 8. Deployment

### 8.1 Testnet Status

| Component | Address | Status |
|-----------|---------|--------|
| JanusVault | `0x70E5370b8981Abc6e14C91F4AcE823954EFC8eA3` | Live |
| USDC | `0x3600000000000000000000000000000000000000` | Live |
| Multisig | `0xc8d77a0bf435ec92a4e21dae6c2789bd0bcf00e1` | Live |
| Timelock | `0x892a0bcf87baee1e390c9b88a8d11cfa98b0f22d` | Live |
| Insurance | `0x2500c4e08de98a87f930abefeafdd5d253a753f8` | Live |

### 8.2 Network Specifications

- **Chain**: Arc L1 (Testnet: Chain ID 5042002)
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: https://testnet.arcscan.app
- **Frontend**: http://localhost:3000 (dev)

---

## 9. Audit & Security Assessment

### 9.1 Current Status

- Internal code review: Passed
- TypeScript/Solidity linting: Passed
- Professional audit: Scheduled Q3 2026
- Bug bounty: Launching pre-mainnet

### 9.2 Audit Scope

- Smart contract logic
- Access control mechanisms
- ERC-4626 compliance
- Integration with Arc RPC
- Keeper bot execution logic
- Insurance fund operations

---

## 10. Roadmap

### Q1 2026 (Current)
- Smart contracts deployed
- Keeper bot live
- Frontend operational
- [ ] Professional audit

### Q2 2026
- [ ] Arc mainnet deployment
- [ ] Public launch
- [ ] $1M TVL target

### Q3 2026
- [ ] $JANUS token launch
- [ ] Institutional features
- [ ] Series A fundraising

### Q4 2026
- [ ] $100M TVL
- [ ] Multi-chain expansion
- [ ] Series B planning

---

## 11. Conclusion

Janus Protocol brings institutional-grade arbitrage infrastructure to retail users. By combining market-neutral strategies, institutional governance, and full transparency, Janus offers the safest path to consistent yield in DeFi.

The protocol is live, tested, and ready for scale.

---

## References

- ERC-4626: Tokenized Vault Standard
- OpenZeppelin Contracts v5
- Arc L1 Documentation
- Perpetual Futures Mechanics (Binance, dYdX, Hyperliquid)

---

## Appendix A: Gas Cost Analysis

| Operation | Ethereum | Arc | Savings |
|-----------|----------|-----|---------|
| Deposit | $150-300 | $0.05 | 99.98% |
| Withdraw | $150-300 | $0.05 | 99.98% |
| Rebalance | $100-200 | $0.03 | 99.98% |

This is why Janus can only work on Arc.
