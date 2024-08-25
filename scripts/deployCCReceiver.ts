import { ethers, network } from "hardhat"

async function main() {
    if (network.name != "ethSepolia") {
        console.log("Must be on Ethereum Sepolia")
        return 1
    }

    // const ccipRouterAddress = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
    const ccipRouterAddress = "0x8Bb2db64840bfdDf257487EFeF884b2Fa24e32eA"
    const cometAddress = "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e"
    const swapTestnetUsdcAddress = "0xba9F4F7BF70D4c16A8F0677DBB895B1BdBf696D9"

    const CCReciever = await ethers.getContractFactory("CrossChainReceiver") 
    const ccReceiver = await CCReciever.deploy(ccipRouterAddress, cometAddress, swapTestnetUsdcAddress)
    await ccReceiver.waitForDeployment()
    console.log(`Cross Chain Receiver deployed on ${network.name} with address ${ccReceiver.target}`)

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})