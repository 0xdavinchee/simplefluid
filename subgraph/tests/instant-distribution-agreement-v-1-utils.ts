import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/InstantDistributionAgreementV1/InstantDistributionAgreementV1"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createIndexCreatedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  userData: Bytes
): IndexCreated {
  let indexCreatedEvent = changetype<IndexCreated>(newMockEvent())

  indexCreatedEvent.parameters = new Array()

  indexCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexCreatedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexCreatedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return indexCreatedEvent
}

export function createIndexDistributionClaimedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  subscriber: Address,
  amount: BigInt
): IndexDistributionClaimed {
  let indexDistributionClaimedEvent = changetype<IndexDistributionClaimed>(
    newMockEvent()
  )

  indexDistributionClaimedEvent.parameters = new Array()

  indexDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  indexDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return indexDistributionClaimedEvent
}

export function createIndexSubscribedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  subscriber: Address,
  userData: Bytes
): IndexSubscribed {
  let indexSubscribedEvent = changetype<IndexSubscribed>(newMockEvent())

  indexSubscribedEvent.parameters = new Array()

  indexSubscribedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexSubscribedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexSubscribedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexSubscribedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  indexSubscribedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return indexSubscribedEvent
}

export function createIndexUnitsUpdatedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  subscriber: Address,
  units: BigInt,
  userData: Bytes
): IndexUnitsUpdated {
  let indexUnitsUpdatedEvent = changetype<IndexUnitsUpdated>(newMockEvent())

  indexUnitsUpdatedEvent.parameters = new Array()

  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("units", ethereum.Value.fromUnsignedBigInt(units))
  )
  indexUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return indexUnitsUpdatedEvent
}

export function createIndexUnsubscribedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  subscriber: Address,
  userData: Bytes
): IndexUnsubscribed {
  let indexUnsubscribedEvent = changetype<IndexUnsubscribed>(newMockEvent())

  indexUnsubscribedEvent.parameters = new Array()

  indexUnsubscribedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexUnsubscribedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexUnsubscribedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexUnsubscribedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  indexUnsubscribedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return indexUnsubscribedEvent
}

export function createIndexUpdatedEvent(
  token: Address,
  publisher: Address,
  indexId: BigInt,
  oldIndexValue: BigInt,
  newIndexValue: BigInt,
  totalUnitsPending: BigInt,
  totalUnitsApproved: BigInt,
  userData: Bytes
): IndexUpdated {
  let indexUpdatedEvent = changetype<IndexUpdated>(newMockEvent())

  indexUpdatedEvent.parameters = new Array()

  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldIndexValue",
      ethereum.Value.fromUnsignedBigInt(oldIndexValue)
    )
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newIndexValue",
      ethereum.Value.fromUnsignedBigInt(newIndexValue)
    )
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalUnitsPending",
      ethereum.Value.fromUnsignedBigInt(totalUnitsPending)
    )
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalUnitsApproved",
      ethereum.Value.fromUnsignedBigInt(totalUnitsApproved)
    )
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return indexUpdatedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createSubscriptionApprovedEvent(
  token: Address,
  subscriber: Address,
  publisher: Address,
  indexId: BigInt,
  userData: Bytes
): SubscriptionApproved {
  let subscriptionApprovedEvent = changetype<SubscriptionApproved>(
    newMockEvent()
  )

  subscriptionApprovedEvent.parameters = new Array()

  subscriptionApprovedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  subscriptionApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  subscriptionApprovedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  subscriptionApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  subscriptionApprovedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return subscriptionApprovedEvent
}

export function createSubscriptionDistributionClaimedEvent(
  token: Address,
  subscriber: Address,
  publisher: Address,
  indexId: BigInt,
  amount: BigInt
): SubscriptionDistributionClaimed {
  let subscriptionDistributionClaimedEvent = changetype<
    SubscriptionDistributionClaimed
  >(newMockEvent())

  subscriptionDistributionClaimedEvent.parameters = new Array()

  subscriptionDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  subscriptionDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  subscriptionDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  subscriptionDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  subscriptionDistributionClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return subscriptionDistributionClaimedEvent
}

export function createSubscriptionRevokedEvent(
  token: Address,
  subscriber: Address,
  publisher: Address,
  indexId: BigInt,
  userData: Bytes
): SubscriptionRevoked {
  let subscriptionRevokedEvent = changetype<SubscriptionRevoked>(newMockEvent())

  subscriptionRevokedEvent.parameters = new Array()

  subscriptionRevokedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  subscriptionRevokedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  subscriptionRevokedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  subscriptionRevokedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  subscriptionRevokedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return subscriptionRevokedEvent
}

export function createSubscriptionUnitsUpdatedEvent(
  token: Address,
  subscriber: Address,
  publisher: Address,
  indexId: BigInt,
  units: BigInt,
  userData: Bytes
): SubscriptionUnitsUpdated {
  let subscriptionUnitsUpdatedEvent = changetype<SubscriptionUnitsUpdated>(
    newMockEvent()
  )

  subscriptionUnitsUpdatedEvent.parameters = new Array()

  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromAddress(publisher))
  )
  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("units", ethereum.Value.fromUnsignedBigInt(units))
  )
  subscriptionUnitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("userData", ethereum.Value.fromBytes(userData))
  )

  return subscriptionUnitsUpdatedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
