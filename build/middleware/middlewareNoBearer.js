"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationFunc = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

// import express from 'express';
// const router = express.Router();
var validationFunc = function validationFunc(req, res, next) {
  var token = req.body.token || req.query.token;

  var decoded = _jsonwebtoken["default"].decode(token);

  req.decoded = decoded;

  if (req.decoded === null) {
    return res.status(401).send("Access denied");
  } else {
    // console.log('Decoded', req.decoded);
    next();
  }
}; // const validationFunc2 = (req, res, next) => {
//     let token = req.body.token || req.query.token;
//     let decoded = jwt.decode(token);
//     req.decoded = decoded;
//     next();
// };
// export { validationFunc2 };


exports.validationFunc = validationFunc;
//# sourceMappingURL=middlewareNoBearer.js.map