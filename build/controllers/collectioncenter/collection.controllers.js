"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_logged_ewaste = exports.update_ewaste_to_ready_pickup = exports.remove_log_ewaste = exports.mark_pickup_as_completed = exports.log_single_ewaste = exports.fetch_ewaste_by_user = exports.fetch_collection_centers_by_userid = exports.excel_bulk_ewaste = exports.accept_request_pickup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

var _EwasteModel = _interopRequireDefault(require("../../models/Ewaste.model.js"));

var _CategoryTypesModel = _interopRequireDefault(require("../../models/CategoryTypes.model.js"));

var _RequestPickupModel = _interopRequireDefault(require("../../models/RequestPickup.model.js"));

var _console = _interopRequireDefault(require("console"));

// import Collection from '../../models/CollectionCenter.model.js';
// export const new_collection_ceneter = (req, res) => {
//     if ((!req.body.name) ||
//        (!req.body.address) ||
//        (!req.body.user_id) ||
//        (!req.body.lga) ||
//        (!req.body.lat) ||
//        (!req.body.long)
//     ) 
//     {
//         // console.log("All not filled");
//         return res.status(401).send({error: true, message: "Name, address, lga, lat, long, user_id are required"});
//     } 
//     let collection = new Collection({
//         name: req.body.name,
//         address: req.body.address,
//         user_id: req.body.user_id,
//         lga: req.body.lga,
//         lat: req.body.lat,
//         long: req.body.long,
//         created_at: Date.now(),
//         updated_at: Date.now()
//     });
//     collection.save().then(result => {
//         res.json({error: false, code: 201, status: 'success', message: 'collection center added successfully', 'collection_centers': result });
//     }).catch(err => {
//         // console.log(err);
//         res.send({ error: true, message: 'failed to add data' });
//     });
// }
// export const fetch_all_collection_centers = (req, res) => {
//     Collection.find({}).populate('user_id').sort('-created_at').exec((err, collection) => {
//         if (err) {
//             console.log(err);
//             return res.send({error: true, code: 401, message: "Failed to fecth your collecton centers"});
//             // return res.send(err);
//         }
//         return res.json({error: false, code: 201, status: 'success', message: 'fetch all categories', centers: collection });
//         // res.send(category);
//     });
// }
var fetch_collection_centers_by_userid = function fetch_collection_centers_by_userid(req, res) {
  _UserModel["default"].findById({
    _id: req.params.id
  }).sort('-created_at').exec(function (err, centers) {
    if (err) {
      // console.log(err);
      return res.status(401).send({
        error: true,
        message: "error occured"
      });
    }

    if (!centers) {
      // console.log(err);
      return res.status(404).send({
        error: true,
        message: "collection centers not found"
      });
    }

    return res.status(201).send({
      error: false,
      message: "success",
      collection_centers: centers
    });
  });
}; // export const remove_collection_center = (req, res) => {
//     Collection.findByIdAndRemove({ _id: req.params.id }, (err, center) => {
//         if (err) {
//             return res.json({error: true, status: 401, message: "failed to delete collection center"});
//         }
//         else {
//             return res.json({error: false, status: 201, message: "success!" });
//         }
//     });
// }
// export const update_center = (req, res) => {
//     let ton_weight = '';
//     if ((!req.body.name) ||
//         (!req.body.address) ||
//         // (!req.body.user_id) ||
//         (!req.body.lga) ||
//         (!req.body.lat) ||
//         (!req.body.long)
//     ) 
//     {
//      // console.log("All not filled");
//      return res.status(401).send({error: true, message: "Name, address, lga, lat and long are required"});
//     }
//     Collection.findById({_id: req.params.id}, (err, center) => {
//         if (err) {
//             res.send({code: 505, error: true, err: err, message: 'error occured' });
//             console.log(err);
//         }
//         if (!center)
//             res.send({code: 404, error: true, message: 'Can not find collection center' });
//             // return next(new Error('Could not load document'));
//         else {
//             // console.log('The user', user);
//             // console.log('the body', req.body);
//             center.name = req.body.name,
//             center.address = req.body.address,
//             // center.user_id = req.body.user_id,
//             center.lga = req.body.lga,
//             center.lat = req.body.lat,
//             center.long = req.body.long,
//             center.updated_at = Date.now()
//             center.save().then(result => {
//                 res.json({ error: false, code: 200, status: 'success', 'collection center  ': result });
//                 //res.status(200).send({mssage: 'update successful'});
//             }).catch(err => {
//                 console.log(err.code);
//                 res.send({ error: true, message: 'failed to update collection' });
//             });
//         }
//     });
// }


exports.fetch_collection_centers_by_userid = fetch_collection_centers_by_userid;

var log_single_ewaste = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!req.body.category_id || // (!req.body.category_name) ||
            // (!req.body.price) ||
            !req.body.sub_category_id || // (!req.body.sub_category_name) ||
            !req.body.quantity || !req.body.weight || !req.body.unit || !req.body.user_id)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              error: true,
              message: "Category_id, unit, type, quantity, weight and user_id are required"
            }));

          case 2:
            _UserModel["default"].findById({
              _id: req.body.user_id,
              role: 'collector'
            }).exec(function (err, user) {
              if (err) {
                _console["default"].log(err);

                return res.send(err);
              }

              if (user.role != 'collector') {
                return res.status(401).send({
                  error: true,
                  message: "This user can not log e-waste"
                });
              } else {
                var ton_weight;

                _CategoryTypesModel["default"].findById({
                  _id: req.body.sub_category_id
                }).exec(function (err, type) {
                  if (err) {
                    _console["default"].log(err);

                    return res.json({
                      error: true,
                      status: 401,
                      message: "Failed fetch types"
                    });
                  }

                  if (!type) {
                    return res.json({
                      error: true,
                      status: 404,
                      message: "Sub category not found"
                    });
                  } // note the weight is measured in tonage or ton, after the aggregation from the unit.


                  if (req.body.unit === 'kg') {
                    ton_weight = 0.00110231 * req.body.weight;
                  }

                  if (req.body.unit === 'g') {
                    ton_weight = 0.0000011023 * req.body.weight;
                  } // const ton_weight = req.body.unit * req.body.weight;
                  // const total = type.price *  req.body.quantity * ton_weight;


                  var total = type.price * ton_weight;
                  var pin = Math.random().toString(36).slice(2);
                  var ewaste = new _EwasteModel["default"]({
                    category_id: req.body.category_id,
                    // category_name: req.body.category_name,
                    // unit_price: type.price,
                    price: type.price,
                    total: Math.round(total),
                    sub_category_id: req.body.sub_category_id,
                    // sub_category_name: req.body.sub_category_name,
                    quantity: req.body.quantity,
                    weight: ton_weight,
                    unit: req.body.unit,
                    unit_weight: req.body.weight,
                    user_id: req.body.user_id,
                    ewaste_pin: pin,
                    created_at: Date.now(),
                    updated_at: Date.now()
                  });
                  ewaste.save().then(function (data) {
                    res.status(201).json({
                      ewaste: data,
                      error: false,
                      message: "e-Waste saved successful!"
                    });
                  })["catch"](function (err) {
                    _console["default"].log(err);

                    res.status(401).send({
                      error: true,
                      message: "Failed to save e-Waste"
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function log_single_ewaste(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.log_single_ewaste = log_single_ewaste;

var excel_bulk_ewaste = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _UserModel["default"].findById({
              _id: req.body.user_id,
              role: 'collector'
            }).exec(function (err, user) {
              if (!req.body.category_id || !req.body.total || !req.body.price || !req.body.sub_category_id || !req.body.unit_weight || !req.body.quantity || !req.body.weight || !req.body.unit || !req.body.user_id) {
                return res.status(401).send({
                  error: true,
                  message: "Category_id, price, sub_category_id, unit_weight, unit, total, quantity, weight and user_id are required"
                });
              }

              if (err) {
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured for this user"
                });
              }

              if (!user) {
                return res.json({
                  error: true,
                  status: 401,
                  message: "user not found"
                });
              }

              var ewaste = new _EwasteModel["default"]({
                category_id: req.body.category_id,
                price: req.body.price,
                total: req.body.total,
                sub_category_id: req.body.sub_category_id,
                quantity: req.body.quantity,
                weight: req.body.weight,
                unit: req.body.unit,
                unit_weight: req.body.unit_weight,
                user_id: req.body.user_id,
                equipment_pin: req.body.equipment_pin,
                created_at: Date.now(),
                updated_at: Date.now()
              });
              ewaste.save().then(function (data) {
                res.status(201).json({
                  error: false,
                  message: "bulk e-waste saved successful!"
                });
              })["catch"](function (err) {
                _console["default"].log(err);

                res.status(401).send({
                  error: true,
                  message: "Failed to save bulk e-waste"
                });
              });
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function excel_bulk_ewaste(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.excel_bulk_ewaste = excel_bulk_ewaste;

var fetch_ewaste_by_user = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged, total_ewaste_pickedup;
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
              user_id: req.params.id
            }).exec();

          case 7:
            total_ewaste_logged = _context3.sent;
            _context3.next = 10;
            return _EwasteModel["default"].countDocuments({
              user_id: req.params.id,
              pickedup: true
            }).exec();

          case 10:
            total_ewaste_pickedup = _context3.sent;
            _context3.t0 = endIndex;
            _context3.next = 14;
            return _EwasteModel["default"].countDocuments({
              user_id: req.params.id
            }).exec();

          case 14:
            _context3.t1 = _context3.sent;

            if (!(_context3.t0 < _context3.t1)) {
              _context3.next = 17;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 17:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _EwasteModel["default"].find({
              user_id: req.params.id
            }).populate('category_id').populate('sub_category_id').populate('user_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, waste) {
              // console.log("ewasteeeeeeeeeeeeeeeee", waste)
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch user logged ewaste"
                });
              }

              var waste_weight = waste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              return res.json({
                error: false,
                status: 201,
                total_ewaste_pickedup: total_ewaste_pickedup,
                total_logged_ewaste: total_ewaste_logged,
                total_weight_logged: waste_weight,
                pagination: results,
                ewaste: waste,
                message: "Fetch all logged ewaste successful!"
              });
            });

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetch_ewaste_by_user(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetch_ewaste_by_user = fetch_ewaste_by_user;

var update_logged_ewaste = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!req.body.category_id || // (!req.body.category_name) ||
            !req.body.price || !req.body.unit || !req.body.sub_category_id || // (!req.body.sub_category_name) ||
            !req.body.quantity || !req.body.weight // (!req.body.user_id)
            )) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", res.status(401).send({
              error: true,
              message: "Category_id, price, unit, type, quantity, weight and are required"
            }));

          case 2:
            _EwasteModel["default"].findById(req.params.id, function (err, ewaste) {
              if (err) {
                _console["default"].log(err);
              } // if (log.paid === true) {
              // return res.status(401).send({error: true, message: "you can not update this log"});
              // }


              if (ewaste.pickedup === true) {
                // return next(new Error('Could not find logged eqiupment'));
                return res.status(404).send({
                  error: true,
                  message: "You can not update this ewaste, it has been picked up"
                });
              }

              if (!ewaste) {
                // return next(new Error('Could not find logged eqiupment'));
                return res.status(404).send({
                  error: true,
                  message: "Could not find logged ewaste"
                });
              } else {
                _CategoryTypesModel["default"].findById({
                  _id: req.body.sub_category_id
                }).exec(function (err, type) {
                  if (err) {
                    _console["default"].log(err);

                    return res.json({
                      error: true,
                      status: 401,
                      message: "Failed fetch types"
                    });
                  }

                  if (req.body.price != type.price) {
                    return res.json({
                      error: true,
                      status: 401,
                      message: "The type price does not match"
                    });
                  } // res.json({error: false, status: 201, requests: type, message: "fetch all types successful!" });


                  var total = type.price * req.body.quantity * req.body.weight; // });

                  ewaste.category_id = req.body.category_id, // ewaste.category_name = req.body.category_name,
                  ewaste.price = type.price, ewaste.total = total, ewaste.unit = unit, ewaste.sub_category_id = req.body.sub_category_id, // ewaste.sub_category_name = req.body.sub_category_name,
                  ewaste.quantity = req.body.quantity, ewaste.weight = req.body.weight, // log.user_id = req.body.user_id,
                  // log.equipment_pin = pin,
                  ewaste.updated_at = Date.now(); // user.body.user = req.body;

                  ewaste.save().then(function (result) {
                    res.status(201).json({
                      log: result,
                      error: false,
                      message: "Ewaste update successful"
                    }); // res.json({ 'log': result });
                    //res.status(200).send({mssage: 'update successful'});
                  })["catch"](function (err) {
                    _console["default"].log(err);

                    res.send({
                      error: true,
                      message: 'failed to update ewaste'
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function update_logged_ewaste(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.update_logged_ewaste = update_logged_ewaste;

var remove_log_ewaste = function remove_log_ewaste(req, res) {
  _EwasteModel["default"].findByIdAndRemove({
    _id: req.params.id
  }).exec(function (err, ewaste) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "failed to delete waste"
      }); // res.json(err);
    }

    if (ewaste.pickedup === true) {
      return res.status(404).send({
        error: true,
        message: "you can not delete this e-waste, it has been picked up"
      });
    }

    if (!ewaste) {
      return res.status(404).send({
        error: true,
        message: "e-waste not found"
      });
    }

    return res.status(401).send({
      error: true,
      message: "e-waste has been deleted succuesfuly"
    });
  });
};

exports.remove_log_ewaste = remove_log_ewaste;

var accept_request_pickup = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _RequestPickupModel["default"].findById({
              _id: req.body.id,
              accept_request: false
            }).exec(function (err, pickup) {
              if (err) {
                // console.log("errrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Error oocured"
                });
              }

              if (!pickup) {
                return res.status(404).send({
                  error: true,
                  message: "pickup request not found"
                });
              } else {
                if (pickup.accept_request === false) {
                  pickup.accept_request = true;
                  pickup.accepted_by = req.body.user_id;
                  pickup.save().then(function (result) {
                    return res.status(200).send({
                      error: false,
                      message: "Pickup has been accepted by you succuesfuly"
                    });
                  })["catch"](function (err) {
                    // console.log(err.code);
                    res.send({
                      error: true,
                      message: 'failed to accept pickup'
                    });
                  });
                } else {
                  return res.json({
                    error: true,
                    status: 401,
                    message: "Pickup has already been picked"
                  });
                }
              }
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function accept_request_pickup(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.accept_request_pickup = accept_request_pickup;

var update_ewaste_to_ready_pickup = function update_ewaste_to_ready_pickup(req, res) {
  _EwasteModel["default"].findById({
    _id: req.body.id,
    user_id: req.body.user_id
  }).exec(function (err, waste) {
    if (err) {
      // console.log("errrrrrrrrrrrr", err);
      return res.json({
        error: true,
        status: 401,
        message: "Error oocured"
      });
    }

    if (waste.user_id != req.body.user_id) {
      return res.status(404).send({
        error: true,
        message: "collection center not found"
      });
    }

    if (!waste) {
      return res.status(404).send({
        error: true,
        message: "pickup request not found"
      });
    } else {
      if (waste.ready_pickup === false) {
        waste.ready_pickup = true;
        waste.save().then(function (result) {
          return res.status(200).send((0, _defineProperty2["default"])({
            error: false,
            code: 200,
            message: 'success'
          }, "message", "e-waste ready for pick up"));
        })["catch"](function (err) {
          // console.log(err.code);
          res.send({
            error: true,
            message: 'failed to update e-waste'
          });
        });
      } else {
        return res.json({
          error: true,
          status: 401,
          message: "e-waste already set for pick up"
        });
      }
    }
  });
};

exports.update_ewaste_to_ready_pickup = update_ewaste_to_ready_pickup;

var mark_pickup_as_completed = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _RequestPickupModel["default"].findById({
              _id: req.body.id
            }).exec(function (err, pickup) {
              if (err) {
                // console.log("errrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Error oocured"
                });
              }

              if (!pickup) {
                return res.status(404).send({
                  error: true,
                  message: "pickup request not found"
                });
              }

              if (pickup.accepted_by === req.body.user_id) {
                return res.status(401).send({
                  error: true,
                  message: "you did not accept this pickup"
                });
              }

              if (pickup.completed === true) {
                return res.status(401).send({
                  error: true,
                  message: "pickup already marked as completed"
                });
              } else {
                // && pickup.completed != true
                if (pickup.accept_request === true) {
                  pickup.completed = true;
                  pickup.save().then(function (result) {
                    return res.status(200).send({
                      error: false,
                      message: "Pickup has been completed by you succuesfuly"
                    });
                  })["catch"](function (err) {
                    // console.log(err.code);
                    res.send({
                      error: true,
                      message: 'failed to mark as completed'
                    });
                  });
                } else {
                  return res.json({
                    error: true,
                    status: 401,
                    message: "Pickup has not been accepted by you"
                  });
                }
              }
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function mark_pickup_as_completed(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}(); // export const new_sub_cateory = (req, res) => {
//     console.log("reqquests", req.body);
//     if ((!req.body.name) || (!req.body.category_id) || (!req.body.price)) {
//         // console.log("All not filled");
//         return res.status(401).send({error: true, message: "Name and category id are required"});
//     } 
//     let types = new Types({
//         name: req.body.name,
//         price: req.body.price,
//         category_id: req.body.category_id,
//         created_at: Date.now(),
//         updated_at: Date.now()
//     });
//     Types.findOne({ name: req.body.name }).exec((err, doc, next) => {
//         if (err) {
//             return res.status(401).send({error: true, code: 401, message: "An error occcured"});
//         }
//         if (doc) {
//             return res.send({error: true, message: 'type category name already exists.'});
//         }
//         let id = types.category_id;
//         types.save().then(result => {
//             console.log("Type reusult:", result);
//             Category.findById(id).then((docs) => {
//                 if(!docs) {
//                     return res.status(404).send();
//                 }
//                 docs.types.push(result);
//                 docs.save();
//                 return res.json({error: false, code: 201, status: 'success', message: 'type category created successfuly', type: result });
//             }).catch((e) => {
//                 return res.send(e).status(404);
//             })
//             // return res.json({error: false, code: 201, status: 'success', message: 'sub category created successfuly', type: result });
//             // res.status(200).send({mssage: 'Category created successful'});
//         }).catch(err => {
//             console.log(err);
//             return res.send({ error: true, message: 'failed to add data' });
//         });
//     })
// }


exports.mark_pickup_as_completed = mark_pickup_as_completed;
//# sourceMappingURL=collection.controllers.js.map