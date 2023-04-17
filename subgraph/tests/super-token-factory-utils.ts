import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  CustomSuperTokenCreated,
  Initialized,
  SuperTokenCreated,
  SuperTokenLogicCreated,
  Upgraded
} from "../generated/SuperTokenFactory/SuperTokenFactory"

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

export function createCustomSuperTokenCreatedEvent(
  token: Address
): CustomSuperTokenCreated {
  let customSuperTokenCreatedEvent = changetype<CustomSuperTokenCreated>(
    newMockEvent()
  )

  customSuperTokenCreatedEvent.parameters = new Array()

  customSuperTokenCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return customSuperTokenCreatedEvent
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

export function createSuperTokenCreatedEvent(
  token: Address
): SuperTokenCreated {
  let superTokenCreatedEvent = changetype<SuperTokenCreated>(newMockEvent())

  superTokenCreatedEvent.parameters = new Array()

  superTokenCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return superTokenCreatedEvent
}

export function createSuperTokenLogicCreatedEvent(
  tokenLogic: Address
): SuperTokenLogicCreated {
  let superTokenLogicCreatedEvent = changetype<SuperTokenLogicCreated>(
    newMockEvent()
  )

  superTokenLogicCreatedEvent.parameters = new Array()

  superTokenLogicCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenLogic",
      ethereum.Value.fromAddress(tokenLogic)
    )
  )

  return superTokenLogicCreatedEvent
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
