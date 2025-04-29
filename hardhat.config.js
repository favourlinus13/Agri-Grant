/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // RPC from Ganache GUI
      accounts: [
        "0xfe1b369ac9bc0f71c361c1de480aa241988fd0cbd06fc180530aac023c6c1afb" // Replace with a Ganache private key (NO QUOTES or whitespace)
      ]
    }
  }
};
