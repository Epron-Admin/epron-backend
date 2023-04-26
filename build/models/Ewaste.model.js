"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var ewaste = new Schema({
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sub_category_id: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryTypes',
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
  unit: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit_weight: {
    type: Number // required: true

  },
  ewaste_pin: {
    type: String // required: true,

  },
  pickedup: {
    type: Boolean,
    "default": false
  },
  ready_pickup: {
    type: Boolean,
    "default": false
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
}); // newUser.index({ name : 'text', email : 'text' });

var _default = _mongoose["default"].model('Ewaste', ewaste);

exports["default"] = _default;
//# sourceMappingURL=Ewaste.model.js.map