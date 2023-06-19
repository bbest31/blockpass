'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new mongoose.Schema(
  {
    orgId: {
      type: String,
      required: [true, 'Organization id is required'],
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Event start date is required'],
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      required: [true, 'Event description is required.'],
    },
    images: {
      type: [String],
    },
    location: {
      type: String,
      required: [true, 'Event location is required.'],
    },
    website: {
      type: String,
      required: [true, 'Event website is required.'],
    },
    ticketTiers: {
      type: [ObjectId],
    },
  },
  { timestamps: true }
);

const eventsModel = mongoose.model('Event', schema);

module.exports = eventsModel;
