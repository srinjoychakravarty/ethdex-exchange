pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";

// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge Feers


// To Do List:
	// [X] Set the fee account
	// [X] Deposit Ether
	// [] Wiithdraw Ether
	// [] Deposit Tokens
	// [] Withdraw Tokens
	// [] Check Balances
	// [] Make Order
	// [] Cancel Order
	// [] Fill Order
	// [] Charge fees

contract Exchange {

	using SafeMath for uint;

	// state variables
	address public feeRecevier; // account address that receives exchange usage fees
	uint256 public feePercent; // sets fee percentage taken by exchange
	constant etherAddress = address(0); // uses the 0 address as a placeholder token for native ether

	// events
	event Deposit(address token, address user, uint256 amount, uint256 balance);

	// first 'address' key tracks token address, 2nd 'address' key tracks user account that deposited token
	mapping(address => mapping(address => uint256)) public tokens;

	constructor(address _feeReceiver, uint256 _feePercent) public {
		feeRecevier = _feeReceiver;
		feePercent = _feePercent;
	}

	function depositToken(address _token, uint _amount) public {
		
		// send tokens from the user's wallet to this exchange contract
		require (Token(_token).transferFrom(msg.sender, address(this), _amount));
		
		// manages deposit and updates balance
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		
		// emits deposit event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

		// Don't allow native ether deposits
	}

	function depositEther() payable public {
		tokens[etherAddress][msg.sender] = tokens[etherAddress][msg.sender].add(msg.value);
		emit Deposit(etherAddress, msg.sender, msg.value, tokens[etherAddress][msg.sender]);
	}
}



