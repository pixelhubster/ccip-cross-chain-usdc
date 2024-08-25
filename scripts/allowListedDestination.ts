import { ethers, network } from "hardhat";
import { Wallet } from 'ethers'
import { TransferUSDC__factory, TransferUSDC } from "../typechain-types";

async function main() {
    if (network.name != "avalancheFuji") {
        console.log("Must be on Avalanche Fuji");
        return 1
    }
    // const AVALANCHE_FUJI_ADDRESS = "0x755e3b7D0a101999AC7332E8008F7a27867A722C"
    const AVALANCHE_FUJI_ADDRESS = "0x2075C6929F0FdD1EC0B312bf283b4d70273E83f2"
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const transferUsdc: TransferUSDC = TransferUSDC__factory.connect(AVALANCHE_FUJI_ADDRESS, signer)

    const tx = await transferUsdc.allowlistDestinationChain(16015286601757825753n, true)
    console.log(`Hash: ${tx.hash}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})