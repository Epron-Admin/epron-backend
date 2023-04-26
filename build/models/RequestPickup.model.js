"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var requestPickup = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  country: {
    type: String // required: true

  },
  state: {
    type: String,
    required: true
  },
  lga: {
    type: String,
    required: true
  },
  // stateid: {
  //     type: String,
  //     required: true
  // },
  // city: {
  //     type: String,
  //     required: true
  // },
  // cityid: {
  //     type: String,
  //     required: true
  // },
  completed: {
    type: Boolean,
    "default": false
  },
  accept_request: {
    type: Boolean,
    "default": false,
    required: true
  },
  accepted_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  request_code: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pickup_date: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    once: true,
    "default": Date.now
  },
  updated_at: {
    type: Date,
    "default": Date.now
  }
});

var _default = _mongoose["default"].model('RequestPickup', requestPickup);

exports["default"] = _default;
//# sourceMappingURL=RequestPickup.model.js.map