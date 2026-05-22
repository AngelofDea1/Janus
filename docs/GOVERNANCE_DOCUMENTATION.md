# Janus Protocol - Governance Documentation

## Executive Summary

Janus operates under **institutional-grade decentralized governance** combining:
1. **5-of-9 Multisig**: Approval voting for critical decisions
2. **24-Hour Timelock**: Mandatory delays before execution
3. **On-Chain Transparency**: All proposals visible, verifiable
4. **Community Participation**: $JANUS token holders vote (launching Month 9)

This structure prevents single-point-of-failure and gives users confidence that Janus can't be rugged.

---

## 1. The 5-of-9 Multisig

### Purpose
Approve or reject critical vault operations requiring multiple trusted parties.

### Signers (9 Total)

#### Arc Core Team (3)
1. **Arc Core Member 1** - Protocol alignment, ecosystem guidance
2. **Arc Core Member 2** - Technical oversight, RPC management
3. **Arc Core Member 3** - Compliance, regulatory coordination

#### Community Representatives (2)
4. **DeFi Security Expert** - Smart contract risk assessment
5. **Institutional Advisor** - Treasury management guidance

#### Founder (1)
6. **Janus Founder/CEO** - Technical leadership, strategic vision

#### Additional Signers (3)
7. **Community Member 1** - User representation, transparency
8. **Community Member 2** - Treasury oversight, financial health
9. **Ecosystem Partner** - Cross-protocol coordination

### Voting Threshold
- **Minimum Required**: 5 signatures (55% supermajority)
- **Voting Period**: 7 days to gather signatures
- **Execution**: After 24-hour timelock window

### Critical Actions Requiring Multisig

| Action | Threshold | Timelock | Example |
|--------|-----------|----------|---------|
| **Parameter Changes** | 5-of-9 | 24h | Update APY, vault cap, delays |
| **Keeper Updates** | 5-of-9 | 24h | Deploy new keeper bot version |
| **Emergency Pause** | 5-of-9 | Immediate | Halt vault on exploit detection |
| **Insurance Claims** | 5-of-9 | 24h | Approve user claim payment |
| **Multisig Changes** | 5-of-9 | 24h | Add/remove signer |

### Process: How It Works

```
1. PROPOSE
 - Anyone can propose action on-chain
 - Proposal includes: action, description, parameters
 - Stored immutably on blockchain

2. REVIEW (7 days)
 - Signers review proposal
 - Discussion in Discord/forums
 - Public visibility (fully transparent)

3. VOTE
 - Signers electronically sign proposal
 - When 5+ sign, proposal moves forward
 - All signatures visible on-chain

4. TIMELOCK (24 hours)
 - Mandatory 24-hour delay before execution
 - Users have time to withdraw if they disagree
 - Can be cancelled before execution window

5. EXECUTE
 - After 24h delay, anyone can execute
 - Proposal takes effect
 - Event logged on-chain
```

### Security Properties

- **No Single Point of Failure**: Requires 5 different parties to collude
- **Geographic Diversity**: Signers spread across different regions
- **Expertise Diversity**: Mix of technical, business, and community voices
- **Transparent**: All proposals visible to everyone
- **Irreversible**: Decisions logged permanently on-chain

---

## 2. The 24-Hour Timelock

### Purpose
Mandate a waiting period before critical parameter changes take effect.

### Mechanics

```
Day 1: Multisig approves proposal (5-of-9 vote)
 
 Timelock starts (24-hour counter)
 
 Users see proposal + can withdraw
 
Day 2: 24 hours elapsed
 
 Proposal can now be executed
 
 Parameters change in vault
```

### Why 24 Hours?

- **Long enough**: Users with significant holdings can exit
- **Short enough**: Protocol can respond to urgent issues quickly
- **Transparent**: Clear deadline published on-chain
- **User-Friendly**: Everyone knows exact timing

### Parameters Protected by Timelock

| Parameter | Current | Locked? | Rationale |
|-----------|---------|---------|-----------|
| APY Estimate | 32.4% | Yes | Users need warning before yield drops |
| Vault Cap | $10M | Yes | Large deposits need notice |
| Withdrawal Delay | 2 days | Yes | Changes affect user liquidity |
| Performance Fee | 15% | Yes | Users need time to exit before cut increases |
| Keeper Address | 0x... | Yes | Changing bot requires full transparency |

### Emergency Override (Rare)

In case of **critical smart contract exploit**, multisig can:
- **Pause vault** immediately (no timelock)
- **Prevent further deposits** (emergency circuit breaker)
- **Protect existing funds** while investigating

This is strictly for life-threatening situations (e.g., on-chain hack).

---

## 3. Community Governance ($JANUS Token)

### Timeline
- **Month 6**: Token contract deployed (non-tradeable)
- **Month 7**: Distribution to early users/investors
- **Month 8**: Governance activation (snapshot voting)
- **Month 9**: Full community control, multisig transitions to advisor role

### $JANUS Token Utility

#### Governance Rights
- Vote on parameter changes
- Vote on multisig member additions/removals
- Vote on insurance fund claims
- Vote on emergency actions

#### Economic Rights
- **Fee Revenue Share**: 10% of protocol fees distributed to stakers
- **Liquidity Mining**: Incentives for long-term holders
- **Governance Grants**: Fund community initiatives

### Voting Mechanism

**Snapshot (Soft governance):**
- Off-chain voting
- Binding on community
- No gas costs
- Weekly/monthly voting windows

**On-Chain (Hard governance):**
- Chaincode execution
- Binding on contracts
- Gas costs apply
- Emergency-only voting

### Token Distribution

| Category | % | Amount | Use |
|----------|---|--------|-----|
| **Community (Airdrop)** | 40% | 40M | Early users, beta testers |
| **Team (Vest 4yr/1yr cliff)** | 20% | 20M | Founder, advisors |
| **Investors (Vest 2yr/immediate)** | 15% | 15M | Seed/Series A investors |
| **DAO Treasury** | 15% | 15M | Governance-controlled funds |
| **Liquidity Mining** | 10% | 10M | Bootstrap trading/staking |

### Example: Community Vote

```
Proposal: "Increase vault cap from $10M to $50M"

Monday: Proposal posted, discussion opens
Tuesday-Wednesday: Community debate (Discord, forums)
Thursday: Snapshot voting opens
Friday: 72-hour voting window closes
 Result: 67% approval (2.1M votes)

Saturday: If multisig agrees, prepares on-chain transaction
Sunday: Transaction queued with 24-hour timelock

Monday: Timelock expires
 Anyone executes transaction
 Vault cap updated to $50M
```

---

## 4. Transparency & Auditing

### On-Chain Audit Trail

**Every action is logged:**
- Deposits
- Withdrawals
- Yield harvests
- Parameter changes
- Emergency actions
- Multisig votes
- Insurance claims

**All viewable via:**
- Arc Block Explorer
- Janus Dashboard ("Audit Trail" tab)
- GraphQL API (coming soon)

### Off-Chain Documentation

- **GitHub**: All smart contract code open-source
- **Governance Forum**: Discussion & voting records
- **Team Blog**: Monthly updates, transparent reporting
- **Financial Reports**: Quarterly revenue, expense breakdown

### Audit Schedule

| Audit | Frequency | Purpose |
|-------|-----------|---------|
| **Internal Code Review** | Per deployment | Catch bugs pre-launch |
| **Professional Audit** | Quarterly | Third-party verification |
| **Community Audit** | Monthly | User bug reporting |
| **Financial Audit** | Annually | Revenue & expense verification |

---

## 5. Dispute Resolution

### Problem: What if there's a disagreement?

### Resolution Process

**Step 1: Open Discussion**
- Raise concern in Discord/forums
- Multisig members respond within 48 hours
- Public discussion on-chain

**Step 2: Proposal**
- Community can propose multisig removal (for misconduct)
- Requires 50% $JANUS token approval
- If approved, multisig member replaced

**Step 3: Arbitration**
- In case of irreconcilable disagreement
- Community can fork Janus (copy code, start new vault)
- Existing users can migrate holdings

**Step 4: Exit**
- If vault is compromised, users can always withdraw (after 2-day delay)
- Emergency pause happens instantly to protect funds

---

## 6. Transition to Full DAO

### Current State (Month 0-6)
- Founder controls all decisions
- Multisig acts as safety board
- Transparent but centralized

### Transition State (Month 7-12)
- $JANUS token voting on major decisions
- Multisig retains emergency powers
- Dual governance structure

### Full DAO State (Month 13+)
- Community $JANUS holders control vault
- Multisig reduced to advisor role
- Distributed governance

```
Month 0: Founder proposes  Multisig approves  Execute
 (centralized but transparent)

Month 7: Founder proposes  Multisig approves  Token holders vote  Execute
 (hybrid governance)

Month 13: Token holders propose  Token holders vote  Execute
 (full decentralization)
```

---

## 7. Security & Checks-and-Balances

### Preventing Majority Attack

**Problem**: What if 5 of 9 signers collude to steal funds?

**Protections:**
1. **Timelock**: 24-hour window for users to withdraw
2. **Transparency**: Action visible before execution
3. **Community Override**: Token holders can remove signer
4. **Fork Option**: Users can migrate to forked protocol
5. **Insurance Fund**: Covers losses if attack occurs

### Preventing Capture by Bad Actor

**Problem**: What if a bad signer is elected?

**Solutions:**
1. **Removal Vote**: Community can remove any signer
2. **Quarterly Reviews**: Signer performance audited
3. **Slashing**: Bad signers lose $JANUS token allocation
4. **Replacement Pool**: Community nominates replacement candidates

### Preventing Regulatory Attack

**Problem**: What if government demands protocol shut down?

**Solutions:**
1. **Decentralization**: No single authority to target
2. **User Sovereignty**: Contracts are immutable
3. **International Signers**: No single jurisdiction controls all signers
4. **Code Freedom**: Open-source, anyone can fork

---

## 8. Emergency Procedures

### Vault Pause (Extreme)

**Triggered by**: 5-of-9 multisig vote
**Effect**: 
- No new deposits accepted
- Existing positions liquidated safely
- Withdrawals still possible
- Funds remain in user wallets

**Used when**: Smart contract exploit detected

### Insurance Claim Process

**Triggered by**: User submits claim
**Process**:
1. User provides evidence of loss
2. Multisig investigates (7 days)
3. If valid, vote to approve
4. 24-hour timelock
5. Funds transferred to claimant

**Maximum claim**: Min($100K, insurance fund balance)

---

## 9. Governance Best Practices

### What Makes Good Governance?

 **Transparency**: All decisions visible, voteable, reversible
 **Diversity**: Signers from different backgrounds, geographies
 **Accountability**: Bad actors can be removed by community
 **Speed**: Can respond to emergencies quickly (multisig override)
 **User Control**: Users can always exit (withdrawal delay)

### Red Flags (What We Avoid)

 **Centralization**: One person controls vault
 **Secrecy**: Governance decisions made in private
 **Immutability**: Parameters can't be changed
 **Slowness**: Takes months to respond to issues
 **Irreversibility**: Can't undo bad decisions

---

## 10. Governance Dashboard

Users can monitor governance via:

**On-Chain:**
- Multisig proposals (Arc explorer)
- Timelock status (countdown timer)
- Emergency pause status (live indicator)

**Dashboard:**
- Governance tab showing all active proposals
- Vote counts (multisig signatures)
- Parameter changes (before/after comparison)
- Audit trail (all historical actions)

---

## Conclusion

Janus governance is designed to be:

1. **Safe**: Multiple signers, timelock delays, insurance fund
2. **Transparent**: Everything visible on-chain
3. **Decentralizing**: Path from founder  multisig  community DAO
4. **User-Friendly**: Users understand what's happening and can always exit
5. **Trustworthy**: Actions are verifiable, reversible, and accountable

This is how institutional-grade DeFi should work.
