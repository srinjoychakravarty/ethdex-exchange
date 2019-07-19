import {tokens} from './helpers.js'

const Token = artifacts.require('./Token') 

require('chai').use(require('chai-as-promised')).should()

contract('Token', ([deployer, sender, receiver]) => {

	const name = "Dexcoin"
	const symbol = "DEX"
	const decimals = "18"
	const totalSupply = tokens(166666666).toString()
	let token

	beforeEach(async () => {
		//Sets up token for all tests
		token = await Token.new()
	})

	describe('deployment', () => {

		it('validates token name', async () => {
			// Reads the token name 
			const token_name = await token.name()
			// Verifies the expected token name
			token_name.should.equal(name)
		})

		it('validates token symbol', async () => {
			const token_symbol = await token.symbol()
			token_symbol.should.equal(symbol)
		})

		it('validates token decimals', async () => {
			const token_decimals = await token.decimals()
			token_decimals.toString().should.equal(decimals)
		})

		it('validates token total supply', async () => {
			const token_total_supply = await token.totalSupply()
			token_total_supply.toString().should.equal(totalSupply.toString())
		})

		it('assigns the total supply to the deployer', async () => {
			const balance = await token.balanceOf(deployer)
			balance.toString().should.equal(totalSupply.toString())
		})		

	})

	describe('sending tokens', () => {
		let amount
		let result

		describe('successful transfer', () => {
			beforeEach(async () => {
				amount = tokens(88)
				result = await token.transfer(receiver, amount, {from: deployer}) 
			})

			it('transfers token balances correctly', async () => {
				let balanceOf_deployer
				let balanceOf_receiver
				
				// Before Transfer
				balanceOf_deployer = await token.balanceOf(deployer)
				console.log("deployer balance before transfer", balanceOf_deployer.toString())
				balanceOf_receiver = await token.balanceOf(receiver)
				console.log("receiver balance before transfer", balanceOf_receiver.toString())

				// During Transfer
				await token.transfer(receiver, tokens(111))

				// After Transfer
				balanceOf_deployer = await token.balanceOf(deployer)
				balanceOf_deployer.toString().should.equal(tokens(166666467).toString())
				console.log("deployer balance after transfer", balanceOf_deployer.toString())
				
				balanceOf_receiver = await token.balanceOf(receiver)
				balanceOf_receiver.toString().should.equal(tokens(199).toString())
				console.log("receiver balance after transfer", balanceOf_receiver.toString())
			})

			it('emits a transfer event', async () => {
				console.log(result.logs)

				const log_object = result.logs[0]
				log_object.event.should.equal("Transfer")

				const args = log_object.args
				args.from.toString().should.equal(deployer, "from address doesn't match deployer")
				args.to.toString().should.equal(receiver, "to address doesn't match receiver")
				args.value.toString().should.equal(amount.toString(), "value does not match amount")
			})

			})

		describe('failed transfer', () => {

		})
	})
})