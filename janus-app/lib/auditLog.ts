export interface AuditRecord {
  timestamp: number;
  action: string;
  txHash: string;
  executor: string;
}

export const getAuditLogs = (): AuditRecord[] => {
  return [
    {
      timestamp: Date.now() - 600000,
      action: "Funding Rate Arbitrage Harvest executed (1% performance cut to Insurance)",
      txHash: "0x6ab068fd309bd6caad51186a0cefacf542132444196997e05c28cdbdba065c50",
      executor: "Keeper Node"
    },
    {
      timestamp: Date.now() - 10800000,
      action: "Deposit Capacity Cap set to $10,000,000 Beta Limit",
      txHash: "0xc8d77a0bf435ec92a4e21dae6c2789bd0bcf00e120f269a888c3a1029bd4909a",
      executor: "Multi-Sig Governance"
    }
  ];
};
