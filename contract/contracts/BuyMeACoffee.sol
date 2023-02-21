// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

error BuyMeACoffee__TipTooLow();

contract BuyMeACoffee {
    address public immutable i_owner;
    uint256 public constant MINIMUM_TIP_USD = 5;

    struct Tip {
        uint256 tip;
        string message;
    }

    constructor() {
        i_owner = msg.sender;
    }

    //functions
    function buyCoffee() public payable {
        if (!(msg.value > MINIMUM_TIP_USD)) {
            revert BuyMeACoffee__TipTooLow();
        }
    }

    function withdrawTips() public {
        require(msg.sender == i_owner, "Caller is not the owner");
        (bool success, ) = payable(i_owner).call{value: address(this).balance}(
            ""
        );
        require(success, "Withdrawal failed");
    }

    //getter functions
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
