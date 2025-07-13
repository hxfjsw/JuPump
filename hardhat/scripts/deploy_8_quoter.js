// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

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


    //发布token
    const Quoter = await ethers.getContractFactory("Quoter");
    const quoter = await Quoter.deploy('0xc34cEf098ea406A33f507ABba1416C533404Bc29','0x4d1b49b424afd7075d3c063addf97d5575e1c7e2');
    await quoter.deployed(); //等的确认发布
    console.log("quoter address:", quoter.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
