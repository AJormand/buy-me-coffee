const fs = require("fs");
require("dotenv").config();
const { ethers, network } = require("hardhat");

const frontEndContractFile = "../frontend/src/constants/networkMapping.json";
const frontendAbiLocation = "../frontend/src/constants/BuyMeACoffee.json";

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END == "true") {
    console.log("Updating frontend....");
    await updateAbi();
    await updateContractAddress();
  }
};

async function updateAbi() {
  const buyMeAcoffee = await ethers.getContract("BuyMeACoffee");
  const abi = JSON.stringify(buyMeAcoffee.interface);
  fs.writeFileSync(frontendAbiLocation, abi);
}

async function updateContractAddress() {
  const buyMeAcoffee = await ethers.getContract("BuyMeACoffee");
  const fileJson = fs.readFileSync(frontEndContractFile, "utf8");
  const fileAsJsObject = JSON.parse(fileJson);
  const chainId = network.config.chainId.toString();
  console.log(JSON.parse(fileJson));
  console.log(network.config.chainId);
  //if chainId already exists
  if (fileAsJsObject[chainId]) {
    if (!fileAsJsObject[chainId].includes(buyMeAcoffee.address)) {
      fileAsJsObject[chainId].unshift(buyMeAcoffee.address);
      fs.writeFileSync(frontEndContractFile, JSON.stringify(fileAsJsObject));
    }
  } else {
    fileAsJsObject[chainId] = [buyMeAcoffee.address];
    fs.writeFileSync(frontEndContractFile, JSON.stringify(fileAsJsObject));
  }
}
module.exports.tags = ["All", "updateFE"];
