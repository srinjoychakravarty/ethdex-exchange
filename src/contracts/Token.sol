pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
	using SafeMath for uint;

	// Variables
	string public name = "Dexcoin";
	string public symbol = "DEX";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	//Events
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	// Track balances
	mapping(address => uint256) public balanceOf;

	// Tracks max tokens allowed be spent by exchange on behalf of token owner
	// first address corresponds to user address, second address corresponds to exchange address
	mapping(address => mapping(address => uint256)) public allowance;

	// Send tokens

	constructor() public {
		totalSupply = 166666666*(10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		require(_to != address(0));
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true; 
	}

	// Approve tokens
	function approve(address _spender, uint256 _value) public returns (bool success) {
		require(_spender != address(0));
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}
}