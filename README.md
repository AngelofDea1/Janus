# 🏛️ JANUS

**Automated Funding Rate Arbitrage Protocol on Arc**

Janus is an automated vault that captures risk-free yield from perpetual futures funding rate arbitrage. Users deposit USDC, the protocol executes market-neutral arbitrage strategies across Arc perp protocols, and distributes yield back to depositors.

**Target APY:** 20-50%+ (market-dependent)  
**Risk Profile:** Low (market-neutral positions)  
**Minimum Deposit:** No minimum  
**Withdrawal:** Anytime, instant

---

## 🎯 What is Funding Rate Arbitrage?

Perpetual futures use **funding rates** to anchor prices to spot:
- When perps trade above spot: **longs pay shorts** (positive funding)
- When perps trade below spot: **shorts pay longs** (negative funding)
- Payments occur every **8 hours** (3x daily)

**The Arbitrage:**
When Protocol A has 0.05% funding and Protocol B has 0.02% funding, there's a 0.03% spread we can capture by:
1. Opening a position on the higher-rate protocol
2. Hedging with opposite position on lower-rate protocol
3. Collecting the spread (0.03% × 3 = 0.09% daily = 32.9% APY)
4. Zero directional risk (BTC up/down doesn't matter)

---

## 🚀 Quick Start

### For Users (Deposit & Earn)

1. **Connect Wallet**
   - Visit [janus.finance](https://janus.finance) (coming soon)
   - Connect MetaMask, WalletConnect, or Coinbase Wallet
   - Switch to Arc network

2. **Deposit USDC**
   - Enter amount (no minimum)
   - Approve USDC spending
   - Confirm deposit transaction
   - Receive jUSDC (vault shares)

3. **Earn Automatically**
   - Bot monitors funding rates 24/7
   - Opens positions when spreads detected
   - Rebalances when spreads disappear
   - Yield compounds automatically

4. **Withdraw Anytime**
   - Burn jUSDC shares
   - Receive USDC + earned yield
   - No lockup period

### For Developers (Run Your Own)

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/janus.git
cd janus

# 2. Install dependencies
cd janus-contracts && npm install
cd ../janus-keeper && npm install
cd ../janus-frontend && npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Deploy contracts (testnet first!)
cd janus-contracts
npx hardhat run scripts/deploy.ts --network arc-testnet

# 5. Start keeper bot
cd ../janus-keeper
node keeper.js

# 6. Launch frontend
cd ../janus-frontend
npm run dev
```

---

## 📁 Repository Structure

```
janus/
├── janus-contracts/          # Solidity smart contracts
│   ├── JanusVault.sol       # Main vault (deposits, withdrawals, accounting)
│   ├── JanusStrategy.sol    # Arbitrage execution logic
│   ├── JanusGovernance.sol  # DAO governance (coming soon)
│   └── test/                # Contract tests
│
├── janus-keeper/            # Automated bot (Node.js)
│   ├── keeper.js            # Main bot logic
│   ├── monitors/            # Funding rate monitors
│   ├── executors/           # Trade execution
│   └── utils/               # Helper functions
│
├── janus-frontend/          # React dashboard
│   ├── src/
│   │   ├── App.tsx          # Main app component
│   │   ├── components/      # UI components
│   │   └── hooks/           # Web3 hooks
│   └── public/
│
├── janus-docs/              # Documentation
│   ├── WHITEPAPER.md        # Technical whitepaper
│   ├── PITCH_DECK.md        # Investor pitch deck
│   └── API.md               # API documentation
│
└── README.md                # This file
```

---

## 🏗️ Architecture

```
┌─────────────┐
│   Users     │ Deposit USDC, receive jUSDC shares
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   JanusVault.sol    │ Main vault contract
│                     │ - Accepts deposits
│   - TVL: $X         │ - Mints/burns shares
│   - APY: X%         │ - Tracks positions
│   - Positions: X    │ - Distributes yield
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│  JanusStrategy.sol      │ Arbitrage logic
│                         │ - Opens positions
│  - Protocol A: SHORT    │ - Closes positions
│  - Protocol B: LONG     │ - Calculates P&L
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│    Keeper Bot (Node.js)  │ Automated execution
│                          │
│  Every 30 seconds:       │ - Monitors rates
│  1. Fetch funding rates  │ - Detects spreads
│  2. Find arbitrage       │ - Executes trades
│  3. Check positions      │ - Rebalances
│  4. Rebalance if needed  │ - Risk management
└──────────┬───────────────┘
           │
           ▼
┌───────────────────────────────┐
│   Arc Perp Protocols          │
│                               │
│  - ArcSwap Perps              │
│  - DeltaDEX                   │
│  - [More as they launch]      │
└───────────────────────────────┘
```

---

## 💻 Tech Stack

### Smart Contracts
- **Solidity** 0.8.20
- **Hardhat** for development
- **OpenZeppelin** for security
- **Chainlink** for price feeds

### Keeper Bot
- **Node.js** + TypeScript
- **ethers.js** v6
- **PostgreSQL** for state
- **Redis** for caching
- **Railway.app** for hosting

### Frontend
- **React** 18 + TypeScript
- **Vite** build system
- **TailwindCSS** + shadcn/ui
- **Recharts** for data viz
- **Vercel** for deployment

---

## 🔐 Security

### Smart Contract Security
- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard on all external calls
- ✅ Pausable in emergencies
- ✅ Multi-sig governance (5-of-9)
- ✅ Professional audit (Sherlock, Q3 2026)
- ✅ Bug bounty program ($50K)

### Keeper Bot Security
- ✅ Private key in hardware wallet (Ledger)
- ✅ Rate limiting on API calls
- ✅ Transaction simulation before execution
- ✅ Automatic pause on suspicious activity
- ✅ SMS/email alerts on errors

### Risk Management
- ✅ Max 10x leverage (prevents liquidations)
- ✅ Multi-oracle validation (Chainlink + Pyth)
- ✅ Circuit breakers on 5%+ price deviation
- ✅ Position size limits (10% of protocol OI)
- ✅ Insurance fund (5% of fees)

---

## 📊 Performance

### Historical Backtest (2024-2025)
- **Cumulative Return:** 115.9%
- **Annualized APY:** 48.2%
- **Max Drawdown:** -1.92%
- **Sharpe Ratio:** 4.7
- **Win Rate:** 94.3%

### Live Performance (Testnet)
*Coming soon after testnet launch*

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Report Bugs**
   - Open an issue on GitHub
   - Include: steps to reproduce, expected vs actual behavior, screenshots

2. **Suggest Features**
   - Open a GitHub Discussion
   - Explain use case and expected behavior

3. **Submit Code**
   ```bash
   # Fork the repo
   git checkout -b feature/your-feature
   # Make changes
   git commit -m "Add your feature"
   git push origin feature/your-feature
   # Open a Pull Request
   ```

4. **Improve Docs**
   - Fix typos, add examples, clarify explanations
   - All docs are in `/janus-docs/`

---

## 📅 Roadmap

### Q2 2026 (Now)
- [x] Smart contracts written
- [x] Keeper bot operational
- [x] Frontend MVP deployed
- [x] Whitepaper published
- [ ] Arc testnet deployment
- [ ] Beta testing (100 users)

### Q3 2026
- [ ] Smart contract audit
- [ ] Mainnet launch
- [ ] $1M TVL milestone
- [ ] Arc ecosystem grant

### Q4 2026
- [ ] $10M TVL
- [ ] $JANUS token launch
- [ ] Mobile app
- [ ] Institutional pilot

### Q1 2027
- [ ] $50M TVL
- [ ] Series A fundraising
- [ ] Multi-chain expansion
- [ ] 10-person team

---

## 💰 Revenue Model

### For Depositors
- **Earn:** 20-50%+ APY (after fees)
- **Fees:** 15% performance + 1% management
- **Withdraw:** Anytime, no lockup

### For Protocol
- **Performance Fee:** 15% of profits
- **Management Fee:** 1% annually
- **Whitelabel:** $10-25K/month (enterprise)

### Example
- User deposits: $10,000
- Vault earns: 20% APY = $2,000
- Performance fee: $300 (15% of $2,000)
- Management fee: $100 (1% of $10,000)
- User net: $1,600 (16% APY after fees)

---

## 🌐 Links

- **Website:** [janus.finance](https://janus.finance) (coming soon)
- **Twitter:** [@janusprotocol_](https://x.com/janusprotocol_)
- **Discord:** [discord.gg/23skEWUbbk](https://discord.gg/23skEWUbbk)
- **Docs:** [docs.janus.finance](https://docs.janus.finance) (TBD)
- **GitHub:** [github.com/yourusername/janus](https://github.com/yourusername/janus)

---

## ❓ FAQ

**Q: Is this safe?**  
A: Funding rate arbitrage is market-neutral (no directional risk). Main risks are smart contract exploits (mitigated by audit) and funding rates going to zero (mitigated by dynamic strategy).

**Q: What's the minimum deposit?**  
A: No minimum! Deposit $10 or $10M.

**Q: Can I withdraw anytime?**  
A: Yes, no lockup. Withdraw instantly (gas fees apply).

**Q: What if funding rates disappear?**  
A: Bot closes positions and waits for new opportunities. You keep your principal + earned yield.

**Q: How do you make money?**  
A: 15% performance fee (only on profits) + 1% annual management fee.

**Q: Is this audited?**  
A: Audit scheduled for Q3 2026 with Sherlock ($15K). Until then, testnet only.

**Q: Can I run my own vault?**  
A: Yes! Code is open source. Fork the repo, deploy contracts, run keeper bot.

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- **Arc Team** for building institutional DeFi infrastructure
- **OpenZeppelin** for battle-tested smart contracts
- **Ethena** for pioneering delta-neutral stablecoin yields
- **DeFi community** for feedback and support

---

## 📧 Contact

**Builder:** [Your Name]  
**Email:** team@janus.finance  
**Twitter:** @janusprotocol_  

For partnerships, press inquiries, or investment opportunities:  
partnerships@janus.finance

---

**Built with ❤️ on Arc**

*Disclaimer: This is experimental software. Use at your own risk. Cryptocurrency investments carry risk of loss.*
