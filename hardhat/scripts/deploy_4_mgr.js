// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const WETH9='0x622e1Ad8abF7120224f5f995f1ca35a85c3C6447'
const FACTORY = "0xA1e393178DDFD63af56cf0BfA759A6a85606558c"
const ROUTER ="0xA9F2f4A23876FDf461d2A107009bEA2b1BaFdf62"
const PD = "0x74900283F243183ad9AFa60e22f93Cce1F73BF75"
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

    //发布仓位描述
    const Mgr = await ethers.getContractFactory("NonfungiblePositionManager");


    const mgr = await Mgr.deploy(FACTORY, WETH9, PD);
    await mgr.deployed(); //等的确认发布

    console.log("NonfungiblePositionManager address:", mgr.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
