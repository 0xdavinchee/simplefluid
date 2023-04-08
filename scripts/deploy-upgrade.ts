import hre, { ethers, upgrades } from "hardhat";

async function main() {
  const UpgradeableThing = await ethers.getContractFactory("UpgradeableThing");
  const beacon = await upgrades.deployBeacon(UpgradeableThing);
  await beacon.deployed();
  console.log(beacon.address);

  const upgradeableThing = await upgrades.deployBeaconProxy(
    beacon,
    UpgradeableThing,
    [ethers.constants.AddressZero]
  );
  await upgradeableThing.deployed();
  console.log(upgradeableThing.address);

  const UpgradeableThingV2 = await ethers.getContractFactory(
    "UpgradeableThingV2"
  );
  await upgrades.upgradeBeacon(
    beacon.address,
    UpgradeableThingV2
  );

  await hre.addressExporter.save({
    UpgradeableThingProxy: upgradeableThing.address,
    UpgradeableThingBeacon: beacon.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
