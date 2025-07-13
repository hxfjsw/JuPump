// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const WETH9='0x622e1Ad8abF7120224f5f995f1ca35a85c3C6447'
const FACTORY = "0xA1e393178DDFD63af56cf0BfA759A6a85606558c"

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    //solidity version：0.8.18
    const Router = await ethers.getContractFactory("SwapRouter");
    //分别传入factory合约以及weth9合约地址
    const router = await Router.deploy(FACTORY,WETH9);
    await router.deployed();

    console.log("Router address:", router.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
