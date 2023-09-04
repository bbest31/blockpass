'use strict';
const Moralis = require('moralis').default;
const { getTicketTierByContract } = require('../services/ticketTierServices');
const web3 = require('../apis/web3Api.js');
const { getEvmChain, getAbi, contractCallCallback } = require('../utils/web3Utils');

/**
 *
 * @param {string} wallet
 */
const getUserTickets = async (wallet) => {
  const chain = getEvmChain();

  if (!chain) {
    let err = new Error('Can not determine EVM Chain.');
    throw err;
  }

  // get all NFTs owned by the wallet address
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address: wallet,
    chain,
  });

  // For each NFT retrieve info only about ones who are BlockPass tickets.
  // Determine this by searching for the contract address amongst ticket tiers in the db
  const nfts = response.toJSON().result;

  const marketplaceAbi = getAbi('BlockPass');
  // search for any secondary tickets that are owned by the wallet and listed on the marketplace
  const marketplaceContract = new web3.eth.Contract(marketplaceAbi, process.env.MARKETPLACE_CONTRACT);
  const marketplaceMethods = marketplaceContract.methods;
  const resaleTickets = await marketplaceMethods.getResaleTickets(wallet).call(contractCallCallback);

  // add resale tickets to the nfts array
  for (let i = 0; i < resaleTickets.length; i++) {
    const tokenRef = resaleTickets[i];
    nfts.push({ token_address: tokenRef.ticketContract, token_id: tokenRef.token, isForSale: true });
  }

  let tickets = [];

  for (let index = 0; index < nfts.length; index++) {
    const token = nfts[index];
    const tier = await getTicketTierByContract(token.token_address);

    if (tier !== {}) {
      tickets.push({ token: parseInt(token.token_id), isForSale: token?.isForSale || false, tier });
    }
  }

  return tickets;
};

module.exports = {
  getUserTickets,
};
