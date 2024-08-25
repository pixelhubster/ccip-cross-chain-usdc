# CCIP Cross Chain USDC Estimate Gas

This project aims at estimating the gas limit for transaction using ccip.

Try running some of the following tasks:

```shell
npm install
npx env-enc set-pw
npx env-enc set
```
Set the local variables needed to run the project.
some are e.g
ETHEREUM_SEPOLIA_RPC_URL
PRIVATE_KEY
AVALANCHE_FUJI_RPC_URL

# Estimate Gas on testnet with Tenderly on Real Testnet
```shell
npx hardhat run ./test/estimateGasTenderly.tx --network avalancheFuji
```
To estimate the gas we be

# Estimate Gas on Real Testnet using MockCCIPRouter
```shell
npx hardhat run ./test/estimateGas.ts --network avalancheFuji
```
