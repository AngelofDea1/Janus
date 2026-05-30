export const GOLDSKY_API_URL = "https://api.goldsky.com/api/public/project_cmpr6wyix9tip01x3bubibwp8/subgraphs/janus-vault/1.0.2/gn";

/**
 * Native fetcher for Goldsky GraphQL Subgraphs
 */
export async function fetchGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await fetch(GOLDSKY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    // Use next.js revalidation cache or bypass it
    next: { revalidate: 10 } // Cache results for 10 seconds to avoid spamming the RPC
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`GraphQL HTTP Error: ${response.status} - ${text}`);
    throw new Error(`GraphQL HTTP Error: ${response.status}`);
  }

  const json = await response.json();
  
  if (json.errors) {
    console.error('GraphQL Query Errors:', json.errors);
    throw new Error('GraphQL Query Error');
  }

  return json.data;
}

// Common Queries
export const GET_LATEST_ARBITRAGE_EXECUTIONS = `
  query GetLatestArbitrages($first: Int!) {
    arbitrageExecutions(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      asset
      route
      volume
      spread
      yieldHarvested
      timestamp
      transactionHash
    }
  }
`;

export const GET_VAULT_METRICS = `
  query GetVaultMetrics {
    vaultMetrics(first: 1) {
      id
      totalAssets
      totalYield
      lastUpdated
    }
  }
`;

export const GET_USER_ACTIVITY = `
  query GetUserActivity($owner: Bytes!) {
    deposits(where: { owner: $owner }, orderBy: timestamp, orderDirection: desc, first: 50) {
      id
      assets
      shares
      timestamp
      transactionHash
      vault
    }
    withdraws(where: { owner: $owner }, orderBy: timestamp, orderDirection: desc, first: 50) {
      id
      assets
      shares
      timestamp
      transactionHash
      vault
    }
  }
`;
