pragma solidity ^0.5.0;

contract Token {
	string public name = "Dexcoin";
	string public symbol = "DEX";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	constructor() public {
		totalSupply = 166666666*(10**decimals);
	}
}