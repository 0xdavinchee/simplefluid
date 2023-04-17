import {
  AdminChanged as AdminChangedEvent,
  AgreementClassRegistered as AgreementClassRegisteredEvent,
  AgreementClassUpdated as AgreementClassUpdatedEvent,
  AppRegistered as AppRegisteredEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  GovernanceReplaced as GovernanceReplacedEvent,
  Initialized as InitializedEvent,
  Jail as JailEvent,
  SuperTokenFactoryUpdated as SuperTokenFactoryUpdatedEvent,
  SuperTokenLogicUpdated as SuperTokenLogicUpdatedEvent,
  Upgraded as UpgradedEvent
} from "../generated/Superfluid/Superfluid"
import {
  AdminChanged,
  AgreementClassRegistered,
  AgreementClassUpdated,
  AppRegistered,
  BeaconUpgraded,
  GovernanceReplaced,
  Initialized,
  Jail,
  SuperTokenFactoryUpdated,
  SuperTokenLogicUpdated,
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

export function handleAgreementClassRegistered(
  event: AgreementClassRegisteredEvent
): void {
  let entity = new AgreementClassRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agreementType = event.params.agreementType
  entity.code = event.params.code

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAgreementClassUpdated(
  event: AgreementClassUpdatedEvent
): void {
  let entity = new AgreementClassUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agreementType = event.params.agreementType
  entity.code = event.params.code

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppRegistered(event: AppRegisteredEvent): void {
  let entity = new AppRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.app = event.params.app

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

export function handleGovernanceReplaced(event: GovernanceReplacedEvent): void {
  let entity = new GovernanceReplaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldGov = event.params.oldGov
  entity.newGov = event.params.newGov

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

export function handleJail(event: JailEvent): void {
  let entity = new Jail(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.app = event.params.app
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSuperTokenFactoryUpdated(
  event: SuperTokenFactoryUpdatedEvent
): void {
  let entity = new SuperTokenFactoryUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newFactory = event.params.newFactory

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSuperTokenLogicUpdated(
  event: SuperTokenLogicUpdatedEvent
): void {
  let entity = new SuperTokenLogicUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.code = event.params.code

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
