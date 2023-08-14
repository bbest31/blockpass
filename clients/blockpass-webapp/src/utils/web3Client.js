import Web3 from 'web3';
import contractArtifact from '../contracts/BlockPassTicket.json';
import { MARKETPLACE_CONTRACT } from '../config';

export function getWalletAddress(accountChangedHandler) {
  const provider = window.ethereum;

  if (typeof provider !== 'undefined') {
    provider.request({ method: 'eth_requestAccounts' }).then((accounts) => accountChangedHandler(accounts[0]));

    provider.on('accountsChanged', (accounts) => accountChangedHandler(accounts[0]));
  }
}

export function getSmartContract(contractAddress) {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(contractArtifact.abi, contractAddress).methods;
}

export async function getCurrentChainIdHex() {
  const web3 = new Web3(window.ethereum);
  const chainId = await web3.eth.getChainId();

  return web3.utils.toHex(chainId);
}

export async function deployTicketTierContract(ticketTier, eventInfo) {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractArtifact.abi);

  const { title, description, tokenURI, primarySalePrice, maxMarkup, liveDate, maxSupply } = ticketTier;

  const closeDate = new Date(eventInfo.endDate) / 1000;
  const feeNumerator = 10;

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
