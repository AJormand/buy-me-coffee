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
          const message = "Hi!";
          expect(
            await buyMeACoffee.buyCoffee(message, { value: tip })
          ).to.be.revertedWith("BuyMeACoffee__TipTooLow()");
        });
        it("Should send tip to the contract", async () => {
          const tip = ethers.utils.parseEther("7");
          const message = "Hi!";
          const tx = await buyMeACoffee.buyCoffee(message, { value: tip });
          await tx.wait();
          const contractBalance = await buyMeACoffee.getContractBalance();

          console.log(tip.toString());
          console.log(contractBalance.toString());

          assert.equal(contractBalance, tip);
        });
        it("Should emit TipReceived event when tip is sent", async () => {
          const tip = ethers.utils.parseUnits("6", "ether");
          const message = "Good work!";
          await expect(buyMeACoffee.buyCoffee(message, { value: tip }))
            .to.emit(buyMeACoffee, "TipReceived")
            .withArgs(tip, message, deployer.address);
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
          const message = "Hi!";
          await buyMeACoffee.buyCoffee(message, { value: tip });
          await buyMeACoffee.withdrawTips();
          const contractBalance = await buyMeACoffee.getContractBalance();
          assert.equal(contractBalance, "0");
        });
      });

      describe("getLastFiveTips", function () {
        it("Should return an array of last 5 tips", async () => {
          const expectedArray = [
            ["6000000000000000000", "Hello1"],
            ["6000000000000000000", "Hello2"],
            ["6000000000000000000", "Hello3"],
            ["6000000000000000000", "Hello4"],
            ["6000000000000000000", "Hello5"],
            ["6000000000000000000", "Hello6"],
            ["6000000000000000000", "Hello7"],
            ["6000000000000000000", "Hello8"],
            ["6000000000000000000", "Hello9"],
          ];

          for (let i = 0; i < expectedArray.length; i++) {
            await buyMeACoffee.buyCoffee(expectedArray[i][1], {
              value: expectedArray[i][0],
            });
          }
          const tipsArr = await buyMeACoffee.getLatestFiveTips();

          const readableTipsArr = tipsArr.map((item) => {
            return item.map((value) => {
              if (typeof value === "object" && value._isBigNumber) {
                return value.toString();
              } else {
                return value;
              }
            });
          });

          expect(expectedArray.slice(-5)).to.eql(readableTipsArr);
        });
      });
    });
