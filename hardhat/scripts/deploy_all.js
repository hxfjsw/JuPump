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


    // bytes32 POOL_INIT_CODE_HASH = keccak256(abi.encodePacked(type(UniswapV3Pool).creationCode))
    const UniswapV3Pool = await ethers.getContractFactory("UniswapV3Pool");
    const poolInitCodeHash = ethers.utils.keccak256(UniswapV3Pool.bytecode);
    console.log("POOL_INIT_CODE_HASH:", poolInitCodeHash);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Factory = await ethers.getContractFactory("UniswapV3Factory");
    const factory = await Factory.deploy();
    await factory.deployed();
    console.log("Factory address:", factory.address);

    //solidity version：0.8.18
    // const WETH9 = await ethers.getContractFactory("WETH9");
    // const weth9 = await WETH9.deploy();
    // await weth9.deployed();
    // console.log("WETH9 address:", weth9.address);
    const weth9={
        address:"0x4d1b49b424afd7075d3c063addf97d5575e1c7e2"
    }

    const Router = await ethers.getContractFactory("SwapRouter");
    const router = await Router.deploy(factory.address,weth9.address);
    await router.deployed();
    console.log("Router address:", router.address);

    const Library = await ethers.getContractFactory("NFTDescriptor");
    //分别传入weth9合约地址以及转为16进制的`eth`名称，也就是该名称是bytes32：
    const library = await Library.deploy();
    await library.deployed();
    const Pd = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor", {
        libraries: {
            NFTDescriptor: library.address
        }
    });
    const _WETH9_NAME = '0x4554480000000000000000000000000000000000000000000000000000000000'
    const pd = await Pd.deploy(weth9.address, _WETH9_NAME);
    await pd.deployed(); //等的确认发布z
    console.log("PositionDescriptor address:", pd.address);

    const Mgr = await ethers.getContractFactory("NonfungiblePositionManager");
    const mgr = await Mgr.deploy(factory.address,weth9.address, pd.address);
    await mgr.deployed(); //等的确认发布
    console.log("NonfungiblePositionManager address:", mgr.address);

    //发布token
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed(); //等的确认发布
    console.log("MyToken address:", myToken.address);

    // Approve the NonfungiblePositionManager to spend MyToken
    const approvalTx = await myToken.approve(mgr.address, ethers.constants.MaxUint256);
    await approvalTx.wait();
    console.log("MyToken approved for NonfungiblePositionManager");
    // const approvalTx2 = await weth9.approve(mgr.address, ethers.constants.MaxUint256);
    // await approvalTx2.wait();
    // console.log("WETH9 approved for NonfungiblePositionManager");

    // Execute mgr's createAndInitializePoolIfNecessary
    const initialPrice = ethers.utils.parseUnits("0.0001", 18); // Adjust as needed

    const poolTx = await mgr.createAndInitializePoolIfNecessary(
        weth9.address,
        myToken.address,
        10000, // pool fee, adjust as needed
        "79228162514264337593543950336",
        { value: initialPrice } // Pass the initial price as value
    );
    await poolTx.wait();
    console.log("Pool created and initialized");


    // const position = {
    //     pool: {
    //         token0: { address: myToken.address },
    //         token1: { address: weth9.address },
    //         fee: 10000, // pool fee
    //     },
    //     tickLower: -200,
    //     tickUpper: 200,
    // };
    //
    //
    // const recipient = deployer.address; // 当前账户地址
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期
    //
    // const mintParams = {
    //     token0: position.pool.token0.address,
    //     token1: position.pool.token1.address,
    //     fee: position.pool.fee,
    //     tickLower: position.tickLower,
    //     tickUpper: position.tickUpper,
    //     amount0Desired: "9999999999999999",
    //     amount1Desired: "9999999999999999",
    //     amount0Min: "7496737502591757", // 可以根据需要调整
    //     amount1Min: "7484205485896512", // 可以根据需要调整
    //     recipient:recipient,
    //     deadline :deadline,
    // };
    //
    // const mintTx = await mgr.mint(mintParams, { value: "9999999999999999" });
    // await mintTx.wait();
    // console.log("Mint transaction completed:", mintTx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
