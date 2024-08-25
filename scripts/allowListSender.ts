import { ethers, network} from "hardhat"
import { Wallet } from "ethers"
import { CrossChainReceiver, CrossChainReceiver__factory } from "../typechain-types"

async function allowListSender() {

    if (network.name != "ethSepolia") {
        console.log("Must be on Ethereum Sepolia")
        return 1
    }
    // populate varibale
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL
    // const sender = "0x755e3b7D0a101999AC7332E8008F7a27867A722C"
    const sender = "0x2075C6929F0FdD1EC0B312bf283b4d70273E83f2"
    // const CrossChainReceiver = "0xF584776c511f02E1F6226d381b4f77CA17EBdC58"
    const CrossChainReceiver = "0xFbBEE88FdfE9B4a55b122423156791be3520D947"

    // connecting to provider with wallet
    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY)
    const signer = wallet.connect(provider)
    const ccReceiver: CrossChainReceiver = CrossChainReceiver__factory.connect(CrossChainReceiver, signer)
    
    // allowlisting the sender to send messages to the receiver's address
    const tx = await ccReceiver.allowlistSender(sender, true)
    console.log("Hash: %s", tx.hash)
}
allowListSender().catch((error) => {
    console.log(error)
    process.exitCode = 1;
})
