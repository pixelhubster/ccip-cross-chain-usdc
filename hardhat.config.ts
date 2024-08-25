import { HardhatUserConfig } from "hardhat/config";
import * as dotenvenc from '@chainlink/env-enc'
dotenvenc.config()
import "@nomicfoundation/hardhat-toolbox";

const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.8.20",
      settings: {
        evmVersion: "paris"
      }
    }]
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    avalancheFuji: {
      url: AVALANCHE_FUJI_RPC_URL !== undefined ? AVALANCHE_FUJI_RPC_URL : "",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 43113,
    },
    ethSepolia: {
      url: ETHEREUM_SEPOLIA_RPC_URL !== undefined ? ETHEREUM_SEPOLIA_RPC_URL : "" ,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111
    }
  }
};

export default config;
