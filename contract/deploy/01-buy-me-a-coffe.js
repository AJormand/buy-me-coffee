const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhad-config");
const { verify } = require("../utils/verifj");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const buyMeACoffee = await deploy("BuyMeACoffee", {
    from: deployer,
    args: [],
    log: true,
  });

  if (!developmentChains.includes(network.name)) {
    console.log("Verifying contract on Etherscan....");
    const args = [];
    await verify(buyMeACoffee.address, args);
  }
};

module.exports.tags = ["All", "BuyMeACoffee"];
