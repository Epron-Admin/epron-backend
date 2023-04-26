"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _userAccess = require("./user.access.js");

// const express = require('express');
var router = _express["default"].Router();

router.post('/user-reg', _userAccess.reg_userx);
router.post('/user-login', _userAccess.login_user);
router.post('/verify-token', _userAccess.generate_verify_token_validate_user);
router.post('/verify/:token', _userAccess.verify_user);
router.post('/fake', _userAccess.reg_user_fake); // module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=access.router.js.map