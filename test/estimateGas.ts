import hre from "hardhat"
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ccipConfig } from "../ccip.config"
import { deployedContracts } from "../deployedContracts"

async function setUp() {

    const [signer] = await hre.ethers.getSigners()
    
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
    // const realRouter = await hre.ethers.getContractAt("MockCCIPRouter", "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59")

    const rpcProvider = process.env.ETHEREUM_SEPOLIA_RPC_URL


    let tx = await linkToken.approve(deployedContracts.mTransferUsdc, hre.ethers.MaxUint256)
    await tx.wait(5);

    console.log(`Link Token approved: ${tx.hash}`)
    const destinationChainSelector = ccipConfig("ethereumSepolia").chainSelector
    const mockReceiver = deployedContracts.mCCReceiver

    const iterations = [0]
    const gasUsageReport = []
    for (const iteration in iterations) {
        tx = await mockTransferUsdc.transferUsdc(destinationChainSelector, mockReceiver, amount, gasLimit);
        const receipt = await tx.wait(5)
        console.log(`Receipt: ${tx.hash}`)
        if (receipt) {

            let latestblockNum = await new hre.ethers.JsonRpcProvider(rpcProvider).getBlockNumber();
            const mockRouterEvents = await ethRouter.queryFilter(
                ethRouter.filters.MsgExecuted, latestblockNum - 100, latestblockNum
            );
            console.log(mockRouterEvents)
            const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
            const gasUsed = mockRouterEvent.args.gasUsed
            console.log(gasUsed)

            // Push the reports and gas used.
            gasUsageReport.push({
                iterations,
                gasUsed: gasUsed,
                gasUsedTen: Number(gasUsed) + (0.1 * Number(gasUsed))
            });

        }

    }
    console.log("Gas usage report")
    gasUsageReport.forEach((report) => {
        console.log(`Iterations: ${report.iterations}, Gas Used: ${report.gasUsed}, Gas Used + 10%: ${report.gasUsedTen}`)
    })
    await sendTransactionUsingEstimatedGas(gasUsageReport[0].gasUsed)
}

async function sendTransactionUsingEstimatedGas(gasLimit: bigint) {
    const ccReceiver = await hre.ethers.getContractAt("CrossChainReceiver", deployedContracts.ccReceiver)
    const transferUsdc = await hre.ethers.getContractAt("TransferUSDC", deployedContracts.transferUsdc)
    const linkToken = await hre.ethers.getContractAt(
        "BurnMintERC677",
        ccipConfig("avalancheFuji").linkToken
    )

    let tx = await linkToken.approve(deployedContracts.transferUsdc, hre.ethers.MaxUint256)
    await tx.wait(5);
    console.log(`Link Token approved: ${tx.hash}`)
    const destinationChainSelector = ccipConfig("ethereumSepolia").chainSelector
    const receiver = deployedContracts.ccReceiver

    try {
        const amount = 1000000
        tx = await transferUsdc.transferUsdc(destinationChainSelector, receiver, amount, gasLimit);
        const receipt = await tx.wait(5)
        console.log(`Receipt : ${receipt}`)
    } catch(error) {
        console.error(error)
    }

}
setUp().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})