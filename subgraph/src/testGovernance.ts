import { BigInt } from "@graphprotocol/graph-ts"
import {
  TestGovernance,
  AppFactoryAuthorizationChanged,
  AppRegistrationKeyChanged,
  CFAv1LiquidationPeriodChanged,
  ConfigChanged,
  PPPConfigurationChanged,
  RewardAddressChanged,
  SuperTokenMinimumDepositChanged,
  TrustedForwarderChanged
} from "../generated/TestGovernance/TestGovernance"
import { ExampleEntity } from "../generated/schema"

export function handleAppFactoryAuthorizationChanged(
  event: AppFactoryAuthorizationChanged
): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count.plusBigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.host = event.params.host
  entity.factory = event.params.factory

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.getConfigAsAddress(...)
  // - contract.getConfigAsUint256(...)
  // - contract.getPPPConfig(...)
  // - contract.getRewardAddress(...)
  // - contract.getSuperTokenMinimumDeposit(...)
  // - contract.isAuthorizedAppFactory(...)
  // - contract.isTrustedForwarder(...)
  // - contract.owner(...)
  // - contract.verifyAppRegistrationKey(...)
}

export function handleAppRegistrationKeyChanged(
  event: AppRegistrationKeyChanged
): void {}

export function handleCFAv1LiquidationPeriodChanged(
  event: CFAv1LiquidationPeriodChanged
): void {}

export function handleConfigChanged(event: ConfigChanged): void {}

export function handlePPPConfigurationChanged(
  event: PPPConfigurationChanged
): void {}

export function handleRewardAddressChanged(event: RewardAddressChanged): void {}

export function handleSuperTokenMinimumDepositChanged(
  event: SuperTokenMinimumDepositChanged
): void {}

export function handleTrustedForwarderChanged(
  event: TrustedForwarderChanged
): void {}
