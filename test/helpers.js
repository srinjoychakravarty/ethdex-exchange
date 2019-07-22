export const etherToWei = (n) => {return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))}
export const tokensToWei = (n) => etherToWei(n)	// erc20 tokens follow same format as etherToWei
export const EVM_REVERT = 'VM Exception while processing transaction: revert'
export const INVALID_ADDRESS = 'invalid address (arg="_to", coderType="address", value=0)'
export const INVALID_EXCHANGE = 'invalid address (arg="_spender", coderType="address", value=0)'
export const etherAddressZero = '0x0000000000000000000000000000000000000000';
