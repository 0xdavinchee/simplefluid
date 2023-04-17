import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/Superfluid/Superfluid"

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

export function createAgreementClassRegisteredEvent(
  agreementType: Bytes,
  code: Address
): AgreementClassRegistered {
  let agreementClassRegisteredEvent = changetype<AgreementClassRegistered>(
    newMockEvent()
  )

  agreementClassRegisteredEvent.parameters = new Array()

  agreementClassRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agreementType",
      ethereum.Value.fromFixedBytes(agreementType)
    )
  )
  agreementClassRegisteredEvent.parameters.push(
    new ethereum.EventParam("code", ethereum.Value.fromAddress(code))
  )

  return agreementClassRegisteredEvent
}

export function createAgreementClassUpdatedEvent(
  agreementType: Bytes,
  code: Address
): AgreementClassUpdated {
  let agreementClassUpdatedEvent = changetype<AgreementClassUpdated>(
    newMockEvent()
  )

  agreementClassUpdatedEvent.parameters = new Array()

  agreementClassUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "agreementType",
      ethereum.Value.fromFixedBytes(agreementType)
    )
  )
  agreementClassUpdatedEvent.parameters.push(
    new ethereum.EventParam("code", ethereum.Value.fromAddress(code))
  )

  return agreementClassUpdatedEvent
}

export function createAppRegisteredEvent(app: Address): AppRegistered {
  let appRegisteredEvent = changetype<AppRegistered>(newMockEvent())

  appRegisteredEvent.parameters = new Array()

  appRegisteredEvent.parameters.push(
    new ethereum.EventParam("app", ethereum.Value.fromAddress(app))
  )

  return appRegisteredEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createGovernanceReplacedEvent(
  oldGov: Address,
  newGov: Address
): GovernanceReplaced {
  let governanceReplacedEvent = changetype<GovernanceReplaced>(newMockEvent())

  governanceReplacedEvent.parameters = new Array()

  governanceReplacedEvent.parameters.push(
    new ethereum.EventParam("oldGov", ethereum.Value.fromAddress(oldGov))
  )
  governanceReplacedEvent.parameters.push(
    new ethereum.EventParam("newGov", ethereum.Value.fromAddress(newGov))
  )

  return governanceReplacedEvent
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

export function createJailEvent(app: Address, reason: BigInt): Jail {
  let jailEvent = changetype<Jail>(newMockEvent())

  jailEvent.parameters = new Array()

  jailEvent.parameters.push(
    new ethereum.EventParam("app", ethereum.Value.fromAddress(app))
  )
  jailEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromUnsignedBigInt(reason))
  )

  return jailEvent
}

export function createSuperTokenFactoryUpdatedEvent(
  newFactory: Address
): SuperTokenFactoryUpdated {
  let superTokenFactoryUpdatedEvent = changetype<SuperTokenFactoryUpdated>(
    newMockEvent()
  )

  superTokenFactoryUpdatedEvent.parameters = new Array()

  superTokenFactoryUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFactory",
      ethereum.Value.fromAddress(newFactory)
    )
  )

  return superTokenFactoryUpdatedEvent
}

export function createSuperTokenLogicUpdatedEvent(
  token: Address,
  code: Address
): SuperTokenLogicUpdated {
  let superTokenLogicUpdatedEvent = changetype<SuperTokenLogicUpdated>(
    newMockEvent()
  )

  superTokenLogicUpdatedEvent.parameters = new Array()

  superTokenLogicUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  superTokenLogicUpdatedEvent.parameters.push(
    new ethereum.EventParam("code", ethereum.Value.fromAddress(code))
  )

  return superTokenLogicUpdatedEvent
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
