import {network, ethers } from "hardhat"
import { Wallet } from "ethers"
import { CrossChainReceiver, CrossChainReceiver__factory } from "../typechain-types"

async function allowListedSource() {
    if (network.name != "ethSepolia") {
        console.log("Must be on Ethereum Sepolia")
        return 1
    }

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL
    const sourceChainSelector = "14767482510784806043"
    // const CrossChainReceiver = "0xF584776c511f02E1F6226d381b4f77CA17EBdC58"
    const CrossChainReceiver = "0xFbBEE88FdfE9B4a55b122423156791be3520D947"

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)

    const ccReceiver: CrossChainReceiver = CrossChainReceiver__factory.connect(CrossChainReceiver, signer)
    const tx = await ccReceiver.allowlistSourceChain(sourceChainSelector, true)
    console.log(`Hash: ${tx.hash}`)
}

allowListedSource().catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})