import { ethers, network } from "hardhat"
import { Wallet } from "ethers"
import { TransferUSDC, TransferUSDC__factory } from "../typechain-types"

async function main() {
    if (network.name != "avalancheFuji") {
        console.log("Must be on Avalanche Fuji")
        return 1
    }

    const AVALANCHE_FUJI_ADDRESS = "0x755e3b7D0a101999AC7332E8008F7a27867A722C"
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string
    const ccipChainSelector = "16015286601757825753"
    const receiver = "0x755e3b7D0a101999AC7332E8008F7a27867A722C"
    const amount = 1000000n
    const gasLimit = 500000n

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY)
    const signer = wallet.connect(provider)

    const transferUsdc: TransferUSDC = TransferUSDC__factory.connect(AVALANCHE_FUJI_ADDRESS, signer)
    const tx = await transferUsdc.transferUsdc(ccipChainSelector, receiver, amount, gasLimit)
    console.log("Hash: $s: ", tx.hash)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})
