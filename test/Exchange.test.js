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
			const exchangeDeposit = await exchange.depositToken(token.address, testAmount, {from: kinKendall})
		})

		describe('successful deposit', () => {

			it('tracks the token deposit', async() => {
				// Checks token balance on exchange
				let tokenBalance
				tokenBalance = await token.balanceOf(exchange.address)
				tokenBalance.toString().should.equal(testAmount.toString())
			})
		})

		describe('failed deposit', () => {

			it('xxxx', async() => {

			})
		})
	})
})