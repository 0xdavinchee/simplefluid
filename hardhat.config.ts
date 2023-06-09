import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-address-exporter";
import "hardhat-contract-sizer";
import "@openzeppelin/hardhat-upgrades";
import "@graphprotocol/hardhat-graph"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./src",
    subgraph: "./subgraph",
  },
  addressExporter: {
    outDir: "./addresses",
  },
  contractSizer: {
    runOnCompile: false,
    outputFile: "out/contract-sizes.json",
  },
};

export default config;
