import { BigInt } from "@graphprotocol/graph-ts"
import {
  ArbitrageExecuted as ArbitrageExecutedEvent,
  ArbitrageYieldHarvested as ArbitrageYieldHarvestedEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent
} from "../generated/Vault/Vault"
import {
  ArbitrageExecution,
  YieldHarvest,
  Deposit,
  Withdraw,
  VaultMetric
} from "../generated/schema"

function getOrCreateVaultMetric(vaultAddress: string): VaultMetric {
  let metric = VaultMetric.load(vaultAddress)
  if (!metric) {
    metric = new VaultMetric(vaultAddress)
    metric.totalAssets = BigInt.fromI32(0)
    metric.totalYield = BigInt.fromI32(0)
    metric.lastUpdated = BigInt.fromI32(0)
  }
  return metric
}

export function handleArbitrageExecuted(event: ArbitrageExecutedEvent): void {
  let entity = new ArbitrageExecution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.asset = event.params.asset
  entity.route = event.params.route
  entity.volume = event.params.volume
  entity.spread = event.params.spread
  entity.yieldHarvested = event.params.yieldHarvested
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.vault = event.address
  entity.save()
}

export function handleArbitrageYieldHarvested(
  event: ArbitrageYieldHarvestedEvent
): void {
  let entity = new YieldHarvest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.amount = event.params.amount
  entity.totalAssetsAfter = event.params.totalAssetsAfter
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Update Vault Metrics
  let metric = getOrCreateVaultMetric(event.address.toHex())
  metric.totalAssets = event.params.totalAssetsAfter
  metric.totalYield = metric.totalYield.plus(event.params.amount)
  metric.lastUpdated = event.block.timestamp
  metric.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.vault = event.address
  entity.save()

  // Update total assets in metric
  let metric = getOrCreateVaultMetric(event.address.toHex())
  metric.totalAssets = metric.totalAssets.plus(event.params.assets)
  metric.lastUpdated = event.block.timestamp
  metric.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.timestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.vault = event.address
  entity.save()

  // Update total assets in metric
  let metric = getOrCreateVaultMetric(event.address.toHex())
  metric.totalAssets = metric.totalAssets.minus(event.params.assets)
  metric.lastUpdated = event.block.timestamp
  metric.save()
}
