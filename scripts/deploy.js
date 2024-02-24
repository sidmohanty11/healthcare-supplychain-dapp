const hre = require("hardhat");

async function main() {
  const Chai = await hre.ethers.getContractFactory("chai");
  const chai = await Chai.deploy();

  await chai.waitForDeployment();

  console.log("chai deployed to:", await chai.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
