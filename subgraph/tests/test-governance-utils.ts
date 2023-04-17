import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AppFactoryAuthorizationChanged,
  AppRegistrationKeyChanged,
  CFAv1LiquidationPeriodChanged,
  ConfigChanged,
  PPPConfigurationChanged,
  RewardAddressChanged,
  SuperTokenMinimumDepositChanged,
  TrustedForwarderChanged
} from "../generated/TestGovernance/TestGovernance"

export function createAppFactoryAuthorizationChangedEvent(
  host: Address,
  factory: Address,
  authorized: boolean
): AppFactoryAuthorizationChanged {
  let appFactoryAuthorizationChangedEvent = changetype<
    AppFactoryAuthorizationChanged
  >(newMockEvent())

  appFactoryAuthorizationChangedEvent.parameters = new Array()

  appFactoryAuthorizationChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  appFactoryAuthorizationChangedEvent.parameters.push(
    new ethereum.EventParam("factory", ethereum.Value.fromAddress(factory))
  )
  appFactoryAuthorizationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "authorized",
      ethereum.Value.fromBoolean(authorized)
    )
  )

  return appFactoryAuthorizationChangedEvent
}

export function createAppRegistrationKeyChangedEvent(
  host: Address,
  deployer: Address,
  appRegistrationKey: string,
  expirationTs: BigInt
): AppRegistrationKeyChanged {
  let appRegistrationKeyChangedEvent = changetype<AppRegistrationKeyChanged>(
    newMockEvent()
  )

  appRegistrationKeyChangedEvent.parameters = new Array()

  appRegistrationKeyChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  appRegistrationKeyChangedEvent.parameters.push(
    new ethereum.EventParam("deployer", ethereum.Value.fromAddress(deployer))
  )
  appRegistrationKeyChangedEvent.parameters.push(
    new ethereum.EventParam(
      "appRegistrationKey",
      ethereum.Value.fromString(appRegistrationKey)
    )
  )
  appRegistrationKeyChangedEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTs",
      ethereum.Value.fromUnsignedBigInt(expirationTs)
    )
  )

  return appRegistrationKeyChangedEvent
}

export function createCFAv1LiquidationPeriodChangedEvent(
  host: Address,
  superToken: Address,
  isKeySet: boolean,
  liquidationPeriod: BigInt
): CFAv1LiquidationPeriodChanged {
  let cfAv1LiquidationPeriodChangedEvent = changetype<
    CFAv1LiquidationPeriodChanged
  >(newMockEvent())

  cfAv1LiquidationPeriodChangedEvent.parameters = new Array()

  cfAv1LiquidationPeriodChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  cfAv1LiquidationPeriodChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  cfAv1LiquidationPeriodChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  cfAv1LiquidationPeriodChangedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidationPeriod",
      ethereum.Value.fromUnsignedBigInt(liquidationPeriod)
    )
  )

  return cfAv1LiquidationPeriodChangedEvent
}

export function createConfigChangedEvent(
  host: Address,
  superToken: Address,
  key: Bytes,
  isKeySet: boolean,
  value: BigInt
): ConfigChanged {
  let configChangedEvent = changetype<ConfigChanged>(newMockEvent())

  configChangedEvent.parameters = new Array()

  configChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  configChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  configChangedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromFixedBytes(key))
  )
  configChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  configChangedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return configChangedEvent
}

export function createPPPConfigurationChangedEvent(
  host: Address,
  superToken: Address,
  isKeySet: boolean,
  liquidationPeriod: BigInt,
  patricianPeriod: BigInt
): PPPConfigurationChanged {
  let pppConfigurationChangedEvent = changetype<PPPConfigurationChanged>(
    newMockEvent()
  )

  pppConfigurationChangedEvent.parameters = new Array()

  pppConfigurationChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  pppConfigurationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  pppConfigurationChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  pppConfigurationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidationPeriod",
      ethereum.Value.fromUnsignedBigInt(liquidationPeriod)
    )
  )
  pppConfigurationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "patricianPeriod",
      ethereum.Value.fromUnsignedBigInt(patricianPeriod)
    )
  )

  return pppConfigurationChangedEvent
}

export function createRewardAddressChangedEvent(
  host: Address,
  superToken: Address,
  isKeySet: boolean,
  rewardAddress: Address
): RewardAddressChanged {
  let rewardAddressChangedEvent = changetype<RewardAddressChanged>(
    newMockEvent()
  )

  rewardAddressChangedEvent.parameters = new Array()

  rewardAddressChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  rewardAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  rewardAddressChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  rewardAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardAddress",
      ethereum.Value.fromAddress(rewardAddress)
    )
  )

  return rewardAddressChangedEvent
}

export function createSuperTokenMinimumDepositChangedEvent(
  host: Address,
  superToken: Address,
  isKeySet: boolean,
  minimumDeposit: BigInt
): SuperTokenMinimumDepositChanged {
  let superTokenMinimumDepositChangedEvent = changetype<
    SuperTokenMinimumDepositChanged
  >(newMockEvent())

  superTokenMinimumDepositChangedEvent.parameters = new Array()

  superTokenMinimumDepositChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  superTokenMinimumDepositChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  superTokenMinimumDepositChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  superTokenMinimumDepositChangedEvent.parameters.push(
    new ethereum.EventParam(
      "minimumDeposit",
      ethereum.Value.fromUnsignedBigInt(minimumDeposit)
    )
  )

  return superTokenMinimumDepositChangedEvent
}

export function createTrustedForwarderChangedEvent(
  host: Address,
  superToken: Address,
  isKeySet: boolean,
  forwarder: Address,
  enabled: boolean
): TrustedForwarderChanged {
  let trustedForwarderChangedEvent = changetype<TrustedForwarderChanged>(
    newMockEvent()
  )

  trustedForwarderChangedEvent.parameters = new Array()

  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam("host", ethereum.Value.fromAddress(host))
  )
  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam(
      "superToken",
      ethereum.Value.fromAddress(superToken)
    )
  )
  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam("isKeySet", ethereum.Value.fromBoolean(isKeySet))
  )
  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam("forwarder", ethereum.Value.fromAddress(forwarder))
  )
  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return trustedForwarderChangedEvent
}
