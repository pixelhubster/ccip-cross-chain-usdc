import { ethers, network } from "hardhat";


async function main() {
    const ccipRouter = ""
    const linkToken = ""
    const usdcToken = ""

    const transferUsdc = await ethers.deployContract("TransferUSDC", [
        ccipRouter,
        linkToken,
        usdcToken
    ])
    await transferUsdc.waitForDeployment()
    console.log(`Contract deployed on ${network.name} with address ${transferUsdc.target}`)
}