import {tokens, EVM_REVERT, INVALID_ADDRESS, INVALID_EXCHANGE} from './helpers.js'

const Token = artifacts.require('./Token') 

require('chai').use(require('chai-as-promised')).should()

contract('Token', ([deployer, receiver, exchange]) => {

	const name = "Dexcoin"
	const symbol = "DEX"
	const decimals = "18"
	const totalSupply = tokens(166666666).toString()
	let token

	beforeEach(async() => {
		//Sets up token for all tests
		token = await Token.new()
	})

	describe('deployment', () => {

		it('validates token name', async() => {
			// Reads the token name 
			const token_name = await token.name()
			// Verifies the expected token name
			token_name.should.equal(name)
		})

		it('validates token symbol', async() => {
			const token_symbol = await token.symbol()
			token_symbol.should.equal(symbol)
		})

		it('validates token decimals', async() => {
			const token_decimals = await token.decimals()
			token_decimals.toString().should.equal(decimals)
		})

		it('validates token total supply', async() => {
			const token_total_supply = await token.totalSupply()
			token_total_supply.toString().should.equal(totalSupply.toString())
		})

		it('assigns the total supply to the deployer', async() => {
			const balance = await token.balanceOf(deployer)
			balance.toString().should.equal(totalSupply.toString())
		})		

	})

	describe('sending tokens', () => {
		
		let amount
		let result

		describe('successful transfer', () => {
			beforeEach(async() => {
				amount = tokens(88)
				result = await token.transfer(receiver, amount, {from: deployer}) 
			})

			it('transfers token balances correctly', async() => {
				let balanceOf_deployer
				let balanceOf_receiver
				
				// Before Transfer
				balanceOf_deployer = await token.balanceOf(deployer)
				// console.log("deployer balance before transfer", balanceOf_deployer.toString())
				balanceOf_receiver = await token.balanceOf(receiver)
				// console.log("receiver balance before transfer", balanceOf_receiver.toString())

				// During Transfer
				await token.transfer(receiver, tokens(111))

				// After Transfer
				balanceOf_deployer = await token.balanceOf(deployer)
				balanceOf_deployer.toString().should.equal(tokens(166666467).toString())
				// console.log("deployer balance after transfer", balanceOf_deployer.toString())
				
				balanceOf_receiver = await token.balanceOf(receiver)
				balanceOf_receiver.toString().should.equal(tokens(199).toString())
				// console.log("receiver balance after transfer", balanceOf_receiver.toString())
			})

			it('emits a transfer event', async() => {
				
				//console.log(result.logs)
				const log_object = result.logs[0]
				log_object.event.should.equal("Transfer")

				const args = log_object.args
				args.from.toString().should.equal(deployer, "from address doesn't match deployer address")
				args.to.toString().should.equal(receiver, "to address doesn't match receiver address")
				args.value.toString().should.equal(amount.toString(), "value does not match amount")
			})

			})

		describe('failed transfer', () => {

			it('prevents sender from sending more tokens than they own', async() => {
				let excessiveAmount

				excessiveAmount = tokens(166666667) // 1 greater than totalSupply
				await token.transfer(receiver, excessiveAmount, {from: deployer}).should.be.rejectedWith(EVM_REVERT)

				// receiver tries to send 1 token even though they have 0 to begin with
				await token.transfer(deployer, amount, {from: receiver}).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejects transfers to invalid addresses including the 0 address', async() => {
				await token.transfer(0x0, amount, {from: deployer}).should.be.rejectedWith(INVALID_ADDRESS)
			})

		})
	})

	describe('approving tokens', () => {
		
		let approvedAmount
		let approvedResult

		beforeEach(async() => {
			approvedAmount = tokens(7)
			approvedResult = await token.approve(exchange, approvedAmount, {from: deployer}) 
		})

		describe('successful transfer', () => {
			
			it('allocates an allowance for delegated token spending on exchange', async() => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal(approvedAmount.toString())
			})

			it('emits an approval event', async() => {
				
				//console.log(approvedResult.logs)
				const log_object = approvedResult.logs[0]
				log_object.event.should.equal("Approval")

				const args = log_object.args
				args.owner.toString().should.equal(deployer, "owner address doesn't match deployer address")
				args.spender.toString().should.equal(exchange, "spender address doesn't match exchange address")
				args.value.toString().should.equal(approvedAmount.toString(), "value does not match approvedAmount")
			})
		})

		describe('failed transfer', () => {
			it('rejects approvals to invalid exchange addresses', async() => {
				await token.approve(0x0, approvedAmount, {from: deployer}).should.be.rejectedWith(INVALID_EXCHANGE)
			})
		})
	})





























































	describe('delegated token transfers', () => {
		
		let user_approved_amount
		let result

		beforeEach(async() => {
			user_approved_amount = tokens(45)
			await token.approve(exchange, user_approved_amount, {from: deployer})
		})


		describe('successful delegated transfer', () => {
			
			beforeEach(async() => {
				result = await token.transferFrom(deployer, receiver, user_approved_amount, {from: exchange}) 
			})

			it('exchange transfers from user token balances correctly', async() => {
				let balanceOf_deployer
				let balanceOf_receiver
				

				// After transferFrom
				balanceOf_deployer = await token.balanceOf(deployer)
				balanceOf_deployer.toString().should.equal(tokens(166666621).toString())	
				balanceOf_receiver = await token.balanceOf(receiver)
				balanceOf_receiver.toString().should.equal(tokens(45).toString())

			})

			it('resets allowance to 0 after successful transferFrom', async() => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal('0')
			})

			it('emits a transfer event', async() => {
				
				//console.log(result.logs)
				const log_object = result.logs[0]
				log_object.event.should.equal("Transfer")

				const args = log_object.args
				args.from.toString().should.equal(deployer, "from address doesn't match deployer address")
				args.to.toString().should.equal(receiver, "to address doesn't match receiver address")
				args.value.toString().should.equal(user_approved_amount.toString(), "value does not match user_approved_amount")
			})

		})

		describe('failed delegated transfer', () => {

			const cheekyAmount = tokens(46)
			
			it('rejects attempts to transfer more than the user_approved_amount delegated by user to the exchange', async() => {
				//Feeble attempt to transfer way too many tokens
				await token.transferFrom(deployer, receiver, cheekyAmount, {from: exchange}).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejects attempts to transfer to non-existant addresses', async() => {
				//Feeble attempt to transfer way to an account that doesn't exist
				await token.transferFrom(deployer, 0x0, cheekyAmount, {from: exchange}).should.be.rejectedWith(INVALID_ADDRESS)
			})

		})
	})
})