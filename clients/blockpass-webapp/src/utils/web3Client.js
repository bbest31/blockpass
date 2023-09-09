import contractArtifact from '../contracts/BlockPassTicket.json';
import marketplaceArtifact from '../contracts/BlockPass.json';
import { MARKETPLACE_CONTRACT } from '../config';

const { Web3 } = require('web3');

export function isValidEthAddress(input) {
  // Regex for Ethereum address
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  // Regex for ENS domain name
  const ensRegex = /^[a-zA-Z0-9-]+\.eth$/;

  return ethAddressRegex.test(input) || ensRegex.test(input);
}

export function getWalletAddress(accountChangedHandler) {
  const provider = window.ethereum;

  if (typeof provider !== 'undefined') {
    provider.request({ method: 'eth_requestAccounts' }).then((accounts) => accountChangedHandler(accounts[0]));

    provider.on('accountsChanged', (accounts) => accountChangedHandler(accounts[0]));
  }
}

/**
 * Gets the smart contract method array for a given contract address.
 * @param {string} contractAddress
 * @returns {web3.ContractInterfaceMethods<any>}
 */
export function getSmartContract(contractAddress) {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(contractArtifact.abi, contractAddress).methods;
}

/**
 * Gets the marketplace contract method array for a given marketplace contract
 * @param {string} contractAddress
 * @returns {Array<function>}
 */
export function getMarketplaceContract(contractAddress) {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(marketplaceArtifact.abi, contractAddress).methods;
}

/**
 * Initiates the safe transfer of an ERC-721 token from one wallet to another
 * @param {string} ticketContract - the contract address of the ticket tier
 * @param {string} from - the wallet address of the sender
 * @param {string} to - the wallet address of the receiver
 * @param {number} token - the token id of the token being transferred
 * @returns {Promise}
 */
export function transferToken(ticketContract, from, to, token) {
  const contract = getSmartContract(ticketContract);
  return contract.safeTransferFrom(from, to, parseInt(token, 10)).send({ from, gas: 3000000 });
}

/**
 * Initiates the listing of a token for sale on the secondary market
 * @param {string} marketplace - the marketplace contract address
 * @param {string} from - the wallet address to send the transaction from
 * @param {string} ticketContract - the contract address of the ticket tier
 * @param {number} price - the listing price to sell for.
 * @param {number} token - the token id being listed for sale
 * @returns {Promise}
 */
export function sellToken(marketplace, from, ticketContract, price, token) {
  const contract = getMarketplaceContract(marketplace);
  return contract.resellTicket(ticketContract, parseInt(token, 10), price).send({ from });
}

/**
 * Initiaties the transaction to cancel the secondary sale of a ticket.
 * @param {string} marketplace - the marketplace contract address
 * @param {string} from - the wallet address to send the transaction from
 * @param {string} ticketContract - the contract address of the ticket tier
 * @param {number} token - the token id being listed for sale
 * @returns {Promise}
 */
export function cancelResale(marketplace, from, ticketContract, token) {
  const contract = getMarketplaceContract(marketplace);
  return contract.cancelResale(ticketContract, parseInt(token, 10)).send({ from });
}

/**
 * Initiaties the transaction to update the secondary sale price of a ticket.
 * @param {string} marketplace - the marketplace contract address
 * @param {string} from - the wallet address to send the transaction from
 * @param {string} ticketContract - the contract address of the ticket tier
 * @param {number} token - the token id being listed for sale
 * @returns {Promise}
 */
export function updateTicketResalePrice(marketplace, from, ticketContract, token, newPrice) {
  const contract = getMarketplaceContract(marketplace);
  return contract.updateTicketResalePrice(parseInt(newPrice, 10), ticketContract, parseInt(token, 10)).send({ from });
}

/**
 * Estimates the gas and potential errors from a ticket contract function
 * @param {string} contract
 * @param {string} method
 * @param {number} gas
 * @param {array} params
 * @returns {Promise}
 */
export function estimateTicketFunctionGas(contract, method, gas, params) {
  const smartContract = getSmartContract(contract);
  return smartContract[method](...params).estimateGas({ gas });
}

/**
 * Estimates the gas and potential errors from a marketplace function
 * @param {string} contract
 * @param {string} method
 * @param {number} gas
 * @param {array} params
 * @returns {Promise}
 */
export function estimateMarketplaceFunctionGas(contract, method, gas, params) {
  const smartContract = getMarketplaceContract(contract);
  return smartContract[method](...params).estimateGas({ gas });
}

export async function getCurrentChainIdHex() {
  const web3 = new Web3(window.ethereum);
  const chainId = await web3.eth.getChainId();

  return web3.utils.toHex(chainId);
}

export async function getBlockExplorerTxn(hash) {
  return process.env.NODE_ENV !== 'production'
    ? `https://etherscan.io/tx/${hash}`
    : `https://sepolia.etherscan.io/tx/${hash}`;
}

export async function deployTicketTierContract(ticketTier, eventInfo) {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractArtifact.abi);

  const { title, tokenURI, primarySalePrice, maxMarkup, liveDate, maxSupply } = ticketTier;

  const closeDate = new Date(eventInfo.endDate) / 1000;

  const ticketTierInformation = [
    tokenURI,
    primarySalePrice,
    maxMarkup,
    parseInt(MARKETPLACE_CONTRACT.feeNumerator, 10),
    new Date(liveDate) / 1000,
    closeDate,
    maxSupply,
  ];

  const eventInformation = [MARKETPLACE_CONTRACT.address, window.ethereum.selectedAddress, closeDate];

  const contractData = contract.deploy({
    data: contractArtifact.data.bytecode.object,
    arguments: [title, 'BPASS', ticketTierInformation, eventInformation],
  });

  const gas = await contractData.estimateGas();

  const deployedContract = await contractData.send({
    from: window.ethereum.selectedAddress,
    gas,
  });

  return deployedContract.options.address;
}
