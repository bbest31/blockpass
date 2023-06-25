const Web3 = require('web3');
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
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json')).abi;

  try {
    const web3 = new Web3(process.env.PROVIDER);
    if (web3.currentProvider === null) {
      console.log(web3.currentProvider);
      throw new Error('Unable to connect to web3 connection provider.');
    }
    const contract = new web3.eth.Contract(ticketContractAbi, contractAddress).methods;

    const marketplaceContract = await contract.marketplaceContract().call(contractCallCallback);
    return marketplaceContract;
  } catch (err) {
    logger.log('error', `Error retreiving smart contract ticket tier details for ${contractAddress}| ${err}`);
    throw err;
  }
};

/**
 * Returns the JSON that represents the ABI for the TicketSold event from the BlockPass marketplace contract.
 * @returns {Object} eventAbi
 */
const getTicketSoldEventAbi = () => {
  const marketplaceAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPass.json')).abi;

  // TODO: finish
};

/**
 * Retrieves all details about a smart contract implementing the IBlockPassTicket interface.
 * @param {string} contractAddress
 * @returns
 */
const getTicketTierDetails = async (contractAddress) => {
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json')).abi;

  try {
    const web3 = new Web3(process.env.PROVIDER);
    if (web3.currentProvider === null) {
      console.log(web3.currentProvider);
      throw new Error('Unable to connect to web3 connection provider.');
    }
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
};
