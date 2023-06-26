const web3 = require('../apis/web3Api');
const fs = require('fs');
const logger = require('./logger');
const DateTime = require('./datetime');
const Moralis = require('moralis').default;
const EvmChain = Moralis.EvmUtils.EvmChain;

/**
 * Retrieves the contract address of the marketplace contract the ticket tier is associated with.
 * @param {string} contractAddress
 * @returns
 */
const getMarketplaceContract = async (contractAddress) => {
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json'));

  try {
    const contract = new web3.eth.Contract(ticketContractAbi, contractAddress).methods;

    const marketplaceContract = await contract.marketplaceContract().call(contractCallCallback);
    return marketplaceContract;
  } catch (err) {
    logger.log('error', `Error retreiving smart contract ticket tier details for ${contractAddress}| ${err}`);
    throw err;
  }
};

/**
 * Returns the JSON that represents the contract ABI.
 * @param {string} name - The name of the abi file.
 * @returns {Array} result
 */
const getAbi = (name) => {
  if (!name) {
    return null;
  }
  const abi = JSON.parse(fs.readFileSync(`./contracts/artifacts/${name}.json`));

  return abi;
};

/**
 * Retrieves all details about a smart contract implementing the IBlockPassTicket interface.
 * @param {string} contractAddress
 * @returns
 */
const getTicketTierDetails = async (contractAddress) => {
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json'));

  try {
    const contract = new web3.eth.Contract(ticketContractAbi, contractAddress).methods;

    const tokenURI = await contract._tokenURI().call(contractCallCallback);
    const name = await contract.name().call(contractCallCallback);
    const supply = await contract.supply().call(contractCallCallback);
    const symbol = await contract.symbol().call(contractCallCallback);
    const totalTicketsForSale = await contract.getTotalTicketsForSale().call(contractCallCallback);
    const primarySalePrice = await contract.primarySalePrice().call(contractCallCallback);
    const secondaryMarkup = await contract.secondaryMarkup().call(contractCallCallback);
    const marketplaceContract = await contract.marketplaceContract().call(contractCallCallback);
    const eventOrganizer = await contract.eventOrganizer().call(contractCallCallback);

    const liveDate = await contract.liveDate().call(contractCallCallback);
    const closeDate = await contract.closeDate().call(contractCallCallback);
    const eventEndDate = await contract.eventEndDate().call(contractCallCallback);

    const paused = await contract.paused().call(contractCallCallback);

    const ticketData = {
      tokenURI: tokenURI,
      name: name,
      supply: supply,
      symbol: symbol,
      marketplaceContract: marketplaceContract,
      eventOrganizer: eventOrganizer,
      totalTicketsForSale: totalTicketsForSale,
      primarySalePrice: primarySalePrice,
      secondaryMarkup: secondaryMarkup,
      liveDate: DateTime.convertEpochToDate(liveDate),
      closeDate: DateTime.convertEpochToDate(closeDate),
      eventEndDate: DateTime.convertEpochToDate(eventEndDate),
      paused: paused,
    };

    return ticketData;
  } catch (err) {
    logger.log('error', `Error retreiving smart contract ticket tier details for ${contractAddress}| ${err}`);
    throw err;
  }
};

const contractCallCallback = (err, result) => {
  if (err) {
    logger.log('error', `Error executing smart contract method call err:${err} | result ${result}`);
    throw err;
  }
};

/**
 * Returns the Moralis object indicating the EVM chain the server is operating on.
 * @returns {Evm.Chain}
 */
const getEvmChain = () => {
  const chain = process.env.EVM_CHAIN;
  if (chain === undefined) {
    return null;
  }

  if (process.env.NODE_ENV === 'production') {
    switch (chain) {
      case 'POLYGON':
        return EvmChain.POLYGON;
      case 'BSC':
        return EvmChain.BSC;
      case 'AVALANCHE':
        return EvmChain.AVALANCHE;
      case 'CRONOS':
        return EvmChain.CRONOS;
      default:
        return EvmChain.ETHEREUM;
    }
  } else {
    switch (chain) {
      case 'SEPOLIA':
        return EvmChain.SEPOLIA;
      case 'BSC_TESTNET':
        return EvmChain.BSC_TESTNET;
      case 'FUJI':
        return EvmChain.FUJI;
      case 'CRONOS_TESTNET':
        return EvmChain.CRONOS_TESTNET;
      default:
        return EvmChain.MUMBAI;
    }
  }
};

module.exports = {
  getTicketTierDetails,
  getEvmChain,
  getMarketplaceContract,
  getAbi,
  contractCallCallback,
};
