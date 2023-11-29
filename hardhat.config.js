require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat:{
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: true,
  },
};






/*
// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

// @type import('hardhat/config').HardhatUserConfig
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-sepolia.g.alchemy.com/v2/MRAgXUnE3ygyFUDvfIlm278Im9I8jDMN",
        accounts: [`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`],
      },
    },
  },
};
*/