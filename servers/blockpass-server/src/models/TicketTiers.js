'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    contract: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'ticket-tiers',
  }
);

const ticketTiersModel = mongoose.model('TicketTier', schema);

module.exports = ticketTiersModel;
