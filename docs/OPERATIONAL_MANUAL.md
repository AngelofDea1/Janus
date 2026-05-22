# Janus Protocol - Operational Manual

## For: Protocol Operations Team, Multisig Members, Community Moderators

---

## 1. Daily Operations Checklist

### Every 24 Hours

- [ ] **Monitor Keeper Bot Health**
 - Check bot is running (no crashed processes)
 - Verify funding rates are being fetched
 - Confirm positions are open/closing normally

- [ ] **Check Vault Metrics**
 - TVL stable (no unexpected drops)
 - APY within expected range (±2%)
 - No pending insurance claims

- [ ] **Review Governance**
 - Any new proposals?
 - All multisig votes active?
 - Community feedback in Discord?

- [ ] **Verify RPC Health**
 - Arc testnet RPC responding
 - Block time normal (<2 seconds)
 - No gas price spikes

- [ ] **Monitor User Support**
 - Respond to support questions
 - Flag any unusual activity
 - Update FAQ with new questions

### Weekly

- [ ] **Signer Meeting**: Review proposals, discuss decisions
- [ ] **Community Update**: Post metrics, updates to Twitter/Discord
- [ ] **Audit Trail Review**: Spot-check on-chain logs for anomalies
- [ ] **Insurance Fund Check**: Verify balance, no unauthorized claims

### Monthly

- [ ] **Financial Report**: Revenue, expenses, fund allocation
- [ ] **Performance Analysis**: APY vs targets, user retention
- [ ] **Risk Assessment**: Smart contract exposure, funding rate trends
- [ ] **Governance Review**: Voting participation, proposal quality

---

## 2. Emergency Response Procedures

### Level 1: Issue Reported

**Action**: Flag in Discord #incidents channel
**Timeline**: Immediate response
**Owner**: Community moderator

```
User reports: "Deposit failed"
 Community moderator investigates
 Checks RPC, network, gas prices
 Responds with troubleshooting steps
 Escalates to multisig if necessary
```

### Level 2: Potential Exploit

**Action**: Pause vault, convene emergency multisig
**Timeline**: 1 hour
**Owner**: Multisig

```
Security researcher: "Found vulnerability in JanusVault"
 Verify vulnerability is real
 Multisig votes on emergency pause
 Pause executes immediately (no timelock)
 Keeper bot stops opening new positions
 Users can still withdraw
 Investigate, patch, relaunch
```

### Level 3: System Failure

**Action**: Kill keeper bot, halt transactions
**Timeline**: Immediately
**Owner**: Ops team

```
Keeper bot enters infinite loop
 Ops team stops bot
 Notify multisig of situation
 Multisig decides: fix or pause vault
 Users notified via Discord
 Recovery plan communicated
```

### Emergency Hotline

**Discord**: #emergency-incidents
**Email**: emergency@janus.finance
**Response**: Within 30 minutes, 24/7

---

## 3. Multisig Operations

### Creating a Proposal

**Step 1: Draft**
```
Title: Increase Vault Cap to $50M
Description: Demand exceeds current $10M cap. Proposal: increase to $50M to onboard institutional depositors.
Impact: Users can deposit more, vault scales faster
Risks: Larger capital at risk, needs keeper bot optimization
```

**Step 2: Post for Discussion**
- Governance Forum (72 hours discussion)
- Discord #governance (community feedback)
- Email signers with draft

**Step 3: Formal Proposal**
- Deploy on-chain proposal
- Multisig signs (5-of-9 required)
- Timelock countdown starts (24 hours)

**Step 4: Execute**
- After timelock expires
- Anyone can execute
- Parameter updated on-chain
- Event logged in audit trail

### Voting Requirements

| Proposal Type | Required | Timeline | Example |
|---------------|----------|----------|---------|
| **Major Parameter Change** | 5-of-9 | 7 days | Increase vault cap, change fees |
| **Emergency Pause** | 5-of-9 | Immediate | Exploit detected |
| **Multisig Change** | 5-of-9 | 7 days | Add/remove signer |
| **Insurance Claim** | 5-of-9 | 7 days | User submitting exploit claim |

### Signer Responsibilities

**Monthly Time Commitment**: 2-4 hours
**On-Call Availability**: 24-hour response for emergencies
**Decision-Making**: Read proposals, discuss, vote

---

## 4. Keeper Bot Operations

### Daily Monitoring

**Bot Metrics:**
```bash
curl http://localhost:3000/api/keeper/status

{
 "uptime": "99.9%",
 "last_check": "2026-01-15T14:32:00Z",
 "positions_open": 3,
 "positions_closed_today": 2,
 "funding_collected": "$2,400",
 "errors": 0,
 "rpc_calls": 4821,
 "gas_spent": "0.034 ETH"
}
```

**Success Criteria:**
- Uptime > 99.5% (max 3.6 hours down/month)
- Error rate < 0.1%
- RPC response time < 200ms
- Gas cost < $5/day

### Optimization Procedures

**When APY is lower than target:**

1. Check funding rates (maybe just low market-wide)
2. Verify keeper bot is opening positions efficiently
3. Check gas prices (maybe spiked recently)
4. Review competitor APYs (for benchmarking)
5. If operational issue, escalate to engineering team

**When APY is higher than projected:**

1. Great! Document the strategy that worked
2. Adjust projections (if sustainable)
3. Communicate positive news to community
4. Risk-check that we're not overleveraged

---

## 5. User Support Playbook

### Common Questions

**Q: When will yield be credited to my account?**
A: Funding rates are paid every 8 hours by the perpetual protocols. Your share of those payments compounds in real-time. Check your dashboard for current balance.

**Q: How do I withdraw?**
A: Go to Withdraw tab, enter amount, click "Request Withdrawal". Wait 2 days for settlement window. Then click "Complete Withdrawal". This two-day delay protects vault stability.

**Q: Is my money safe?**
A: Yes, for reasonable amounts. Protections: (1) Insurance fund covers exploits, (2) 5-of-9 multisig governance prevents single bad actor, (3) All contracts audited. Risk is <$50K per user until insure fund grows.

**Q: What if funding rates go negative?**
A: Strategy pauses temporarily. Your USDC remains safe, just not earning yield. We wait for positive rates to resume.

**Q: Can I lose money?**
A: In normal conditions: No (market-neutral). Extreme conditions: Possibly (1 in 100 black swan event). Insurance fund covers known exploits.

### Escalation Path

```
User question in Discord
 
Community moderator responds (if straightforward)
 
If technical issue: escalate to ops team
 
If governance issue: escalate to multisig
 
If emergency: trigger emergency hotline
```

---

## 6. Governance Voting Template

### Multisig Proposal Template

```markdown
# Proposal #[N]: [Concise Title]

## Summary
[1-2 sentence description of what this proposal does]

## Motivation
[Why this change is needed]
[Data/evidence supporting the change]

## Specification
[Technical details of implementation]
[Before/after comparison]

## Impact
**Users**: [How does this affect depositors?]
**Vault**: [How does this affect vault health?]
**Protocol**: [How does this affect operations?]

## Risks
[Potential negative consequences]
[Mitigation strategies]

## Timeline
[When will this take effect?]
[Who implements?]

## Voting
- [ ] Signer 1: [Sign/Abstain/Reject]
- [ ] Signer 2: [Sign/Abstain/Reject]
- [ ] Signer 3: [Sign/Abstain/Reject]
- [ ] Signer 4: [Sign/Abstain/Reject]
- [ ] Signer 5: [Sign/Abstain/Reject]
- [ ] Signer 6: [Sign/Abstain/Reject]
- [ ] Signer 7: [Sign/Abstain/Reject]
- [ ] Signer 8: [Sign/Abstain/Reject]
- [ ] Signer 9: [Sign/Abstain/Reject]

**Result**: [Passed 5-of-9] / [Failed 4-of-9]
```

---

## 7. Financial Operations

### Revenue Tracking

```
Daily yield collected: $AMOUNT

Subtracted insurance fund (5%): $AMOUNT_INSURANCE

Subtracted management fee (1%): $AMOUNT_MGMT

Split to treasury (remaining): $AMOUNT_TREASURY

Monthly reconciliation against on-chain records
```

### Treasury Management

**Monthly Reports:**
- Revenue generated
- Expenses incurred (servers, people, etc.)
- Insurance fund balance
- Runway remaining (months of operations paid for)

**Spending Approval:**
- < $5K: Ops lead can approve
- $5K-$50K: Multisig vote required
- > $50K: Community $JANUS vote required (when launched)

---

## 8. Incident Log Template

```markdown
## Incident: [Title]

**Date**: 2026-01-15 14:32 UTC
**Severity**: [Critical / High / Medium / Low]
**Status**: [Open / Resolved]

### Description
[What happened?]

### Impact
- Users affected: [N]
- Funds at risk: $[AMOUNT]
- Duration: [TIME]

### Root Cause
[Why did this happen?]

### Resolution
[How was it fixed?]
[What's the prevention?]

### Lessons Learned
[What will we do differently?]

### Timeline
- 14:32 - Issue detected
- 14:45 - Multisig alerted
- 15:12 - Vault paused
- 16:30 - Root cause identified
- 17:45 - Fix deployed
- 18:00 - Vault resumed
```

---

## 9. Regular Reporting Schedule

### Daily (Email to team)
- Bot uptime %
- TVL change
- Error count
- Support tickets

### Weekly (Discord #updates)
- TVL and APY
- Community highlights
- Upcoming governance votes
- Any issues/resolutions

### Monthly (Blog post + PDF)
- Financial report
- Performance metrics
- Community update
- Roadmap progress

### Quarterly (Investor report)
- Full financial summary
- User growth
- Competitive analysis
- Risk assessment

---

## 10. Contingency Plans

### What if the founder disappears?

1. Multisig takes over all decision-making
2. Community can replace multisig members
3. Protocol continues running (keeper bot is decentralized)
4. Community governance activates immediately
5. DAO takes control

### What if Arc network goes down?

1. Keeper bot pauses (can't send transactions)
2. Vault freezes (no deposits/withdrawals)
3. Users' funds remain safe in contracts
4. Wait for Arc to come back online
5. Resume normal operations

### What if keeper bot crashes?

1. Vault pauses automatically
2. Existing positions remain (frozen)
3. Team investigates crash
4. Deploy backup keeper bot
5. Resume operations
6. Users can withdraw if they want

### What if multisig is compromised?

1. 5 members would need to collude
2. Community can still withdraw (24h delay)
3. Community votes to remove bad signers
4. Replace with new signers
5. Continue operations

---

## Conclusion

Janus is designed to keep running even if bad things happen. This operational manual ensures the protocol can handle emergencies without losing user trust.

Key principle: **Users' funds are always safe, even if everything else breaks.**
