import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  IndexCreated as IndexCreatedEvent,
  IndexDistributionClaimed as IndexDistributionClaimedEvent,
  IndexSubscribed as IndexSubscribedEvent,
  IndexUnitsUpdated as IndexUnitsUpdatedEvent,
  IndexUnsubscribed as IndexUnsubscribedEvent,
  IndexUpdated as IndexUpdatedEvent,
  Initialized as InitializedEvent,
  SubscriptionApproved as SubscriptionApprovedEvent,
  SubscriptionDistributionClaimed as SubscriptionDistributionClaimedEvent,
  SubscriptionRevoked as SubscriptionRevokedEvent,
  SubscriptionUnitsUpdated as SubscriptionUnitsUpdatedEvent,
  Upgraded as UpgradedEvent
} from "../generated/InstantDistributionAgreementV1/InstantDistributionAgreementV1"
import {
  AdminChanged,
  BeaconUpgraded,
  IndexCreated,
  IndexDistributionClaimed,
  IndexSubscribed,
  IndexUnitsUpdated,
  IndexUnsubscribed,
  IndexUpdated,
  Initialized,
  SubscriptionApproved,
  SubscriptionDistributionClaimed,
  SubscriptionRevoked,
  SubscriptionUnitsUpdated,
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

export function handleIndexCreated(event: IndexCreatedEvent): void {
  let entity = new IndexCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexDistributionClaimed(
  event: IndexDistributionClaimedEvent
): void {
  let entity = new IndexDistributionClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.subscriber = event.params.subscriber
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexSubscribed(event: IndexSubscribedEvent): void {
  let entity = new IndexSubscribed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.subscriber = event.params.subscriber
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexUnitsUpdated(event: IndexUnitsUpdatedEvent): void {
  let entity = new IndexUnitsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.subscriber = event.params.subscriber
  entity.units = event.params.units
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexUnsubscribed(event: IndexUnsubscribedEvent): void {
  let entity = new IndexUnsubscribed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.subscriber = event.params.subscriber
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIndexUpdated(event: IndexUpdatedEvent): void {
  let entity = new IndexUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.oldIndexValue = event.params.oldIndexValue
  entity.newIndexValue = event.params.newIndexValue
  entity.totalUnitsPending = event.params.totalUnitsPending
  entity.totalUnitsApproved = event.params.totalUnitsApproved
  entity.userData = event.params.userData

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

export function handleSubscriptionApproved(
  event: SubscriptionApprovedEvent
): void {
  let entity = new SubscriptionApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.subscriber = event.params.subscriber
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionDistributionClaimed(
  event: SubscriptionDistributionClaimedEvent
): void {
  let entity = new SubscriptionDistributionClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.subscriber = event.params.subscriber
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionRevoked(
  event: SubscriptionRevokedEvent
): void {
  let entity = new SubscriptionRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.subscriber = event.params.subscriber
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.userData = event.params.userData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionUnitsUpdated(
  event: SubscriptionUnitsUpdatedEvent
): void {
  let entity = new SubscriptionUnitsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.subscriber = event.params.subscriber
  entity.publisher = event.params.publisher
  entity.indexId = event.params.indexId
  entity.units = event.params.units
  entity.userData = event.params.userData

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
