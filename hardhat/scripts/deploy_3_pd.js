// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const WETH9='0x622e1Ad8abF7120224f5f995f1ca35a85c3C6447'
const FACTORY = "0xA1e393178DDFD63af56cf0BfA759A6a85606558c"
const ROUTER ="0xA9F2f4A23876FDf461d2A107009bEA2b1BaFdf62"

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
    //发布library
    const Library = await ethers.getContractFactory("NFTDescriptor");
    //分别传入weth9合约地址以及转为16进制的`eth`名称，也就是该名称是bytes32：
    const library = await Library.deploy();
    await library.deployed();

    //发布仓位描述
    const Pd = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor", {
        libraries: {
            NFTDescriptor: library.address
        }
    });
    //分别传入weth9合约地址以及转为16进制的`eth`名称，也就是该名称是bytes32：
    // const _WETH9_NAME = '0x774a550000000000000000000000000000000000000000000000000000000000'
    const _WETH9_NAME = '0x4554480000000000000000000000000000000000000000000000000000000000'
    const pd = await Pd.deploy(WETH9, _WETH9_NAME);
    await pd.deployed(); //等的确认发布z

    console.log("PositionDescriptor address:", pd.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
