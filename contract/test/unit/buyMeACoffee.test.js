const { assert, expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhad-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BuyMeACoffee", async function () {
      let buyMeACoffee, deployer;

      beforeEach(async function () {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["BuyMeACoffee"]);
        buyMeACoffee = await ethers.getContract("BuyMeACoffee");
      });

      describe("Constructor", function () {
        it("Should set deployer as the owner", async () => {
          const owner = await buyMeACoffee.getOwner();
          assert.equal(owner, deployer.address);
        });
      });
    });
