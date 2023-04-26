"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationFunc = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var validationFunc = function validationFunc(req, res, next) {
  // let token = req.body.token || req.query.token;
  var token = req.headers.authorization.split(" ")[1]; // console.log('Headers', req.headers.authorization); 
  // console.log('SSSSSSSSSSSSSS', token);

  var decoded = _jsonwebtoken["default"].decode(token);

  req.decoded = decoded;

  if (req.decoded === null) {
    return res.status(401).send("Access denied");
  } else {
    // console.log('Decoded', req.decoded);
    next();
  }
};

exports.validationFunc = validationFunc;
//# sourceMappingURL=middleware.js.map