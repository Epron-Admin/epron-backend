"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_ewaste_to_pickedup_by_recycler = exports.log_weight_from_collection_center_ewaste = exports.fetch_recyclers_collection_center = exports.fetch_logewaste_weight_by_recycler = exports.fetch_ewaste_by_collection_center_ready_for_pickup = exports.fetch_ewaste_by_collection_center_pickedup = exports.fetch_ewaste_by_collection_center = exports.fetch_all_pickup_by_location = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _RequestPickupModel = _interopRequireDefault(require("../../models/RequestPickup.model.js"));

var _EwasteModel = _interopRequireDefault(require("../../models/Ewaste.model.js"));

var _RecyclerWasteModel = _interopRequireDefault(require("../../models/RecyclerWaste.model.js"));

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

// import Center from '../../models/CollectionCenter.model.js'
// import express from 'express';
var fetch_all_pickup_by_location = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
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
            return _RequestPickupModel["default"].countDocuments({}).exec();

          case 7:
            total_pickups = _context.sent;
            _context.t0 = endIndex;
            _context.next = 11;
            return _RequestPickupModel["default"].countDocuments().exec();

          case 11:
            _context.t1 = _context.sent;

            if (!(_context.t0 < _context.t1)) {
              _context.next = 14;
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

            _RequestPickupModel["default"].find({}).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch all request pickups"
                });
              }

              if (!requestpickup) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 404,
                  message: "pickups not found"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total_pickups: total_pickups,
                requests: requestpickup,
                message: "All request for pickup successful!"
              });
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetch_all_pickup_by_location(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_by_location = fetch_all_pickup_by_location;

var fetch_ewaste_by_collection_center = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
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
            return _EwasteModel["default"].countDocuments({
              user_id: req.body.user_id
            }).exec();

          case 7:
            total_ewaste_logged = _context2.sent;
            _context2.t0 = endIndex;
            _context2.next = 11;
            return _EwasteModel["default"].countDocuments().exec();

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

            _EwasteModel["default"].find({
              user_id: req.body.user_id
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch center ewaste"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find e-waste"
                });
              }

              var waste_weight = ewaste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              return res.json({
                error: false,
                status: 201,
                total_logged_ewaste: total_ewaste_logged,
                total_weight_logged: waste_weight,
                pagination: results,
                ewaste: ewaste,
                message: "Fetch all logged ewaste successful!"
              });
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetch_ewaste_by_collection_center(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetch_ewaste_by_collection_center = fetch_ewaste_by_collection_center;

var fetch_ewaste_by_collection_center_ready_for_pickup = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
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
            return _EwasteModel["default"].countDocuments({
              user_id: req.params.id,
              ready_pickup: req.query.ready_pickup
            }).exec();

          case 7:
            total_ewaste_logged = _context3.sent;
            _context3.t0 = endIndex;
            _context3.next = 11;
            return _EwasteModel["default"].countDocuments({
              ready_pickup: req.query.ready_pickup
            }).exec();

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

            _EwasteModel["default"].find({
              user_id: req.params.id,
              ready_pickup: req.query.ready_pickup
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch center ewaste"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find e-waste"
                });
              }

              var waste_weight = ewaste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              return res.json({
                error: false,
                status: 201,
                total_logged_ewaste: total_ewaste_logged,
                total_weight_logged: waste_weight,
                pagination: results,
                ewaste: ewaste,
                message: "success!"
              });
            });

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetch_ewaste_by_collection_center_ready_for_pickup(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetch_ewaste_by_collection_center_ready_for_pickup = fetch_ewaste_by_collection_center_ready_for_pickup;

var fetch_ewaste_by_collection_center_pickedup = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
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
            return _EwasteModel["default"].countDocuments({
              user_id: req.body.user_id,
              pickedup: req.query.pickedup
            }).exec();

          case 7:
            total_ewaste_logged = _context4.sent;
            _context4.t0 = endIndex;
            _context4.next = 11;
            return _EwasteModel["default"].countDocuments({
              pickedup: req.query.pickedup
            }).exec();

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

            _EwasteModel["default"].find({
              user_id: req.body.user_id,
              pickedup: req.query.pickedup
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch center ewaste"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find e-waste"
                });
              }

              var waste_weight = ewaste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              return res.json({
                error: false,
                status: 201,
                total_logged_ewaste: total_ewaste_logged,
                total_weight_logged: waste_weight,
                pagination: results,
                ewaste: ewaste,
                message: "success!"
              });
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetch_ewaste_by_collection_center_pickedup(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.fetch_ewaste_by_collection_center_pickedup = fetch_ewaste_by_collection_center_pickedup;

var log_weight_from_collection_center_ewaste = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var ton_weight, codePin;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(!req.body.weight || !req.body.collection_centerid || !req.body.unit || !req.body.recycler_id)) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", res.status(401).send({
              error: true,
              message: "Weight, unit, recycler_id and collection center ID are required"
            }));

          case 2:
            if (req.body.unit === 'kg') {
              ton_weight = 0.00110231 * req.body.weight;
            }

            if (req.body.unit === 'g') {
              ton_weight = 0.0000011023 * req.body.weight;
            }

            codePin = Math.random().toString(36).slice(2, 7); // collection cennter id is the user ID signed s collection center

            _UserModel["default"].findById({
              _id: req.body.recycler_id
            }).exec(function (err, doc) {
              // console.log("User", doc);
              if (err) {
                return res.status(401).send({
                  error: true,
                  code: 401,
                  message: "An error occcured from recycler"
                });
              }

              if (!doc) {
                return res.send({
                  error: true,
                  code: 404,
                  message: 'User does not exist.'
                });
              } else {
                var among = doc.collection_center.includes(req.body.collection_centerid);

                if (among === true) {
                  var ewaste = new _RecyclerWasteModel["default"]({
                    weight: ton_weight,
                    unit_weight: req.body.weight,
                    unit: req.body.unit,
                    collection_centerid: req.body.collection_centerid,
                    recycler_id: req.body.recycler_id,
                    ewaste_code: codePin,
                    created_at: Date.now(),
                    updated_at: Date.now()
                  });
                  ewaste.save().then(function (result) {
                    res.json({
                      error: false,
                      code: 201,
                      status: 'success',
                      message: 'weight added successfuly',
                      weight: result
                    }); // res.status(200).send({mssage: 'Category created successful'});
                  })["catch"](function (err) {
                    // console.log("Errorrrrrrrrrr", err);
                    res.send({
                      error: true,
                      message: 'failed to add data'
                    });
                  });
                } else {
                  return res.send({
                    error: true,
                    code: 404,
                    message: 'collection center not assigned to Recycler.'
                  });
                }
              }
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function log_weight_from_collection_center_ewaste(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); // Dont remove this code, to be used if reyclers are added to collection center
// export const log_weight_from_collection_center_ewaste2 = async (req, res) => {
//     if (
//         (!req.body.weight) ||
//         (!req.body.collection_centerid) ||
//         (!req.body.unit) ||
//         (!req.body.recycler_id)
//     )
//     {
//         // console.log("All not filled");
//         return res.status(401).send({error: true, message: "Weight, unit, recycler_id and collection center ID are required"});
//     }
//     let ton_weight;
//     if (req.body.unit === 'kg') {
//         ton_weight = 0.00110231 * req.body.weight;
//     }
//     if (req.body.unit === 'g') {
//         ton_weight = 0.0000011023 * req.body.weight;
//     }
//     const codePin = Math.random().toString(36).slice(2, 7);
//     // collection cennter id is the user ID signed s collection center
//     User.findById({ _id: req.body.collection_centerid}).exec((err, doc) => {
//         console.log("User collection center", doc);
//         if (err) {
//             return res.status(401).send({error: true, code: 401, message: "An error occcured from collection center"});
//         }
//         if (!doc) {
//             return res.send({error: true, code: 404, message: 'Collection center does not exist.'});
//         }
//         else {
//             const among = doc.recyclers.includes(req.body.recycler_id);
//             if (among === true) {
//                 let ewaste = new RecyclerWaste({
//                     weight: ton_weight,
//                     unit_weight: req.body.weight, 
//                     unit: req.body.unit,
//                     collection_centerid: req.body.collection_centerid,
//                     recycler_id: req.body.recycler_id,
//                     ewaste_code: codePin,
//                     created_at: Date.now(),
//                     updated_at: Date.now()
//                 });
//                 ewaste.save().then(result => {
//                     res.json({error: false, code: 201, status: 'success', message: 'weight added successfuly', weight: result });
//                     // res.status(200).send({mssage: 'Category created successful'});
//                 }).catch(err => {
//                     // console.log("Errorrrrrrrrrr", err);
//                     res.send({ error: true, message: 'failed to add data' });
//                 });
//             } else {
//                 return res.send({error: true, code: 404, message: 'Recycler not assigned to collection center.'});
//             }
//         }
//     })
// }


exports.log_weight_from_collection_center_ewaste = log_weight_from_collection_center_ewaste;

var fetch_logewaste_weight_by_recycler = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
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
            return _RecyclerWasteModel["default"].countDocuments({
              recycler_id: req.params.recycler_id
            }).exec();

          case 7:
            total_ewaste_logged = _context6.sent;
            _context6.t0 = endIndex;
            _context6.next = 11;
            return _RecyclerWasteModel["default"].countDocuments().exec();

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

            _RecyclerWasteModel["default"].find({
              recycler_id: req.params.recycler_id
            }).populate('collection_centerid').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch recycler ewaste weight logged"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find recyceler e-waste weight logged"
                });
              }

              var waste_weight = ewaste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              return res.json({
                error: false,
                status: 201,
                total_logged_ewaste: total_ewaste_logged,
                total_weight_logged_ton: waste_weight,
                pagination: results,
                ewaste: ewaste,
                message: "Fetch all logged ewaste successful!"
              });
            });

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetch_logewaste_weight_by_recycler(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fetch_logewaste_weight_by_recycler = fetch_logewaste_weight_by_recycler;

var update_ewaste_to_pickedup_by_recycler = function update_ewaste_to_pickedup_by_recycler(req, res) {
  _EwasteModel["default"].findById({
    _id: req.body.id,
    user_id: req.body.user_id
  }).exec(function (err, waste) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "Error oocured"
      });
    }

    if (!waste) {
      return res.json({
        error: true,
        status: 404,
        message: "e-waste not found"
      });
    }

    if (waste.user_id != req.body.user_id) {
      return res.status(404).send({
        error: true,
        message: "collection center not found"
      });
    } else {
      if (waste.pickedup === false) {
        waste.pickedup = true;
        waste.save().then(function (result) {
          return res.status(200).send((0, _defineProperty2["default"])({
            error: false,
            code: 200,
            message: 'success'
          }, "message", "e-waste has been picked up"));
        })["catch"](function (err) {
          // console.log(err.code);
          res.send({
            error: true,
            message: 'failed to update e-waste to picked up'
          });
        });
      } else {
        return res.json({
          error: true,
          status: 401,
          message: "e-waste already picked up"
        });
      }
    }
  });
};

exports.update_ewaste_to_pickedup_by_recycler = update_ewaste_to_pickedup_by_recycler;

var fetch_recyclers_collection_center = function fetch_recyclers_collection_center(req, res) {
  _UserModel["default"].findById({
    _id: req.params.recycler_id,
    role: 'collector'
  }).populate('collection_center').exec(function (err, recyceler) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "Error oocured"
      });
    }

    if (!recyceler) {
      return res.json({
        error: true,
        status: 404,
        message: "recyceler not found"
      });
    } // if (recyceler.user_id != req.body.user_id) {
    //     return res.status(404).send({error: true, message: "collection center not found"});
    // } 
    else {
      return res.status(200).send({
        error: false,
        code: 200,
        message: 'success',
        recyceler: recyceler
      });
    }
  });
};

exports.fetch_recyclers_collection_center = fetch_recyclers_collection_center;
//# sourceMappingURL=recyclers.controllers.js.map