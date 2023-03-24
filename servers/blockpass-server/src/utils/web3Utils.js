const Web3 = require('web3');
const fs = require('fs');
const logger = require('./logger');
const DateTime = require('./datetime');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER));

/**
 * Retrieves all details about a smart contract implementing the IBlockPassTicket interface.
 * @param {string} contractAddress
 * @returns
 */
const getTicketTierDetails = async (contractAddress) => {
  const ticketContractAbi = JSON.parse(fs.readFileSync('./contracts/artifacts/BlockPassTicket.json')).abi;

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

module.exports = {
  getTicketTierDetails,
};