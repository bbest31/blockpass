const Web3 = require('web3');

const web3 = new Web3(process.env.PROVIDER);
if (web3.currentProvider === null) {
  console.log(web3.currentProvider);
  throw new Error('Unable to connect to web3 connection provider.');
}

module.exports = web3;
