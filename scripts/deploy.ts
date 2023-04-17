import hre, { ethers } from "hardhat";

interface ContractInfo {
  contractName: string;
  address: string;
}

async function graph(info: ContractInfo) {
  await hre.run("graph", info);
  console.log({ info });
}

async function main() {
  const signers = await ethers.getSigners();
  const SuperfluidERC1967ProxyFactory = await ethers.getContractFactory(
    "SuperfluidERC1967Proxy"
  );
  const TestGovernanceFactory = await ethers.getContractFactory(
    "TestGovernance"
  );
  const testGovernanceLogic = await TestGovernanceFactory.deploy();

  const testGovernanceProxy = await SuperfluidERC1967ProxyFactory.deploy(
    testGovernanceLogic.address,
    "0x"
  );
  const testGovernance = TestGovernanceFactory.attach(
    testGovernanceProxy.address
  );
  await graph({
    contractName: "TestGovernance",
    address: testGovernance.address,
  });

  const SuperfluidFactory = await ethers.getContractFactory("Superfluid");
  const superfluidLogic = await SuperfluidFactory.deploy();

  const superfluidInitializeCallData =
    SuperfluidFactory.interface.encodeFunctionData("initialize", [
      testGovernanceProxy.address,
      true,
      false,
    ]);

  const superfluidProxy = await SuperfluidERC1967ProxyFactory.deploy(
    superfluidLogic.address,
    superfluidInitializeCallData
  );

  const superfluid = SuperfluidFactory.attach(superfluidProxy.address);

  await graph({ contractName: "Superfluid", address: superfluid.address });

  await testGovernance.initialize(
    superfluid.address,
    signers[0].address,
    4 * 60 * 60,
    30 * 60,
    []
  );

  const ConstantFlowAgreementV1Factory = await ethers.getContractFactory(
    "ConstantFlowAgreementV1"
  );
  const constantFlowAgreementV1Logic =
    await ConstantFlowAgreementV1Factory.deploy();
  const cfaInitializeCallData =
    ConstantFlowAgreementV1Factory.interface.encodeFunctionData("initialize", [
      superfluid.address,
    ]);
  const constantFlowAgreementV1Proxy =
    await SuperfluidERC1967ProxyFactory.deploy(
      constantFlowAgreementV1Logic.address,
      cfaInitializeCallData
    );
  const constantFlowAgreementV1 = ConstantFlowAgreementV1Factory.attach(
    constantFlowAgreementV1Proxy.address
  );
  await graph({
    contractName: "ConstantFlowAgreementV1",
    address: constantFlowAgreementV1.address,
  });

  await testGovernance.registerAgreementClass(
    superfluid.address,
    constantFlowAgreementV1.address
  );

  const SlotsBitmapLibraryFactory = await ethers.getContractFactory(
    "SlotsBitmapLibrary"
  );
  const slotsBitmapLibrary = await SlotsBitmapLibraryFactory.deploy();
  const InstantDistributionAgreementV1Factory = await ethers.getContractFactory(
    "InstantDistributionAgreementV1",
    {
      libraries: {
        SlotsBitmapLibrary: slotsBitmapLibrary.address,
      },
    }
  );
  const instantDistributionAgreementV1Logic =
    await InstantDistributionAgreementV1Factory.deploy();

  const idaInitializeCallData =
    InstantDistributionAgreementV1Factory.interface.encodeFunctionData(
      "initialize",
      [superfluid.address]
    );
  const instantDistributionAgreementV1Proxy =
    await SuperfluidERC1967ProxyFactory.deploy(
      instantDistributionAgreementV1Logic.address,
      idaInitializeCallData
    );
  const instantDistributionAgreementV1 =
    InstantDistributionAgreementV1Factory.attach(
      instantDistributionAgreementV1Proxy.address
    );
  await graph({
    contractName: "InstantDistributionAgreementV1",
    address: instantDistributionAgreementV1.address,
  });

  await testGovernance.registerAgreementClass(
    superfluid.address,
    instantDistributionAgreementV1.address
  );

  const SuperTokenFactory = await ethers.getContractFactory("SuperToken");
  const superTokenLogic = await SuperTokenFactory.deploy();
  const SuperTokenFactoryFactory = await ethers.getContractFactory(
    "SuperTokenFactory"
  );
  const superTokenFactoryLogic = await SuperTokenFactoryFactory.deploy();
  const UpgradeableBeaconFactory = await ethers.getContractFactory(
    "UpgradeableBeacon"
  );
  const superTokenBeacon = await UpgradeableBeaconFactory.deploy(
    superTokenLogic.address
  );
  const superTokenFactoryInitializeCallData =
    SuperTokenFactoryFactory.interface.encodeFunctionData("initialize", [
      superfluid.address,
      superTokenBeacon.address,
    ]);
  const superTokenFactoryProxy = await SuperfluidERC1967ProxyFactory.deploy(
    superTokenFactoryLogic.address,
    superTokenFactoryInitializeCallData
  );
  const superTokenFactory = SuperTokenFactoryFactory.attach(
    superTokenFactoryProxy.address
  );
  await graph({
    contractName: "SuperTokenFactory",
    address: superTokenFactory.address,
  });

  const ConstantOutflowNFTFactory = await ethers.getContractFactory(
    "ConstantOutflowNFT"
  );
  const constantOutflowNFTLogic = await ConstantOutflowNFTFactory.deploy();
  const constantOutflowNFTInitializeCallData =
    constantOutflowNFTLogic.interface.encodeFunctionData("initialize", [
      superTokenLogic.address,
      constantFlowAgreementV1.address,
      "Constant Outflow NFT",
      "COF",
    ]);
  const constantOutflowNFTProxy = await SuperfluidERC1967ProxyFactory.deploy(
    constantOutflowNFTLogic.address,
    constantOutflowNFTInitializeCallData
  );
  const constantOutflowNFT = ConstantOutflowNFTFactory.attach(
    constantOutflowNFTProxy.address
  );

  await graph({
    contractName: "ConstantOutflowNFT",
    address: constantOutflowNFT.address,
  });

  const ConstantInflowNFTFactory = await ethers.getContractFactory(
    "ConstantInflowNFT"
  );
  const constantInflowNFTLogic = await ConstantInflowNFTFactory.deploy();
  const constantInflowNFTInitializeCallData =
    constantInflowNFTLogic.interface.encodeFunctionData("initialize", [
      superTokenLogic.address,
      constantFlowAgreementV1.address,
      "Constant Inflow NFT",
      "CIF",
    ]);
  const constantInflowNFTProxy = await SuperfluidERC1967ProxyFactory.deploy(
    constantInflowNFTLogic.address,
    constantInflowNFTInitializeCallData
  );
  const constantInflowNFT = ConstantInflowNFTFactory.attach(
    constantInflowNFTProxy.address
  );

  await graph({
    contractName: "ConstantInflowNFT",
    address: constantInflowNFT.address,
  });

  await testGovernance.updateContracts(
    superfluid.address,
    ethers.constants.AddressZero,
    [],
    superTokenFactory.address,
    superTokenBeacon.address
  );
  await superTokenLogic.initializeLogic(
    superfluid.address,
    constantOutflowNFT.address,
    constantInflowNFT.address
  );

  const TestResolverFactory = await ethers.getContractFactory("TestResolver");
  const testResolver = await TestResolverFactory.deploy(signers[0].address);

  await graph({
    contractName: "TestResolver",
    address: testResolver.address,
  });

  const SuperfluidLoaderFactory = await ethers.getContractFactory(
    "SuperfluidLoader"
  );
  const superfluidLoader = await SuperfluidLoaderFactory.deploy(
    testResolver.address
  );

  console.log({
    testGovernanceLogic: testGovernanceLogic.address,
    testGovernance: testGovernance.address,
    superfluidLogic: superfluidLogic.address,
    superfluid: superfluid.address,
    constantFlowAgreementV1Logic: constantFlowAgreementV1Logic.address,
    constantFlowAgreementV1: constantFlowAgreementV1.address,
    instantDistributionAgreementV1Logic:
      instantDistributionAgreementV1Logic.address,
    instantDistributionAgreementV1: instantDistributionAgreementV1.address,
    slotsBitmapLibrary: slotsBitmapLibrary.address,
    superTokenLogic: superTokenLogic.address,
    superTokenFactoryLogic: superTokenFactoryLogic.address,
    superTokenFactory: superTokenFactory.address,
    superTokenBeacon: superTokenBeacon.address,
    constantOutflowNFTLogic: constantOutflowNFTLogic.address,
    constantOutflowNFT: constantOutflowNFT.address,
    constantInflowNFTLogic: constantInflowNFTLogic.address,
    constantInflowNFT: constantInflowNFT.address,
    testResolver: testResolver.address,
    superfluidLoader: superfluidLoader.address,
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
