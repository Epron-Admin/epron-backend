"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var equip = new Schema({
  category_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  category_name: {
    type: String,
    required: true
  },
  sub_category_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sub_category_name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  user_id: {
    type: String // required: true

  },
  total: {
    type: Number // required: true

  },
  unit_price: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    "default": false //     // required: true

  },
  equipment_pin: {
    type: String // required: true,

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

var _default = _mongoose["default"].model('Equip', equip);

exports["default"] = _default;
//# sourceMappingURL=Epuip.model.js.map