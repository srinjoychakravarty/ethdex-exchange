const Token = artifacts.require('./Token') 

require('chai').use(require('chai-as-promised')).should()

contract('Token', (accounts) => {

	const name = "Dexcoin"
	const symbol = "DEX"
	const decimals = "18"
	const total_supply = "166666666000000000000000000"
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
			token_total_supply.toString().should.equal(total_supply)
		})

	})
})