"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var Category = new Schema({
  name: {
    type: String,
    required: true
  },
  category_code: {
    type: String,
    required: true
  },
  // types: {
  //     type: Array,
  // },
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

var _default = _mongoose["default"].model('Category', Category);

exports["default"] = _default;
//# sourceMappingURL=Category.model.js.map