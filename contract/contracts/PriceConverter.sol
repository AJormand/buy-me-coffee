//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConverter {
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedAddress) {
        //ETH/USD Goerli: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function getLatestPrice() public view returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
