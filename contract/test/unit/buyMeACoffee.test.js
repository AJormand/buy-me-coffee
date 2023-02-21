const { assert, expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhad-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BuyMeACoffee", async function () {
      let buyMeACoffee, deployer, user;

      beforeEach(async function () {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(["BuyMeACoffee"]);
        buyMeACoffee = await ethers.getContract("BuyMeACoffee");
      });

      describe("Constructor", function () {
        it("Should set deployer as the owner", async () => {
          const owner = await buyMeACoffee.getOwner();
          assert.equal(owner, deployer.address);
        });
      });

      describe("BuyMeACoffee", function () {
        it("Should revert if tip is too low", async () => {
          const minAmount = (await buyMeACoffee.MINIMUM_TIP_USD()).toString();
          const tip = ethers.utils.parseEther("1");
          expect(
            await buyMeACoffee.buyCoffee({ value: tip })
          ).to.be.revertedWith("BuyMeACoffee__TipTooLow()");
        });

        it("Should send tip to the contract", async () => {
          const tip = ethers.utils.parseUnits("6", "ether");
          await buyMeACoffee.buyCoffee({ value: tip });
          const contractBalance = (
            await buyMeACoffee.getContractBalance()
          ).toString();
          assert.equal(contractBalance, tip);
        });
      });

      describe("WithdrawTips", function () {
        it("Should revert with error if caller is not owner", async () => {
          buyMeACoffee.connect(user);
          expect(await buyMeACoffee.withdrawTips()).to.be.revertedWith(
            "Caller is not the owner"
          );
        });

        it("Should withdraw all the funds from the contract", async () => {
          const tip = ethers.utils.parseUnits("6", "ether");
          await buyMeACoffee.buyCoffee({ value: tip });
          await buyMeACoffee.withdrawTips();
          const contractBalance = await buyMeACoffee.getContractBalance();
          assert.equal(contractBalance, "0");
        });
      });
    });
