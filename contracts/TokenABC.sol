// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenABC is ERC20 {
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(uint256 initialSupply, uint256 _tokenPrice)
        ERC20("TokenABC", "ABC")
    {
        tokenPrice = _tokenPrice;
        _mint(address(this), initialSupply * 10**decimals());
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        // keep track of number of tokens sold
        // require that a contract have enough tokens
        // require tha value sent is equal to token price
        // trigger sell event
        require(msg.value >= mul(numberOfTokens, tokenPrice));
        require(this.balanceOf(address(this)) >= numberOfTokens);
        require(this.transfer(msg.sender, numberOfTokens));

        tokensSold += numberOfTokens;
    }
}
