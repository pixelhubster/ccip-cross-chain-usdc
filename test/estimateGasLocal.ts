// import hre from "hardhat"
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

// describe("EstimateGas", function () {
//     async function setUp() {
//         const MockRouter = await hre.ethers.getContractFactory("MockCCIPRouter")
//         const mockRouter = await MockRouter.deploy()

//         // contract Address
//         // const usdcToken = "0x5425890298aed601595a70AB815c96711a31Bc65"
//         // const cometAddress = "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e"
//         // const linkToken = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"
//         // const swapAddress = "0xba9F4F7BF70D4c16A8F0677DBB895B1BdBf696D9"

//         // destination and source chain selector
//         const destinationChain = "16015286601757825753"
//         const sourceChain = "14767482510784806043"

//         const BurnMint677 =  await hre.ethers.getContractFactory("BurnMintERC677")
//         const link = await BurnMint677.deploy(
//             "Chain Link",
//             "LINK",
//             18,
//             BigInt(1e27)
//         )
//         const usdcToken = await BurnMint677.deploy(
//             "Usdc Token",
//             "USDC",
//             18,
//             BigInt(1e27)
//         )
//         const compoundToken = await BurnMint677.deploy(
//             "Compound Token",
//             "COMP",
//             18,
//             BigInt(1e27)
//         )

//         // deploy contracts
//         const SwapTestnet = await hre.ethers.getContractFactory("SwapTestnetUSDC")
//         const swapTestnet = await SwapTestnet.deploy(usdcToken, compoundToken, fauceteer)
//         const CCReceiver = await hre.ethers.getContractFactory("CrossChainReceiver")
//         const ccReceiver = await CCReceiver.deploy(mockRouter, cometAddress, swapAddress)

//         const TransferUsdc = await hre.ethers.getContractFactory("TransferUSDC")
//         const transferUsdc = await TransferUsdc.deploy(mockRouter, link, usdcToken)

//         // allowlisting chain and sender addr
//         await transferUsdc.allowlistDestinationChain(destinationChain, true)
//         await ccReceiver.allowlistSender(ccReceiver.target, true)
//         await ccReceiver.allowlistSourceChain(sourceChain, true)

//         console.log("Deployed contracts")
//         return { mockRouter, ccReceiver,  transferUsdc, destinationChain}
//     }
//     it("Should estimate gas for message ", async () => {
//         const { mockRouter, ccReceiver, transferUsdc, destinationChain } = await loadFixture(setUp)

//         const testParams = [0, 50, 99]
//         const gasLimit = 500000
//         const gasUsageReport = []
//         const amount = 0;
//         for (const test of testParams) {
//             await transferUsdc.transferUsdc(destinationChain ,ccReceiver, amount, gasLimit)

//             const mockRouterEvents = await mockRouter.queryFilter(mockRouter.filters.MsgExecuted)

//             const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]
//             const gasUsed = mockRouterEvent.args.gasUsed
            
//             gasUsageReport.push({
//                 test,
//                 gasUsed: gasUsed.toString()
//             })
//         }

//         console.log("Gas Usage Report: ");
//         gasUsageReport.forEach((report) => console.log("Number of iterations %d - Gas used: %d", report.test, report.gasUsed))

//     })
// })