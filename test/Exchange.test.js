import {tokens, EVM_REVERT, INVALID_ADDRESS, INVALID_EXCHANGE} from './helpers.js'

const Exchange = artifacts.require('./Exchange') 
const Token = artifacts.require('./Token')

require('chai').use(require('chai-as-promised')).should()

contract('Exchange', ([deployer, feeReceiver, kinKendall]) => {

	let exchange
	let token
	const exchangeCut = 4

	beforeEach(async() => {
		//Sets up exchange for all tests
		exchange = await Exchange.new(feeReceiver, exchangeCut)
		//Sets up dexcoin as the sample erc20 token for all tests
		token = await Token.new()
		// Gives kin the user some tokens to trade with on the exchange
		token.transfer(kinKendall, tokens(25), {from: deployer})
	})

	describe('deployment', () => {

		it('tracks the fee receiver account', async() => {
			const feeAddress = await exchange.feeRecevier()
			feeAddress.should.equal(feeReceiver)
		})

		it('tracks the fee percentage', async() => {
			const feePercent = await exchange.feePercent()
			feePercent.toString().should.equal(exchangeCut.toString())
		})
	})

	describe('depositing tokens', () => {

		let exchangeDeposit
		let testAmount

		beforeEach(async() => {
			testAmount = tokens(7)
			await token.approve(exchange.address, testAmount, {from: kinKendall})
			exchangeDeposit = await exchange.depositToken(token.address, testAmount, {from: kinKendall})
		})

		describe('successful deposit', () => {

			it('tracks the token deposit', async() => {
				// Checks token balance on exchange
				let exchangeBalance
				let userBalance
				
				// verifies token contract has record of exchange owning deposited tokens
				exchangeBalance = await token.balanceOf(exchange.address)
				exchangeBalance.toString().should.equal(testAmount.toString())
				
				// verifies exchange tracks number of a specific token designated to user
				userBalance = await exchange.tokens(token.address, kinKendall)
				userBalance.toString().should.equal(testAmount.toString())

			})

			it('emits a deposit event', async() => {
				
				const log_object = exchangeDeposit.logs[0]
				log_object.event.should.equal("Deposit")

				const args = log_object.args
				args.token.should.equal(token.address, "token addresses don't match")
				args.user.should.equal(kinKendall, "user address logged doesn't match kinKendall address from ganache")
				args.amount.toString().should.equal(testAmount.toString(), "amount logged does not match testAmount")
				args.balance.toString().should.equal(testAmount.toString(), "balance logged does not meet what's expected")	
			})
		})

		describe('failed deposit', () => {

			it('xxxx', async() => {

			})
		})
	})
})