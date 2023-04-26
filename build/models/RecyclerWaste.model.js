"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var RecyclerWaste = new Schema({
  weight: {
    type: Number,
    required: true
  },
  unit_weight: {
    type: Number,
    required: true
  },
  recycler_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  ewaste_code: {
    type: String,
    required: true
  },
  collection_centerid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

var _default = _mongoose["default"].model('RecyclerWaste', RecyclerWaste);

exports["default"] = _default;
//# sourceMappingURL=RecyclerWaste.model.js.map