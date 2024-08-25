import { ethers, network } from "hardhat";

async function main() {

    // const ccipRouter = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"
    const ccipRouter = "0x9B51D5f1f388716FA62e5551640603EfA7b90A39"
    const linkToken = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"
    const usdcToken = "0x5425890298aed601595a70AB815c96711a31Bc65"
    const transferUsdc = await ethers.deployContract("TransferUSDC", [
        ccipRouter,
        linkToken,
        usdcToken
    ])
    
    await transferUsdc.waitForDeployment()
    console.log(`Contract Deployed on ${network.name} with address: ${transferUsdc.target}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})