'use strict';
const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema(
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
    img: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    contracts: {
      type: [String],
    },
  },
  { timestamps: true }
);

const eventsModel = mongoose.model('Events', eventsSchema);

module.exports = eventsModel;
