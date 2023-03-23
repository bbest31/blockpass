'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new mongoose.Schema(
  {
    orgId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    location: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    ticketTiers: {
      type: [ObjectId],
    },
  },
  { timestamps: true }
);

const eventsModel = mongoose.model('Event', schema);

module.exports = eventsModel;
