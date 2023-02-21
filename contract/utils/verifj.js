const { run } = require("hardhat");

const verify = async (contractAddress, arguments) => {
  try {
    console.log("Verifying contract");
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: arguments,
    });
    console.log("Contract Verified...");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract Already Verified");
    } else {
      console.log(error);
    }
  }
};

module.exports = { verify };
