require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    }
  },
};
//0x80f317198e7764b26Be08DC5e5FE5FabfBC742c1
