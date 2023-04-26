"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var Types = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type_code: {
    type: String,
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
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

var _default = _mongoose["default"].model('CategoryTypes', Types);

exports["default"] = _default;
//# sourceMappingURL=CategoryTypes.model.js.map