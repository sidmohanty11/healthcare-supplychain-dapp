const hre = require("hardhat");

async function main() {
  const Medicine = await hre.ethers.getContractFactory("MedicineContract");
  const medicine = await Medicine.deploy();

  await medicine.waitForDeployment();

  console.log("medicine deployed to:", await medicine.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xbEF9Af4b0132835aCBb8cdfEC16d331800F8dCb0
// 0x7960610A5Ed933ee21c4147C960f82F23dCDD873 - deployed to
