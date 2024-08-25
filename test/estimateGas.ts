import hre from "hardhat"
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ccipConfig } from "../ccip.config"
import { deployedContracts } from "../deployedContracts"

async function setUp() {

    const [signer] = await hre.ethers.getSigners()
    // const router = await hre.ethers.getContractAt("MockCCIPRouter", ccipConfig("ethereumSepolia").router)
    const ccReceiver = await hre.ethers.getContractAt("CrossChainReceiver", deployedContracts.ccReceiver)
    const transferUsdc = await hre.ethers.getContractAt("TransferUSDC", deployedContracts.transferUsdc)
    const mockCCReceiver = await hre.ethers.getContractAt("CrossChainReceiver", deployedContracts.mCCReceiver)
    const mockTransferUsdc = await hre.ethers.getContractAt("TransferUSDC", deployedContracts.mTransferUsdc)

    const linkToken = await hre.ethers.getContractAt(
        "BurnMintERC677",
        ccipConfig("avalancheFuji").linkToken
    )

    const amount = 1000000;
    const gasLimit = 500000

    const fujiRouter = await hre.ethers.getContractAt("MockCCIPRouter", deployedContracts.fujiRouter)
    const ethRouter = await hre.ethers.getContractAt("MockCCIPRouter", deployedContracts.ethRouter)
    const realRouter = await hre.ethers.getContractAt("MockCCIPRouter", "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59")

    let latestblockNum = await hre.ethers.provider.getBlockNumber()
    const mockRouterEvents = await realRouter.queryFilter(
        realRouter.filters.MsgExecuted, latestblockNum - 1000, "latest"
    );
    console.log(mockRouterEvents)
    const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
    const gasUsed = mockRouterEvent.args.gasUsed
    console.log(gasUsed)
    // let tx = await linkToken.approve(deployedContracts.transferUsdc, hre.ethers.MaxUint256)
    // await tx.wait(5);
    let tx = await linkToken.approve(deployedContracts.mTransferUsdc, hre.ethers.MaxUint256)
    await tx.wait(5);

    console.log(`Link Token approved: ${tx.hash}`)
    const destinationChainSelector = ccipConfig("ethereumSepolia").chainSelector
    const receiver = deployedContracts.ccReceiver
    const mockReceiver = deployedContracts.mCCReceiver
    // let tx = await linkToken.approve(deployedContracts.mTransferUsdc, hre.ethers.MaxUint256)
    // await tx.wait(5);
    // console.log(`Link Token approved: ${tx.hash}`)
    // const gasLimit = 500000
    // const destinationChainSelector = ccipConfig("ethereumSepolia").chainSelector
    // const receiver = deployedContracts.mCCReceiver

    const iterations = [0]
    const messageIds = [];
    const gasUsageReport = []
    for (const iteration in iterations) {
        tx = await mockTransferUsdc.transferUsdc(destinationChainSelector, mockReceiver, amount, gasLimit);
        const receipt = await tx.wait(5)
        console.log(`Receipt: ${tx.hash}`)
        if (receipt) {

            // const router = await ethRouter.getAddress();
            // console.log(router)
            // const mockRouterEvents = await ethRouter.queryFilter(
            //     fujiRouter.filters["MessageExecuted(bytes32,uint64,address,bytes32)"]
            // );
            // console.log(mockRouterEvents)

            // Retrieve gas used from the last message executed by querying the router's events.
            const mockRouterEvents = await ethRouter.queryFilter(
                ethRouter.filters.MsgExecuted
                // fujiRouter.filters["MsgExecuted(bool,bytes,uint256)"]
            );
            console.log(mockRouterEvents)
            const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
            const gasUsed = mockRouterEvent.args.gasUsed;
            console.log(gasUsed)
            // Push the report of iterations and gas used to the array.
            gasUsageReport.push({
                iterations,
                gasUsed: gasUsed.toString(),
            });



            // console.log(receipt.logs)
            // console.log(receipt.gasUsed)



            // for (const mylog in receipt.logs) {
            // const parsedLog =  mtransferUsdc.interface.parseLog({ data: receipt.logs[mylog].data, topics: receipt.logs[mylog].topics} );
            // console.log(parsedLog)

            //   const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
            //   const gasUsed = mockRouterEvent.args.gasUsed;
            //   console.log(`Gas used: ${gasUsed.toString()}`)


            // if (parsedLog && parsedLog.name === "MessageSent") {
            //     const msgId = await parsedLog.args.messageId;
            //     console.log(`Message Id: ${msgId}`);

            //     messageIds.push({
            //         iteration,
            //         gasLimit, 
            //         msgId
            //     })
            // }
            // }
        }

    }

    // return { ccReceiver,  transferUsdc}
}
setUp().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})