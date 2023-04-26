"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var Schema = _mongoose["default"].Schema;
var newUser = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  collection_center: [{
    type: Schema.Types.ObjectId,
    ref: 'CollectionCenter'
  }],
  // country: {
  //     type: String,
  // },
  // countryid: {
  //     type: String,
  // },
  address: {
    type: String
  },
  state: {
    type: String
  },
  lga: {
    type: String
  },
  lat: {
    type: String
  },
  verified: {
    type: Boolean,
    "default": false
  },
  role: {
    type: String,
    required: true // default: 'user'

  },
  epron_admin: {
    type: String,
    "default": null
  },
  blocked: {
    type: Boolean,
    "default": false
  },
  password: {
    type: String,
    required: true
  },
  verifyToken: {
    type: String
  },
  verifyTokenExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
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

newUser.statics.hashPassword = function hashPassword(password) {
  return _bcrypt["default"].hashSync(password, 10);
};

newUser.methods.isValid = function (hashedpassword) {
  return _bcrypt["default"].compareSync(hashedpassword, this.password);
};

var _default = _mongoose["default"].model('FakeUser', newUser);

exports["default"] = _default;
//# sourceMappingURL=FakeUser.model.js.map