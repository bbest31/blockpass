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
 * @returns {Array<function>}
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
 * @param {string} address
 * @param {string} from
 * @param {string} to
 * @param {number} token
 * @returns {Promise}
 */
export function transferToken(address, from, to, token) {
  const contract = getSmartContract(address);
  return contract.safeTransferFrom(from, to, parseInt(token, 10)).send({ from });
}

export async function getCurrentChainIdHex() {
  const web3 = new Web3(window.ethereum);
  const chainId = await web3.eth.getChainId();

  return web3.utils.toHex(chainId);
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
