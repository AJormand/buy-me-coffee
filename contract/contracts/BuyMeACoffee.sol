// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "../contracts/PriceConsumer.sol";

error BuyMeACoffee__TipTooLow();

contract BuyMeACoffee {
    PriceConsumer priceConsumer;
    address public immutable i_owner;
    uint256 public constant MINIMUM_TIP_USD = 5;
    Tip[] internal s_tipsArray;
    uint256 public s_numberOfTips;

    struct Tip {
        uint256 tip;
        string message;
    }

    //events
    event TipReceived(uint256 _tip, string _message, address _from);

    constructor(address _priceConsumerAddress) {
        i_owner = msg.sender;
        priceConsumer = new PriceConsumer(_priceConsumerAddress);
    }

    //functions
    function buyCoffee(string memory _message) public payable {
        if (!(msg.value > MINIMUM_TIP_USD)) {
            revert BuyMeACoffee__TipTooLow();
        }
        Tip memory newTip;
        newTip.tip = msg.value;
        newTip.message = _message;
        s_tipsArray.push(newTip);
        s_numberOfTips++;

        emit TipReceived(msg.value, _message, msg.sender);
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

    function getTip(uint256 _index) public view returns (Tip memory) {
        return s_tipsArray[_index];
    }

    function getLatestFiveTips() public view returns (Tip[] memory) {
        Tip[] memory items = new Tip[](5);

        uint256 startIndex = s_numberOfTips > 5 ? s_numberOfTips - 5 : 0;
        for (uint256 i = 0; i < 5; i++) {
            if (startIndex + i >= s_numberOfTips) {
                break;
            }
            items[i] = s_tipsArray[startIndex + i];
        }
        return items;
    }

    function getEthPrice() public view returns (int) {
        int price = priceConsumer.getLatestPrice();
        return price;
    }
}
