import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  FlowOperatorUpdated as FlowOperatorUpdatedEvent,
  FlowUpdated as FlowUpdatedEvent,
  FlowUpdatedExtension as FlowUpdatedExtensionEvent,
  Initialized as InitializedEvent,
  Upgraded as UpgradedEvent
} from "../generated/ConstantFlowAgreementV1/ConstantFlowAgreementV1"
import {
  AdminChanged,
  BeaconUpgraded,
  FlowOperatorUpdated,
  FlowUpdated,
  FlowUpdatedExtension,
  Initialized,
  Upgraded
} from "../generated/schema"

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beacon = event.params.beacon

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFlowOperatorUpdated(
  event: FlowOperatorUpdatedEvent
): void {
  let entity = new FlowOperatorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.sender = event.params.sender
  entity.flowOperator = event.params.flowOperator
  entity.permissions = event.params.permissions
  entity.flowRateAllowance = event.params.flowRateAllowance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFlowUpdated(event: FlowUpdatedEvent): void {
  let entity = new FlowUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.flowRate = event.params.flowRate
  entity.totalSenderFlowRate = event.params.totalSenderFlowRate
  entity.totalReceiverFlowRate = event.params.totalReceiverFlowRate
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFlowUpdatedExtension(
  event: FlowUpdatedExtensionEvent
): void {
  let entity = new FlowUpdatedExtension(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.flowOperator = event.params.flowOperator
  entity.deposit = event.params.deposit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
