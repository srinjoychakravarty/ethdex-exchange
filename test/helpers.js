export const tokens = (n) => {return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))}
export const EVM_REVERT = 'VM Exception while processing transaction: revert'
export const INVALID_ADDRESS = 'invalid address (arg="_to", coderType="address", value=0)'
export const INVALID_EXCHANGE = 'invalid address (arg="_spender", coderType="address", value=0)'

