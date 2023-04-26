"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request_pickup = exports.fetch_all_pickup_status_completed_or_not = exports.fetch_all_pickup_based_on_location_unaccepted = exports.fetch_all_pickup_based_on_location_anduser = exports.fetch_all_pickup_based_on_location_accepted = exports.fetch_all_pickup_based_on_location = exports.fetch_all_pickup_based_on_acceptance = exports.fetch_all_pickup_accepted = exports.fetch_all_pickup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _RequestPickupModel = _interopRequireDefault(require("../../models/RequestPickup.model.js"));

var _express = _interopRequireDefault(require("express"));

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

var _querystring = _interopRequireDefault(require("querystring"));

var userEmail;

var router = _express["default"].Router();

var request_pickup = function request_pickup(req, res) {
  if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.lga || !req.body.state || !req.body.description || !req.body.pickup_date) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name, address, phone, lga, pickup date, description and state are required"
    });
  }

  var code = Math.random().toString(36).slice(2, 7);
  var pickup = new _RequestPickupModel["default"]({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    request_code: code,
    cuntry: req.body.country,
    // city: req.body.city,
    state: req.body.state,
    lga: req.body.lga,
    description: req.body.description,
    pickup_date: req.body.pickup_date,
    created_at: Date.now(),
    updated_at: Date.now()
  });
  pickup.save().then(function (data) {
    res.status(201).json({
      requestdata: data,
      error: false,
      message: "Request pickup sent successful!"
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(401).send({
      error: true,
      message: "Failed to request pickup"
    });
  });
};

exports.request_pickup = request_pickup;

var fetch_all_pickup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups, total_pickups_completed, total_pickups_uncompleted, total_pickups_accepted, total_pickups_not_accepted;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context.next = 7;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 7:
            total_pickups = _context.sent;
            _context.next = 10;
            return _RequestPickupModel["default"].countDocuments({
              completed: true
            }).exec();

          case 10:
            total_pickups_completed = _context.sent;
            _context.next = 13;
            return _RequestPickupModel["default"].countDocuments({
              completed: false
            }).exec();

          case 13:
            total_pickups_uncompleted = _context.sent;
            _context.next = 16;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: true
            }).exec();

          case 16:
            total_pickups_accepted = _context.sent;
            _context.next = 19;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: false
            }).exec();

          case 19:
            total_pickups_not_accepted = _context.sent;
            _context.t0 = endIndex;
            _context.next = 23;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 23:
            _context.t1 = _context.sent;

            if (!(_context.t0 < _context.t1)) {
              _context.next = 26;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 26:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({}).sort('-created_at').populate("accepted_by").limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                total_pickups_completed: total_pickups_completed,
                total_pickups_uncompleted: total_pickups_uncompleted,
                total_pickups_accepted: total_pickups_accepted,
                total_pickups_not_accepted: total_pickups_not_accepted,
                requests: requestpickup,
                message: "All request for pickup successful!"
              });
            });

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetch_all_pickup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetch_all_pickup = fetch_all_pickup;

var fetch_all_pickup_status_completed_or_not = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context2.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              completed: req.query.completed
            }).exec();

          case 7:
            total_pickups = _context2.sent;
            _context2.t0 = endIndex;
            _context2.next = 11;
            return _RequestPickupModel["default"].countDocuments({
              completed: req.query.completed
            }).exec();

          case 11:
            _context2.t1 = _context2.sent;

            if (!(_context2.t0 < _context2.t1)) {
              _context2.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              completed: req.query.completed
            }).sort('-created_at').populate("accepted_by").limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "success!"
              });
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetch_all_pickup_status_completed_or_not(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_status_completed_or_not = fetch_all_pickup_status_completed_or_not;

var fetch_all_pickup_based_on_location = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context3.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              lga: req.params.location
            }).exec();

          case 7:
            total_pickups = _context3.sent;
            _context3.t0 = endIndex;
            _context3.next = 11;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 11:
            _context3.t1 = _context3.sent;

            if (!(_context3.t0 < _context3.t1)) {
              _context3.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              lga: req.params.location
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "All request for pickup based on loaction successful!"
              });
            });

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetch_all_pickup_based_on_location(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_location = fetch_all_pickup_based_on_location;

var fetch_all_pickup_based_on_location_unaccepted = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context4.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              lga: req.params.location,
              accept_request: false
            }).exec();

          case 7:
            total_pickups = _context4.sent;
            _context4.t0 = endIndex;
            _context4.next = 11;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 11:
            _context4.t1 = _context4.sent;

            if (!(_context4.t0 < _context4.t1)) {
              _context4.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              lga: req.params.location,
              accept_request: false
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "All request for pickup based on loaction and not accepted successful!"
              });
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetch_all_pickup_based_on_location_unaccepted(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_location_unaccepted = fetch_all_pickup_based_on_location_unaccepted;

var fetch_all_pickup_based_on_location_accepted = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context5.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              lga: req.params.location,
              accept_request: true
            }).exec();

          case 7:
            total_pickups = _context5.sent;
            _context5.t0 = endIndex;
            _context5.next = 11;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 11:
            _context5.t1 = _context5.sent;

            if (!(_context5.t0 < _context5.t1)) {
              _context5.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              lga: req.params.location,
              accept_request: true
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "All request for pickup based on loaction and accepted successful!"
              });
            });

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function fetch_all_pickup_based_on_location_accepted(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_location_accepted = fetch_all_pickup_based_on_location_accepted;

var fetch_all_pickup_accepted = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context6.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: true
            }).exec();

          case 7:
            total_pickups = _context6.sent;
            _context6.t0 = endIndex;
            _context6.next = 11;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: true
            }).exec();

          case 11:
            _context6.t1 = _context6.sent;

            if (!(_context6.t0 < _context6.t1)) {
              _context6.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              accept_request: true
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "All request for pickup based on loaction and accepted successful!"
              });
            });

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetch_all_pickup_accepted(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_accepted = fetch_all_pickup_accepted;

var fetch_all_pickup_based_on_acceptance = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context7.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: req.query.accepted
            }).exec();

          case 7:
            total_pickups = _context7.sent;
            _context7.t0 = endIndex;
            _context7.next = 11;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: req.query.accepted
            }).exec();

          case 11:
            _context7.t1 = _context7.sent;

            if (!(_context7.t0 < _context7.t1)) {
              _context7.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              accept_request: req.query.accepted
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "All request for pickup based on loaction and accepted successful!"
              });
            });

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function fetch_all_pickup_based_on_acceptance(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_acceptance = fetch_all_pickup_based_on_acceptance;

var fetch_all_pickup_based_on_location_anduser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context8.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              accepted_by: req.params.id,
              lga: req.params.location,
              accept_request: true
            }).exec();

          case 7:
            total_pickups = _context8.sent;
            _context8.t0 = endIndex;
            _context8.next = 11;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 11:
            _context8.t1 = _context8.sent;

            if (!(_context8.t0 < _context8.t1)) {
              _context8.next = 14;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 14:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _RequestPickupModel["default"].find({
              accepted_by: req.params.id,
              lga: req.params.location,
              accept_request: true
            }).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch request pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total: total_pickups,
                requests: requestpickup,
                message: "successful!"
              });
            });

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function fetch_all_pickup_based_on_location_anduser(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_location_anduser = fetch_all_pickup_based_on_location_anduser;
//# sourceMappingURL=pickups.controllers.js.map