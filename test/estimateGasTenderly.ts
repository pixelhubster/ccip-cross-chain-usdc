import hre from "hardhat"
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ccipConfig } from "../ccip.config"
import { deployedContracts } from "../deployedContracts"

async function setUp() {

    const [signer] = await hre.ethers.getSigners()
    // const router = await hre.ethers.getContractAt("MockCCIPRouter", ccipConfig("ethereumSepolia").router)
    // const ccReceiver = await hre.ethers.getContractAt("CrossChainReceiver", deployedContracts.ccReceiver)
    const transferUsdc = await hre.ethers.getContractAt("TransferUSDC", deployedContracts.transferUsdc)
    // const mockCCReceiver = await hre.ethers.getContractAt("CrossChainReceiver", deployedContracts.mCCReceiver)
    // const mockTransferUsdc = await hre.ethers.getContractAt("TransferUSDC", deployedContracts.mTransferUsdc)

    const linkToken = await hre.ethers.getContractAt(
        "BurnMintERC677",
        ccipConfig("avalancheFuji").linkToken
    )

    const amount = 1000000;
    const gasLimit = 500000

    // const fujiRouter = await hre.ethers.getContractAt("MockCCIPRouter", deployedContracts.fujiRouter)
    // const ethRouter = await hre.ethers.getContractAt("MockCCIPRouter", deployedContracts.ethRouter)

    let tx = await linkToken.approve(deployedContracts.transferUsdc, hre.ethers.MaxUint256)
    await tx.wait(5);

    console.log(`Link Token approved: ${tx.hash}`)
    const destinationChainSelector = ccipConfig("ethereumSepolia").chainSelector
    const receiver = deployedContracts.ccReceiver

    const iterations = [0]
    const messageIds = [];
    // const gasUsageReport = []
    for (const iteration in iterations) {
        tx = await transferUsdc.transferUsdc(destinationChainSelector, receiver, amount, gasLimit);
        const receipt = await tx.wait(5)
        console.log(`Receipt: ${tx.hash}`)
        if (receipt) {

            // console.log(receipt.logs)
            console.log(receipt.gasUsed)
            console.log(`Receipt Logs ${receipt.logs}`)
            for (const mylog in receipt.logs) {
                console.log(`my logs ${mylog}`)
                // const parsedLog = transferUsdc.interface.parseLog({ data: receipt.logs[mylog].data, topics: receipt.logs[mylog].topics });
                const parsedLog = transferUsdc.interface.parseLog(mylog as any);
                console.log(parsedLog)

                if (parsedLog && parsedLog.name === "UsdcTransferred") {
                    const msgId = await parsedLog.args.messageId || await parsedLog.args[0];
                    // console.log(`Message Id: ${msgId}`);

                    messageIds.push({
                        iteration,
                        gasLimit,
                        msgId
                    })
                    console.log(`Transferred USDC with message id: ${msgId}`)
                }
            }
        }

    }

    console.log("Please use the messageId in tenderly to get the gasprice.")

}
setUp().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})