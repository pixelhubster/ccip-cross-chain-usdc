import { ethers, network } from "hardhat"

async function main() {

    const MockCCIPRouter = await ethers.getContractFactory("MockCCIPRouter")
    const mockRouter = await MockCCIPRouter.deploy()
    await mockRouter.waitForDeployment()
    console.log(`Router deployed on ${network.name} at ${mockRouter.target}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})