# Janus Protocol — Governance Documentation

## Overview

Janus operates under institutional-grade decentralized governance combining:

1. **5-of-9 Multisig** — Critical decisions require majority approval from multiple trusted parties
2. **24-Hour Timelock** — Mandatory delay before any parameter changes take effect
3. **On-Chain Transparency** — All proposals are publicly visible and verifiable
4. **Community Participation** — Token holder voting is on the roadmap as the protocol decentralizes

This structure prevents single-point-of-failure and ensures no individual can unilaterally control vault funds.

---

## 1. The 5-of-9 Multisig

### Purpose
Approve or reject critical vault operations requiring consensus from multiple trusted parties.

### Structure
The multisig consists of 9 signers drawn from:
- Arc core team members (protocol alignment, technical oversight)
- Security experts (smart contract risk assessment)
- Community representatives (user representation, treasury oversight)
- Ecosystem partners (cross-protocol coordination)

**Minimum signatures required:** 5 of 9 (55% supermajority)  
**Voting period:** 7 days to gather signatures  
**Execution:** After the 24-hour timelock window

### Actions Requiring Multisig Approval

| Action | Timelock | Notes |
|--------|----------|-------|
| Parameter changes | 24h | APY estimate, vault cap, fees |
| Keeper bot updates | 24h | New keeper deployment |
| Emergency pause | Immediate | Exploit detection only |
| Insurance claims | 24h | User claim approval |
| Multisig member changes | 24h | Add/remove a signer |

### Proposal Process

```
1. PROPOSE
   Anyone can submit a proposal on-chain with description and parameters.
   Stored immutably on the blockchain.

2. REVIEW (7 days)
   Signers review the proposal.
   Public discussion in Discord.
   Fully transparent — anyone can read it.

3. VOTE
   Signers sign the proposal electronically.
   When 5+ signatures are collected, the proposal proceeds.
   All signatures visible on-chain.

4. TIMELOCK (24 hours)
   Mandatory delay before execution.
   Users can withdraw if they disagree.
   Can be cancelled before the window closes.

5. EXECUTE
   After 24h, anyone can execute the transaction.
   Change takes effect and is logged on-chain.
```

### Security Properties

- **No single point of failure** — Requires 5 parties to agree
- **Geographic diversity** — Signers across different regions
- **Expertise diversity** — Technical, financial, and community voices
- **Full transparency** — All proposals visible to the public
- **Permanent record** — Decisions logged on-chain forever

---

## 2. The 24-Hour Timelock

### Purpose
Ensure users have time to review and react to any parameter changes before they take effect.

### How It Works

```
Day 1: Multisig approves proposal (5-of-9 vote)
         ↓
       Timelock starts (24-hour countdown)
         ↓
       Proposal is public — users can review and withdraw if desired
         ↓
Day 2: 24 hours elapsed
         ↓
       Proposal can now be executed
         ↓
       Parameters updated in the vault
```

### Parameters Protected by Timelock

| Parameter | Locked? | Rationale |
|-----------|---------|-----------|
| APY Estimate | Yes | Users deserve notice before yield changes |
| Vault Cap | Yes | Affects new deposit availability |
| Withdrawal Delay | Yes | Directly affects user liquidity |
| Performance Fee | Yes | Users need time to exit before any increase |
| Keeper Address | Yes | Bot changes require full transparency |

### Emergency Override

In the event of a critical smart contract exploit, the multisig can:
- **Pause the vault immediately** (no timelock required)
- **Prevent further deposits** (emergency circuit breaker)
- **Protect existing funds** while the issue is investigated

This override is strictly for active exploit situations.

---

## 3. Community Governance

Community governance is part of Janus's decentralization roadmap. As the protocol matures, governance will progressively shift toward $JANUS token holders.

When active, token governance will enable holders to vote on:
- Parameter changes
- Multisig member additions or removals
- Insurance fund claims
- Emergency actions

All governance proposals will remain public and visible on the dashboard.

---

## 4. Transparency & Auditing

### On-Chain Audit Trail

Every vault action is logged on-chain permanently:
- Deposits and withdrawals
- Yield harvests
- Parameter changes
- Emergency actions
- Multisig votes
- Insurance claims

All events are viewable via:
- [Arc Block Explorer](https://testnet.arcscan.app)
- Janus Dashboard — Governance → Audit Trail tab

### Code & Reporting

- **Smart contracts**: Open-source on GitHub
- **Audit results**: Published publicly when complete
- **Protocol updates**: Announced via Discord and Twitter

---

## 5. Dispute Resolution

**Step 1 — Open Discussion**  
Raise concerns in Discord. Multisig members respond within 48 hours. All discussion is public.

**Step 2 — Formal Proposal**  
Community can propose multisig member removal for misconduct. Requires token holder approval.

**Step 3 — Exit**  
If you fundamentally disagree with a governance decision, you can always withdraw your funds (2-day settlement). The 24-hour timelock guarantees you will have notice before any change takes effect.

---

## 6. Emergency Procedures

### Vault Pause

**Triggered by:** 5-of-9 multisig vote  
**Effect:**
- No new deposits accepted
- Existing positions wound down safely
- Withdrawals remain possible
- All funds stay in user-controlled smart contracts

**Used only when:** A smart contract exploit is confirmed.

### Insurance Claim Process

1. User submits claim with evidence of loss
2. Multisig investigates (up to 7 days)
3. If valid, a 5-of-9 vote approves the payout
4. 24-hour timelock
5. Funds transferred to claimant

---

## 7. Security Design

### Preventing Majority Attack (5-of-9 collusion)

1. 24-hour timelock gives users time to exit before any malicious action executes
2. Proposals are fully public — the community can detect and respond
3. Community can vote to remove and replace any compromised signer
4. Insurance fund provides a backstop

### Preventing Capture by a Bad Actor

1. Community can propose removal of any misbehaving signer
2. Regular signer performance reviews
3. Replacement candidates are nominated by the community

---

## 8. Governance Dashboard

Users can monitor all governance activity in real-time:

**On-chain (Arc Explorer):**
- Active multisig proposals
- Timelock countdown status
- Emergency pause indicator

**In-app (Governance tab):**
- Active proposals with vote counts
- Parameter change history (before/after)
- Full audit trail of all vault actions

---

## Summary

Janus governance is designed to be:

| Property | Implementation |
|----------|---------------|
| **Safe** | 5-of-9 multisig, 24h timelock, insurance fund |
| **Transparent** | Everything on-chain and publicly viewable |
| **Decentralizing** | Progressive path toward full community control |
| **User-protective** | 24h notice before any change, always able to exit |
| **Accountable** | Signers can be removed, actions are permanent records |
