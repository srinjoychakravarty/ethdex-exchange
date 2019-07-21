import {tokens, EVM_REVERT, INVALID_ADDRESS, INVALID_EXCHANGE} from './helpers.js'

const Exchange = artifacts.require('./Exchange') 

require('chai').use(require('chai-as-promised')).should()

contract('Exchange', ([deployer, feeReceiver]) => {

	let exchange

	beforeEach(async() => {
		//Sets up exchange for all tests
		exchange = await Exchange.new(feeReceiver)
	})

	describe('deployment', () => {

		it('tracks the fee receiver account', async() => {
			const feeAddress = await exchange.feeAccount()
			feeAddress.should.equal(feeReceiver)
		})
	})
})