'use strict';
const mongoose = require('mongoose');

const ENHANCEMENT_TYPES = ['Reward', 'Gift', 'Access', 'Discount'];

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Enhancement title required'],
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    redemptionLimit: {
      type: Number,
      required: [true, 'Redemption limit required'],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) => `${props.value} can not be less than one!`,
      },
    },
    type: {
      type: String,
      required: [true, 'Enhancement type required'],
      validate: {
        validator: function (v) {
          return ENHANCEMENT_TYPES.includes(v);
        },
        message: (props) => `${props.value} is not a valid enhancement type!`,
      },
    },
    expiry: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    shortDesc: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    longDesc: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return String(v).trim().length > 0;
        },
        message: (props) => `${props.value} can not be empty!`,
      },
    },
    active: {
      type: Boolean,
      required: [true, 'Active state is required'],
    },
  },
  { timestamps: true }
);

const enhancementsModel = mongoose.model('Enhancement', schema);

module.exports = enhancementsModel;
