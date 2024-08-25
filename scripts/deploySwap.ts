import { network, ethers } from "hardhat"

async function main() {
    if (network.name != "ethSepolia") {
        console.log("Must be on Ethereum Sepolia")
        return 1
    }
    const usdcToken = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    const compoundUsdcToken = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    const fauceteer = "0x68793eA49297eB75DFB4610B68e076D2A5c7646C"
    const Swap = await ethers.getContractFactory("SwapTestnetUSDC")
    const swap = await Swap.deploy(usdcToken, compoundUsdcToken, fauceteer)
    await swap.waitForDeployment()

    console.log(`SwapTestnetUsdc deployed on ${network.name} with address ${swap.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})