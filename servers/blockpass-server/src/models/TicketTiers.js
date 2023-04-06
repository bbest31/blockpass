'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema(
  {
    contract: {
      type: String,
      required: [true, 'Contract address is required'],
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/g.test(v);
        },
        message: (props) => `${props.value} is not a valid contract address!`,
      },
    },
    description: {
      type: String,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    enhancements: {
      type: [{ type: ObjectId, ref: 'Enhancement' }],
    },
  },
  {
    timestamps: true,
    collection: 'ticket-tiers',
  }
);

const ticketTiersModel = mongoose.model('TicketTier', schema);

module.exports = ticketTiersModel;
