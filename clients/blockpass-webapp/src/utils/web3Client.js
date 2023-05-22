import Web3 from 'web3';
import contractArtifact from '../contracts/BlockPassTicket.json';

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
