const { ethers } = require("hardhat");

async function main() {
    const AgriGrant = await ethers.getContractFactory("AgriGrantSimpleDistribution");
    const agriGrant = await AgriGrant.deploy();
    await agriGrant.deployed();

    console.log(`AgriGrantSimpleDistribution deployed to: ${agriGrant.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
