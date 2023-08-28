'use strict';
const Moralis = require('moralis').default;
const { getTicketTierByContract } = require('../services/ticketTierServices');
const { getEvmChain } = require('../utils/web3Utils');

/**
 *
 * @param {string} wallet
 */
const getUserTickets = async (wallet) => {
  const chain = getEvmChain();
  console.log(chain);

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

  let tickets = [];
  for (let index = 0; index < nfts.length; index++) {
    const token = nfts[index];
    const tier = await getTicketTierByContract(token.token_address);
    tickets.push({ token: token.token_id, tier });
  }

  return tickets;
};

module.exports = {
  getUserTickets,
};
