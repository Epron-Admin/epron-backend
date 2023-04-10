"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _db = _interopRequireDefault(require("./config/db.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _accessRouter = _interopRequireDefault(require("./controllers/access/access.router.js"));

var _usersRouter = _interopRequireDefault(require("./controllers/users/users.router.js"));

var _pickupsRouter = _interopRequireDefault(require("./controllers/requestpickup/pickups.router.js"));

var _epronRouter = _interopRequireDefault(require("./controllers/epron/epron.router.js"));

var _recyclersRouter = _interopRequireDefault(require("./controllers/recyclers/recyclers.router.js"));

var _collectionRouter = _interopRequireDefault(require("./controllers/collectioncenter/collection.router.js"));

var _uploads = _interopRequireDefault(require("./uploads.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import mongoose from 'mongoose';
// import balocodes from 'balocodes/express';
// const accessRouter = require('./controllers/access/access.router.js');
// const userRouter = require('./controllers/users/users.router.js');
// import uploadRouter from './upload';
// import verifier from 'email-verifier';
//Load config files
_dotenv["default"].config({
  path: './config/config.env'
});

var app = (0, _express["default"])();
(0, _db["default"])();
var port = process.env.PORT || 3000;
app.use((0, _cors["default"])());
app.options('*', _cors["default"]);
app.use(_bodyParser["default"].json());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/access', _accessRouter["default"]);
app.use('/user', _usersRouter["default"]);
app.use('/pickup', _pickupsRouter["default"]);
app.use('/epron', _epronRouter["default"]);
app.use('/recyclers', _recyclersRouter["default"]);
app.use('/centers', _collectionRouter["default"]);
app.use('/upload', _uploads["default"]);
app.use('*', function (req, res) {
  res.send('Welcome to Epron Backend, route not found');
});
var server = app.listen(port, function () {
  return console.log("Express server running in ".concat(process.env.NODE_ENV, " mode on port ").concat(port));
});
var _default = server; // module.exports = server;

exports["default"] = _default;