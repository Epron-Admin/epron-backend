"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_sub_category = exports.update_category = exports.unblock_user = exports.search_user_varibles = exports.search_requestedPickups_by_date_range = exports.search_recyclerEwaste_by_date_range = exports.search_logged_equipment_with_varibles = exports.search_ewaste_by_date_range = exports.remove_unverified_user = exports.remove_recycler_to_collection_center = exports.remove_log_type = exports.remove_log_category = exports.remove_collection_center_recycler_user = exports.reg_user_erpon = exports.new_sub_cateory = exports.new_category = exports.find_user_by_specific_date = exports.find_user_by_date_range = exports.find_equipment_by_date_range = exports.find_all_user_based_on_verified_status = exports.find_all_collection_center = exports.fetch_users_loged_equiptment_oem = exports.fetch_user_loged_equiptment_paid_status_oem = exports.fetch_recyclers_with_colection_center = exports.fetch_logewaste_weight_by_recyclers_id = exports.fetch_logewaste_weight_by_recyclers = exports.fetch_collection_center_byId = exports.fetch_all_users = exports.fetch_all_sub_categories_by_categoryid = exports.fetch_all_sub_categories = exports.fetch_all_pickups_accepted = exports.fetch_all_pickup_based_on_acceptance = exports.fetch_all_loged_ewaste = exports.fetch_all_categories = exports.fetch_all_admin_users = exports.disapprove_documents_oem = exports.dashboard_counts = exports.block_user = exports.asign_collection_center_to_recyclers = exports.approved_documents_oem = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _CategoryModel = _interopRequireDefault(require("../../models/Category.model.js"));

var _CategoryTypesModel = _interopRequireDefault(require("../../models/CategoryTypes.model.js"));

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

var _EwasteModel = _interopRequireDefault(require("../../models/Ewaste.model.js"));

var _console = _interopRequireDefault(require("console"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _crypto = _interopRequireDefault(require("crypto"));

var _async = _interopRequireDefault(require("async"));

var _RequestPickupModel = _interopRequireDefault(require("../../models/RequestPickup.model.js"));

var _RecyclerWasteModel = _interopRequireDefault(require("../../models/RecyclerWaste.model.js"));

var _LogModel = _interopRequireDefault(require("../../models/Log.model.js"));

// import Collection from '../../models/CollectionCenter.model.js';
// import querystring from 'querystring';
// const querystring = require('querystring');
// import Fake from '../../models/FakeUser.model.js'; // remove this import
// var logged_eqiupment_weight;
var bigshit;

var new_category = function new_category(req, res) {
  if (!req.body.name) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name is required"
    });
  }

  var code = Math.random().toString(36).slice(2, 7);
  var category = new _CategoryModel["default"]({
    name: req.body.name,
    category_code: code,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  _CategoryModel["default"].findOne({
    name: req.body.name
  }).exec(function (err, doc, next) {
    if (err) {
      return res.status(401).send({
        error: true,
        code: 401,
        message: "An error occcured"
      });
    }

    if (doc) {
      return res.send({
        error: true,
        message: 'Category already exists.'
      });
    }

    category.save().then(function (result) {
      res.json({
        error: false,
        code: 201,
        status: 'success',
        message: 'category created successfuly',
        'category': result
      }); // res.status(200).send({mssage: 'Category created successful'});
    })["catch"](function (err) {
      _console["default"].log(err.code);

      res.send({
        error: true,
        message: 'failed to add data'
      });
    });
  });
};

exports.new_category = new_category;

var fetch_all_categories = function fetch_all_categories(req, res) {
  _CategoryModel["default"].find({}).exec(function (err, category) {
    if (err) {
      _console["default"].log(err);

      return res.send({
        error: true,
        code: 401,
        message: "Failed to fetch all categories"
      }); // return res.send(err);
    }

    return res.json({
      error: false,
      code: 201,
      status: 'success',
      message: 'fetch all categories',
      categories: category
    }); // res.send(category);

    _console["default"].log(category);
  });
};

exports.fetch_all_categories = fetch_all_categories;

var update_category = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.body.name) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              error: true,
              message: "Name is required"
            }));

          case 2:
            _CategoryModel["default"].findById(req.params.id, function (err, category) {
              if (err) {
                _console["default"].log(err);
              }

              if (!category) {
                return res.status(404).send({
                  error: true,
                  message: "Could not find category"
                });
              } else {
                category.name = req.body.name, category.updated_at = Date.now();
                category.save().then(function (result) {
                  res.status(201).json({
                    category: result,
                    error: false,
                    message: "Category update successful"
                  }); // res.json({ 'log': result });
                  //res.status(200).send({mssage: 'update successful'});
                })["catch"](function (err) {
                  _console["default"].log(err);

                  res.send({
                    error: true,
                    message: 'failed to update logged equipment'
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

  return function update_category(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.update_category = update_category;

var new_sub_cateory = function new_sub_cateory(req, res) {
  //  console.log("reqquests", req.body);
  if (!req.body.name || !req.body.category_id || !req.body.price) {
    return res.status(401).send({
      error: true,
      message: "Name and category id are required"
    });
  }

  var code = Math.random().toString(36).slice(2, 7);
  var types = new _CategoryTypesModel["default"]({
    name: req.body.name,
    price: req.body.price,
    type_code: code,
    category_id: req.body.category_id,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  _CategoryTypesModel["default"].findOne({
    name: req.body.name
  }).exec(function (err, doc, next) {
    if (err) {
      return res.status(401).send({
        error: true,
        code: 401,
        message: "An error occcured"
      });
    }

    if (doc) {
      return res.send({
        error: true,
        message: 'sub category name already exists.'
      });
    } // let id = types.category_id;


    types.save().then(function (result) {
      return res.json({
        error: false,
        code: 201,
        status: 'success',
        message: 'type category created successfuly',
        type: result
      });
    })["catch"](function (err) {
      _console["default"].log(err);

      return res.send({
        error: true,
        message: 'failed to add data'
      });
    });
  });
};

exports.new_sub_cateory = new_sub_cateory;

var fetch_all_sub_categories = function fetch_all_sub_categories(req, res) {
  _CategoryTypesModel["default"].find({}).exec(function (err, types) {
    if (err) {
      _console["default"].log(err);

      return res.send({
        error: true,
        code: 401,
        message: "Failed to fetch all types"
      }); // return res.send(err);
    }

    return res.json({
      error: false,
      code: 201,
      status: 'success',
      message: 'fetch all categories',
      types: types
    }); // res.send(category);
  });
};

exports.fetch_all_sub_categories = fetch_all_sub_categories;

var fetch_all_sub_categories_by_categoryid = function fetch_all_sub_categories_by_categoryid(req, res) {
  _CategoryTypesModel["default"].find({
    category_id: req.params.id
  }).exec(function (err, types) {
    if (err) {
      _console["default"].log(err);

      return res.send({
        error: true,
        code: 401,
        message: "Failed to fetch all types based on category"
      }); // return res.send(err);
    }

    return res.json({
      error: false,
      code: 201,
      status: 'success',
      message: 'fetch all types based on category',
      types: types
    }); // res.send(category);
  });
}; // export const fetch_sub_categories = (req, res) => {
//     Types.findById(req.params.id).populate('category').exec((err, types) => {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         res.send(types);
//     });
// }


exports.fetch_all_sub_categories_by_categoryid = fetch_all_sub_categories_by_categoryid;

var update_sub_category = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!req.body.name || !req.body.category_id || !req.body.price)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", res.status(401).send({
              error: true,
              message: "Name and category id are required"
            }));

          case 2:
            _CategoryTypesModel["default"].findById(req.params.id, function (err, types) {
              if (err) {
                _console["default"].log(err);
              }

              if (!types) {
                return res.status(404).send({
                  error: true,
                  message: "Could not find sub category"
                });
              } else {
                _CategoryTypesModel["default"].findOne({
                  name: req.body.name
                }).exec(function (err, doc, next) {
                  if (err) {
                    return res.status(401).send({
                      error: true,
                      code: 401,
                      message: "An error occcured"
                    });
                  }

                  if (doc) {
                    return res.send({
                      error: true,
                      message: 'sub category name already exists.'
                    });
                  }

                  types.name = req.body.name, types.price = req.body.price, types.category_id = req.body.category_id, types.updated_at = Date.now();
                  types.save().then(function (result) {
                    res.status(201).json({
                      sub_category: result,
                      error: false,
                      message: "Sub category update successful"
                    }); // res.json({ 'log': result });
                    //res.status(200).send({mssage: 'update successful'});
                  })["catch"](function (err) {
                    _console["default"].log(err);

                    res.send({
                      error: true,
                      message: 'failed to update sub category'
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function update_sub_category(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.update_sub_category = update_sub_category;

var remove_log_category = function remove_log_category(req, res) {
  _CategoryModel["default"].findByIdAndRemove({
    _id: req.params.id
  }, function (err, log) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "failed to delete category"
      });
    }

    if (!log) {
      return res.json({
        error: true,
        status: 404,
        message: "can not find category"
      });
    } else {
      _CategoryTypesModel["default"].deleteMany({
        category_id: req.params.id
      }).exec(function (err, doc, next) {
        if (doc) {
          return res.send({
            error: true,
            message: 'success!',
            info: 'the deleted category has a sub category which has been deleted too'
          });
        } else {
          return res.json({
            error: false,
            status: 201,
            message: "success!"
          });
        }
      });
    }
  });
};

exports.remove_log_category = remove_log_category;

var remove_unverified_user = function remove_unverified_user(req, res) {
  _UserModel["default"].findByIdAndRemove({
    _id: req.params.id,
    verified: false
  }, function (err, user) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "failed to delete category"
      });
    }

    if (!user) {
      return res.json({
        error: true,
        status: 404,
        message: "can not find user"
      });
    }

    if (user.verified === true) {
      return res.json({
        error: true,
        status: 404,
        message: "this user is already verified"
      });
    } else {
      return res.json({
        error: false,
        status: 201,
        message: "user removed"
      });
    }
  });
};

exports.remove_unverified_user = remove_unverified_user;

var remove_log_type = function remove_log_type(req, res) {
  _CategoryTypesModel["default"].findByIdAndRemove({
    _id: req.params.id
  }, function (err, type) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "failed to delete category type"
      });
    }

    if (!type) {
      return res.json({
        error: true,
        status: 404,
        message: "can not find sub category"
      });
    } else {
      return res.json({
        error: false,
        status: 201,
        message: "success!"
      });
    }
  });
};

exports.remove_log_type = remove_log_type;

var fetch_all_users = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var page, limit, startIndex, endIndex, results, total_users, total_verified_users, total_blocked_users;
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
            return _UserModel["default"].countDocuments().exec();

          case 7:
            total_users = _context3.sent;
            _context3.next = 10;
            return _UserModel["default"].countDocuments({
              verified: true
            }).exec();

          case 10:
            total_verified_users = _context3.sent;
            _context3.next = 13;
            return _UserModel["default"].countDocuments({
              blocked: true
            }).exec();

          case 13:
            total_blocked_users = _context3.sent;
            _context3.t0 = endIndex;
            _context3.next = 17;
            return _UserModel["default"].countDocuments().exec();

          case 17:
            _context3.t1 = _context3.sent;

            if (!(_context3.t0 < _context3.t1)) {
              _context3.next = 20;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 20:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _UserModel["default"].find({}).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, users, next) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch users"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_users: total_users,
                verified_users: total_verified_users,
                blocked_users: total_blocked_users,
                pagination: results,
                users: users,
                message: "Fetch all users successful!"
              });
            });

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetch_all_users(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetch_all_users = fetch_all_users;

var reg_user_erpon = function reg_user_erpon(req, res, next) {
  if (!req.body.name || !req.body.email || !req.body.phoneNumber || !req.body.password || !req.body.epron_admin) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name, email, phone, epron_admin and role password are required"
    });
  }

  var user = new _UserModel["default"]({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    epron_admin: req.body.epron_admin,
    password: _UserModel["default"].hashPassword(req.body.password),
    // image_url: req.body.image_url,
    role: 'epron',
    created_at: Date.now(),
    updated_at: Date.now()
  });

  _UserModel["default"].findOne({
    email: req.body.email
  }).exec(function (err, doc, next) {
    // let userEmail = req.body.email;
    if (err) {
      return res.status(401).send({
        error: true,
        code: 401,
        message: "An error occcured"
      });
    }

    if (doc) {
      return res.status(401).send({
        error: true,
        message: "Email already exists"
      });
    }

    user.save().then(function (dataRes) {
      // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
      _async["default"].waterfall([function (done) {
        _crypto["default"].randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      }, function (token, done) {
        // User.findOne({email: req.body.email}).exec
        _UserModel["default"].findOne({
          email: req.body.email
        }, function (err, user) {
          // userEmail = req.body.email;
          // console.log('email', userEmail);
          if (!user) {
            // req.flash('error', 'No account with that email address exists.');
            // return next(new Error('No account with that email address exists.'));
            return res.send({
              error: true,
              message: 'Email address does not exists.'
            });
          }

          user.verifyToken = token;
          user.verifyTokenExpires = Date.now() + 3600000;
          user.save(function (err) {
            done(err, token, user);
          });
        });
      }, function (token, user, done) {
        var mailTransporter = _nodemailer["default"].createTransport({
          service: 'gmail',
          auth: {
            user: 'epronnigeria@gmail.com',
            pass: 'xwytgfmmdpdnbajp'
          }
        });

        var mailDetails = {
          from: 'Epron Admin <epronnigeria@gmail.com>',
          to: req.body.email,
          subject: 'Epron Registration',
          text: 'You are receiving this because Epron have requested to sign you up as admin on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://blackbox.epron.org.ng/verify/' + token + '\n\n' + 'If you did not request this, please ignore this email and your registration will be canceled.\n\n' + ' Your password is ' + req.body.password + ' you can change it at anytime for privacy.'
        };
        mailTransporter.sendMail(mailDetails, function (err, data) {
          // console.log("Dattttttttttttaaaaaaaa", data);
          if (err) {
            // console.log('Error Occurs', err);
            return res.send({
              error: true,
              code: 401,
              message: "Failed to add new unverified user"
            });
          } else {
            // console.log('Email sent successfully');
            return res.json({
              error: false,
              code: 201,
              status: 'success',
              message: 'Token sent to your email'
            });
          }
        });
      }])["catch"](function (err) {
        _console["default"].log(err);

        return res.send({
          err: err
        });
      });
    })["catch"](function (err) {
      // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
      return res.send({
        error: true,
        code: 401,
        message: "Failed to add new epron admin user"
      });
    });
  });
};

exports.reg_user_erpon = reg_user_erpon;

var fetch_users_loged_equiptment_oem = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var page, limit, startIndex, endIndex, results, total_equipment_logged, total_number_paid;
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
            return _LogModel["default"].countDocuments({}).exec();

          case 7:
            total_equipment_logged = _context4.sent;
            _context4.next = 10;
            return _LogModel["default"].countDocuments({
              paid: true
            }).exec();

          case 10:
            total_number_paid = _context4.sent;
            _context4.t0 = endIndex;
            _context4.next = 14;
            return _LogModel["default"].countDocuments().exec();

          case 14:
            _context4.t1 = _context4.sent;

            if (!(_context4.t0 < _context4.t1)) {
              _context4.next = 17;
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

            _LogModel["default"].find({}).populate('category_id').populate('sub_category_id').populate('user_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
              if (err) {
                // console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch user logged equipment"
                });
              }

              if (!equipment) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Log equipent does not exist!"
                });
              }

              var log_weight = equipment.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              var value = equipment.filter(function (result) {
                return result.paid === true;
              });
              var total_payment_made = value.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.total;
              }, 0);
              var value2 = equipment.filter(function (result) {
                return result.paid === false;
              });
              var total_unpaid = value2.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.total;
              }, 0); // const amount_unpaid = 

              var number_of_unpaid = total_equipment_logged - total_number_paid;
              return res.json({
                error: false,
                status: 201,
                total_logged_equipment_paid: total_number_paid,
                unpaid_log_number: number_of_unpaid,
                total_payment_made: total_payment_made,
                unpaid_payment: total_unpaid,
                total_logged_eqiupment: total_equipment_logged,
                total_weight_logged: log_weight,
                pagination: results,
                log: equipment,
                message: "Fetch all logged equipments successful!"
              });
            });

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetch_users_loged_equiptment_oem(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.fetch_users_loged_equiptment_oem = fetch_users_loged_equiptment_oem;

var fetch_user_loged_equiptment_paid_status_oem = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var page, limit, startIndex, endIndex, results, total_equipment_logged;
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
            return _LogModel["default"].countDocuments({
              paid: req.query.paid
            }).exec();

          case 7:
            total_equipment_logged = _context5.sent;
            _context5.t0 = endIndex;
            _context5.next = 11;
            return _LogModel["default"].countDocuments().exec();

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

            _LogModel["default"].find({
              paid: req.query.paid
            }).populate('category_id').populate('sub_category_id').populate('user_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
              if (err) {
                // console.log(err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch user logged equipment"
                });
              }

              if (!equipment) {
                // console.log(err);
                return res.json({
                  error: true,
                  status: 404,
                  message: "user logged equipment not found"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_logged_eqiupment: total_equipment_logged,
                pagination: results,
                log: equipment,
                message: "success"
              });
            });

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function fetch_user_loged_equiptment_paid_status_oem(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.fetch_user_loged_equiptment_paid_status_oem = fetch_user_loged_equiptment_paid_status_oem;

var fetch_all_admin_users = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var page, limit, startIndex, endIndex, results, total_users, total_blocked_users;
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
            return _UserModel["default"].countDocuments({
              role: 'epron'
            }).exec();

          case 7:
            total_users = _context6.sent;
            _context6.next = 10;
            return _UserModel["default"].countDocuments({
              blocked: true,
              role: 'epron'
            }).exec();

          case 10:
            total_blocked_users = _context6.sent;
            _context6.t0 = endIndex;
            _context6.next = 14;
            return _UserModel["default"].countDocuments().exec();

          case 14:
            _context6.t1 = _context6.sent;

            if (!(_context6.t0 < _context6.t1)) {
              _context6.next = 17;
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

            _UserModel["default"].find({
              role: 'epron'
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, users, next) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch users"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_users: total_users,
                blocked_users: total_blocked_users,
                pagination: results,
                users: users,
                message: "Fetch all users successful!"
              });
            });

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetch_all_admin_users(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fetch_all_admin_users = fetch_all_admin_users;

var block_user = function block_user(req, res) {
  _UserModel["default"].findById({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send({
        code: 505,
        error: true,
        err: err,
        message: 'error occured'
      }); // console.log(err);
    }

    if (user.blocked === true) {
      res.send({
        code: 401,
        error: true,
        message: 'User is alraedy blocked'
      });
    }

    if (!user) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find user'
      });
    } // return next(new Error('Could not load document'));
    else {
      user.blocked = true, user.updated_at = Date.now();
      user.save().then(function (result) {
        res.json({
          error: false,
          code: 200,
          status: 'success',
          message: 'user has been blocked'
        }); //res.status(200).send({mssage: 'update successful'});
      })["catch"](function (err) {
        // console.log(err.code);
        res.send({
          error: true,
          message: 'failed to block user'
        });
      });
    }
  });
};

exports.block_user = block_user;

var unblock_user = function unblock_user(req, res) {
  _UserModel["default"].findById({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.send({
        code: 505,
        error: true,
        err: err,
        message: 'error occured'
      }); // console.log(err);
    }

    if (user.blocked === false) {
      res.send({
        code: 401,
        error: true,
        message: 'User is alraedy unblocked'
      });
    }

    if (!user) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find user'
      });
    } // return next(new Error('Could not load document'));
    else {
      user.blocked = false, user.updated_at = Date.now();
      user.save().then(function (result) {
        res.json({
          error: false,
          code: 200,
          status: 'success',
          message: 'user has been unblocked'
        }); //res.status(200).send({mssage: 'update successful'});
      })["catch"](function (err) {
        // console.log(err.code);
        res.send({
          error: true,
          message: 'failed to unblock user'
        });
      });
    }
  });
};

exports.unblock_user = unblock_user;

var fetch_all_loged_ewaste = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste, total_pickedup, total_unpickedup, total_ready_for_pickup, total_not_ready_for_pickup;
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
            return _EwasteModel["default"].countDocuments({}).exec();

          case 7:
            total_ewaste = _context7.sent;
            _context7.next = 10;
            return _EwasteModel["default"].countDocuments({
              pickedup: true
            }).exec();

          case 10:
            total_pickedup = _context7.sent;
            _context7.next = 13;
            return _EwasteModel["default"].countDocuments({
              pickedup: false
            }).exec();

          case 13:
            total_unpickedup = _context7.sent;
            _context7.next = 16;
            return _EwasteModel["default"].countDocuments({
              ready_pickup: true
            }).exec();

          case 16:
            total_ready_for_pickup = _context7.sent;
            _context7.next = 19;
            return _EwasteModel["default"].countDocuments({
              ready_pickup: false
            }).exec();

          case 19:
            total_not_ready_for_pickup = _context7.sent;
            _context7.t0 = endIndex;
            _context7.next = 23;
            return _EwasteModel["default"].countDocuments().exec();

          case 23:
            _context7.t1 = _context7.sent;

            if (!(_context7.t0 < _context7.t1)) {
              _context7.next = 26;
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

            _EwasteModel["default"].find({}).sort('-created_at').populate('category_id').populate('sub_category_id').populate('user_id').limit(limit).skip(startIndex).exec(function (err, ewaste, next) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!ewaste) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 404,
                  message: "e-waste not found"
                });
              } else {
                var total_ewaste_weight = ewaste.reduce(function (previousValue, currentValue) {
                  return previousValue + currentValue.weight;
                }, 0);
                return res.json({
                  error: false,
                  status: 201,
                  pagination: results,
                  total_ewaste: total_ewaste,
                  total_ready_for_pickup: total_ready_for_pickup,
                  total_not_ready_for_pickup: total_not_ready_for_pickup,
                  total_ewaste_weight: total_ewaste_weight,
                  total_unpickedup: total_unpickedup,
                  total_pickedup: total_pickedup,
                  ewaste: ewaste,
                  message: "Fetch all logged ewaste successful!"
                });
              }
            });

          case 28:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function fetch_all_loged_ewaste(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}(); // export const asign_recycler_to_collection_center = (req, res) => {
//     //  the user_id is the id of the user which is a collection center or collector while signing up
//     Collection.findOne({user_id: req.body.collector_user_id}).exec((err, center) => {
//         if (
//             (!req.body.collector_user_id)
//             (!req.body.recycler_user_id)
//         ) {
//             return res.status(401).send({error: true, message: "Collection center ID, and recycler ID are required"});
//         }
//         if (err) {
//             return res.json({error: true, status: 401, message: "An error occured"})
//         }
//         if (!center) {
//             res.send({code: 404, error: true, message: 'Can not find collection center' });
//         }
//         // if (center.role != 'recycler') {
//         //     res.send({code: 404, error: true, message: 'user not a recycler' });
//         // }
//         else {
//             // the recycler id id the id of the user who is a recycler in this case.
//             const index = center.recyclers.includes(req.body.recycler_user_id);
//             console.log("index", index);
//             if (index === false) {
//                 center.recyclers.push(req.body.recycler_user_id);
//                 center.save().then(result => {
//                     res.json({ error: false, code: 200, status: 'success', message: 'user has been asigned to collection center'});
//                 }).catch(err => {
//                     // console.log(err.code);
//                     res.send({ error: true, message: 'failed to asign user to collection' });
//                 });
//             } else {
//                 res.send({ error: true, message: 'user already asigned to this collection center' });
//             }
//         }
//     })
// }


exports.fetch_all_loged_ewaste = fetch_all_loged_ewaste;

var remove_recycler_to_collection_center = function remove_recycler_to_collection_center(req, res) {
  //  the user_id is the id of the user which is a collection center or collector while signing up
  Collection.findOne({
    user_id: req.body.collector_user_id
  }).exec(function (err, center) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!center) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find collection center'
      });
    } // if (center.role != 'recycler') {
    //     res.send({code: 404, error: true, message: 'user not a recycler' });
    // }
    else {
      _console["default"].log("centers", center); // the recycler id id the id of the user who is a recycler in this case.


      var index = center.recyclers.indexOf(req.body.recycler_user_id); // console.log("index", index);

      if (center.recyclers.length != 0) {
        center.recyclers.splice(index, 1);
        center.save().then(function (result) {
          res.json({
            error: false,
            code: 200,
            status: 'success',
            message: 'user has been removed from collection center'
          }); //res.status(200).send({mssage: 'update successful'});
        })["catch"](function (err) {
          // console.log(err.code);
          res.send({
            error: true,
            message: 'failed to remove  user'
          });
        });
      } else {
        res.send({
          error: true,
          code: 404,
          message: 'recyceler was not asined to this collection center'
        });
      }
    }
  });
}; // this function get a collection cecnter based on the user id and populate its recyclers.


exports.remove_recycler_to_collection_center = remove_recycler_to_collection_center;

var fetch_collection_center_byId = function fetch_collection_center_byId(req, res) {
  Collection.findById({
    _id: req.params.id
  }).populate('recyclers').exec(function (err, result) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!result) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find collection center'
      });
    } else {
      // console.log("result", result)
      res.json({
        error: false,
        code: 200,
        center: result,
        status: 'success',
        message: 'success!'
      });
    }
  });
};

exports.fetch_collection_center_byId = fetch_collection_center_byId;

var fetch_all_pickups_accepted = /*#__PURE__*/function () {
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
              accept_request: true
            }).populate('accepted_by').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestpickup) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed fetch request accepted pickups"
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

  return function fetch_all_pickups_accepted(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.fetch_all_pickups_accepted = fetch_all_pickups_accepted;

var find_all_collection_center = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var page, limit, startIndex, endIndex, results, total_centers;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context9.next = 7;
            return _UserModel["default"].countDocuments({
              role: 'collector'
            }).exec();

          case 7:
            total_centers = _context9.sent;
            _context9.t0 = endIndex;
            _context9.next = 11;
            return _UserModel["default"].countDocuments({
              role: 'collector'
            }).exec();

          case 11:
            _context9.t1 = _context9.sent;

            if (!(_context9.t0 < _context9.t1)) {
              _context9.next = 14;
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

            _UserModel["default"].find({
              role: 'collector'
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, user) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Error occured"
                });
              }

              if (!user) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 404,
                  message: "User not found"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total_users: total_centers,
                user: user,
                message: "successful!"
              });
            });

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function find_all_collection_center(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.find_all_collection_center = find_all_collection_center;

var fetch_all_pickup_based_on_acceptance = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var page, limit, startIndex, endIndex, results, total_pickups;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context10.next = 7;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: req.query.accepted
            }).exec();

          case 7:
            total_pickups = _context10.sent;
            _context10.t0 = endIndex;
            _context10.next = 11;
            return _RequestPickupModel["default"].countDocuments({
              accept_request: req.query.accepted
            }).exec();

          case 11:
            _context10.t1 = _context10.sent;

            if (!(_context10.t0 < _context10.t1)) {
              _context10.next = 14;
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
                _console["default"].log(err);

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
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function fetch_all_pickup_based_on_acceptance(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.fetch_all_pickup_based_on_acceptance = fetch_all_pickup_based_on_acceptance;

var find_all_user_based_on_verified_status = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var page, limit, startIndex, endIndex, results, total_users;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context11.next = 7;
            return _UserModel["default"].countDocuments({
              verified: req.query.verified
            }).exec();

          case 7:
            total_users = _context11.sent;
            _context11.t0 = endIndex;
            _context11.next = 11;
            return _UserModel["default"].countDocuments({
              role: 'collector'
            }).exec();

          case 11:
            _context11.t1 = _context11.sent;

            if (!(_context11.t0 < _context11.t1)) {
              _context11.next = 14;
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

            _UserModel["default"].find({
              verified: req.query.verified
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, user) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Error occured"
                });
              }

              if (!user) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 404,
                  message: "User not found"
                });
              }

              return res.json({
                error: false,
                status: 201,
                pagination: results,
                total_users: total_users,
                user: user,
                message: "successful!"
              });
            });

          case 16:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function find_all_user_based_on_verified_status(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

exports.find_all_user_based_on_verified_status = find_all_user_based_on_verified_status;

var fetch_logewaste_weight_by_recyclers = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context12.next = 7;
            return _RecyclerWasteModel["default"].countDocuments().exec();

          case 7:
            total_ewaste_logged = _context12.sent;
            _context12.t0 = endIndex;
            _context12.next = 11;
            return _RecyclerWasteModel["default"].countDocuments().exec();

          case 11:
            _context12.t1 = _context12.sent;

            if (!(_context12.t0 < _context12.t1)) {
              _context12.next = 14;
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

            _RecyclerWasteModel["default"].find().sort('-created_at').populate('collection_centerid').populate('recycler_id').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
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
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function fetch_logewaste_weight_by_recyclers(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

exports.fetch_logewaste_weight_by_recyclers = fetch_logewaste_weight_by_recyclers;

var fetch_logewaste_weight_by_recyclers_id = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var page, limit, startIndex, endIndex, results, total_ewaste_logged;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context13.next = 7;
            return _RecyclerWasteModel["default"].countDocuments({
              recycler_id: req.params.id
            }).exec();

          case 7:
            total_ewaste_logged = _context13.sent;
            _context13.t0 = endIndex;
            _context13.next = 11;
            return _RecyclerWasteModel["default"].countDocuments({
              recycler_id: req.params.id
            }).exec();

          case 11:
            _context13.t1 = _context13.sent;

            if (!(_context13.t0 < _context13.t1)) {
              _context13.next = 14;
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
              recycler_id: req.params.id
            }).sort('-created_at').populate('collection_centerid').populate('recycler_id').limit(limit).skip(startIndex).exec(function (err, ewaste) {
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
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
                message: "Fetch all logged ewaste by user successful!"
              });
            });

          case 16:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function fetch_logewaste_weight_by_recyclers_id(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

exports.fetch_logewaste_weight_by_recyclers_id = fetch_logewaste_weight_by_recyclers_id;

var asign_collection_center_to_recyclers = function asign_collection_center_to_recyclers(req, res) {
  //  the user_id is the id of the user which is a collection center or collector while signing up
  _UserModel["default"].findById({
    _id: req.body.recycler_id
  }).exec(function (err, user) {
    // console.log("user", user)
    if (!req.body.collection_center || !req.body.role || !req.body.recycler_id) {
      return res.status(401).send({
        error: true,
        message: "Collection center ID, Role and recycler ID are required"
      });
    }

    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!user) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find user'
      });
    }

    if (user.role != 'recycler') {
      res.send({
        code: 404,
        error: true,
        message: 'user not a recycler'
      });
    } else {
      // collection_center is the user id of which has a role of collector.
      _UserModel["default"].findById({
        _id: req.body.collection_center,
        role: 'collector'
      }).exec(function (err2, center) {
        // console.log("collection center", center);
        if (err2) {
          return res.json({
            error: true,
            status: 401,
            message: "An error occured in getting collection center"
          });
        }

        if (!center) {
          res.send({
            code: 404,
            error: true,
            message: 'Can not find collection center'
          });
        }

        if (center.collection_center_assigned === true) {
          res.send({
            code: 400,
            error: true,
            message: 'collection center already assigned to a recycler'
          });
        } else {
          center.collection_center_assigned = true;
          center.save().then(function (result) {
            var index = user.collection_center.includes(req.body.collection_center); // console.log("index", index);

            if (index === false) {
              user.collection_center.push(req.body.collection_center);
              user.save().then(function (result) {
                res.json({
                  error: false,
                  code: 200,
                  status: 'success',
                  message: 'collection center has been asigned to recycler'
                });
              })["catch"](function (err) {
                // console.log(err.code);
                res.send({
                  error: true,
                  message: 'failed to asign collection center'
                });
              });
            } else {
              res.send({
                error: true,
                message: 'collection center already asigned to this recycler'
              });
            }
          })["catch"](function (err) {
            // console.log(err.code);
            res.send({
              error: true,
              message: 'failed to asign collection center'
            });
          });
        }
      }); // const index = user.collection_center.includes(req.body.collection_center);
      // console.log("index", index);
      // if (index === false) {
      //     user.collection_center.push(req.body.collection_center);
      //     user.save().then(result => {
      //         res.json({ error: false, code: 200, status: 'success', message: 'collection center has been asigned to recycler'});
      //     }).catch(err => {
      //         // console.log(err.code);
      //         res.send({ error: true, message: 'failed to asign collection center' });
      //     });
      // } else {
      //     res.send({ error: true, message: 'collection center already asigned to this recycler' });
      // }

    }
  });
};

exports.asign_collection_center_to_recyclers = asign_collection_center_to_recyclers;

var remove_collection_center_recycler_user = function remove_collection_center_recycler_user(req, res) {
  if (!req.body.collection_center || !req.body.role || !req.body.recycler_id) {
    return res.status(401).send({
      error: true,
      message: "Collection center ID, role and recycler ID are required"
    });
  }

  _UserModel["default"].findById({
    _id: req.body.recycler_id
  }).exec(function (err, user) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!user) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find user'
      });
    }

    if (user.role != 'recycler') {
      res.send({
        code: 404,
        error: true,
        message: 'user not a recycler'
      });
    } else {
      _console["default"].log("centers", user); // the recycler id id the id of the user who is a recycler in this case.


      var index = user.collection_center.includes(req.body.recycler_id);

      _console["default"].log("index", index); // if (!user.collection_center.includes(req.body.recycler_id)) {


      if (user.collection_center.length != 0) {
        user.collection_center.splice(index, 1);
        user.save().then(function (result) {
          res.json({
            error: false,
            code: 200,
            status: 'success',
            message: 'collection center has been removed for this user'
          }); //res.status(200).send({mssage: 'update successful'});
        })["catch"](function (err) {
          // console.log(err.code);
          res.send({
            error: true,
            message: 'failed to asign Collection center'
          });
        });
      } else {
        res.send({
          error: true,
          code: 401,
          message: 'collection center was not asigned to this user'
        });
      }
    }
  });
};

exports.remove_collection_center_recycler_user = remove_collection_center_recycler_user;

var fetch_recyclers_with_colection_center = function fetch_recyclers_with_colection_center(req, res) {
  //  the user_id is the id of the user which is a collection center or collector while signing up
  if (!req.params.collection_center || !req.params.recycler_id) {
    return res.status(401).send({
      error: true,
      message: "Collection center ID and recycler ID are required"
    });
  }

  _UserModel["default"].findById({
    _id: req.params.recycler_id
  }).populate('collection_center').exec(function (err, user) {
    _console["default"].log("user", user);

    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!user) {
      res.send({
        code: 404,
        error: true,
        message: 'Can not find user'
      });
    }

    if (user.role != 'recycler') {
      res.send({
        code: 401,
        error: true,
        message: 'user not a recycler'
      });
    }

    if (user.collection_center.length <= 0) {
      res.send({
        error: true,
        message: 'user not asigned a collection center'
      });
    } else {
      res.send({
        error: true,
        data: user,
        message: 'success!'
      });
    }
  });
};

exports.fetch_recyclers_with_colection_center = fetch_recyclers_with_colection_center;

var approved_documents_oem = function approved_documents_oem(req, res) {
  _UserModel["default"].findById({
    _id: req.params.id,
    role: 'manufacturer'
  }).exec(function (err, user) {
    if (err) {
      return res.status(401).send({
        error: true,
        message: "Error occurred"
      });
    }

    if (!user) {
      return res.status(404).send({
        error: true,
        message: "User not found"
      });
    }

    if (user.approved_documents === true) {
      return res.status(401).send({
        error: true,
        message: "Documents already approved"
      });
    }

    user.approved_documents = true;
    user.save().then(function (result) {
      res.json({
        error: false,
        code: 200,
        status: 'success',
        message: 'documents approved'
      });
    })["catch"](function (err) {
      // console.log(err.code);
      res.send({
        error: true,
        err: err,
        message: 'server error, failed to approve document'
      });
    });
  });
};

exports.approved_documents_oem = approved_documents_oem;

var disapprove_documents_oem = function disapprove_documents_oem(req, res) {
  _UserModel["default"].findById({
    _id: req.params.id,
    role: 'manufacturer'
  }).exec(function (err, user) {
    if (err) {
      return res.status(401).send({
        error: true,
        message: "Error occurred"
      });
    }

    if (!user) {
      return res.status(404).send({
        error: true,
        message: "User not found"
      });
    }

    if (user.approved_documents === false) {
      return res.status(401).send({
        error: true,
        message: "No documents approved yet"
      });
    }

    user.approved_documents = false;
    user.save().then(function (result) {
      res.json({
        error: false,
        code: 200,
        status: 'success',
        message: 'documents approval reversed'
      });
    })["catch"](function (err) {
      // console.log(err.code);
      res.send({
        error: true,
        err: err,
        message: 'server error, failed to disapprove document'
      });
    });
  });
};

exports.disapprove_documents_oem = disapprove_documents_oem;

var dashboard_counts = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _LogModel["default"].find({}).exec(function (err, equipment) {
              if (err) {
                return res.status(401).send({
                  error: true,
                  message: "Error occurred while feching manufacturer logged equipment"
                });
              }

              var logged_eqiupment_weight = equipment.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
              }, 0);
              var paid = equipment.filter(function (el) {
                return el.paid === true;
              });
              var total_payment_reciceved = paid.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.total;
              }, 0);

              _EwasteModel["default"].find({}).exec(function (err, waste, next) {
                if (err) {
                  return res.status(401).send({
                    error: true,
                    message: "Error occurred while feching collection center logged ewaste"
                  });
                }

                var logged_collection_center_waste_weight = waste.reduce(function (previousValue, currentValue) {
                  return previousValue + currentValue.weight;
                }, 0);

                _RecyclerWasteModel["default"].find({}).exec( /*#__PURE__*/function () {
                  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(err, recycler_waste) {
                    var logged_recycler_waste_weight, recyclers, manufacturers, collectors, admin, unverified_recyclers, unverified_manufacturers, unverified_collectors, toal_requested_pickups, data;
                    return _regenerator["default"].wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            if (!err) {
                              _context14.next = 2;
                              break;
                            }

                            return _context14.abrupt("return", res.status(401).send({
                              error: true,
                              message: "Error occurred while feching reycler logged ewaste"
                            }));

                          case 2:
                            logged_recycler_waste_weight = recycler_waste.reduce(function (previousValue, currentValue) {
                              return previousValue + currentValue.weight;
                            }, 0); // verified

                            _context14.next = 5;
                            return _UserModel["default"].countDocuments({
                              role: 'recycler',
                              verified: true
                            }).exec();

                          case 5:
                            recyclers = _context14.sent;
                            _context14.next = 8;
                            return _UserModel["default"].countDocuments({
                              role: 'manufacturer',
                              verified: true
                            }).exec();

                          case 8:
                            manufacturers = _context14.sent;
                            _context14.next = 11;
                            return _UserModel["default"].countDocuments({
                              role: 'collector',
                              verified: true
                            }).exec();

                          case 11:
                            collectors = _context14.sent;
                            _context14.next = 14;
                            return _UserModel["default"].countDocuments({
                              role: 'admin'
                            }).exec();

                          case 14:
                            admin = _context14.sent;
                            _context14.next = 17;
                            return _UserModel["default"].countDocuments({
                              role: 'recycler',
                              verified: false
                            }).exec();

                          case 17:
                            unverified_recyclers = _context14.sent;
                            _context14.next = 20;
                            return _UserModel["default"].countDocuments({
                              role: 'manufacturer',
                              verified: false
                            }).exec();

                          case 20:
                            unverified_manufacturers = _context14.sent;
                            _context14.next = 23;
                            return _UserModel["default"].countDocuments({
                              role: 'collector',
                              verified: false
                            }).exec();

                          case 23:
                            unverified_collectors = _context14.sent;
                            _context14.next = 26;
                            return _RequestPickupModel["default"].countDocuments({}).exec();

                          case 26:
                            toal_requested_pickups = _context14.sent;
                            data = {
                              total_payment_reciceved: total_payment_reciceved,
                              recyclers: recyclers,
                              manufacturers: manufacturers,
                              collectors: collectors,
                              admin: admin,
                              unverified_recyclers: unverified_recyclers,
                              unverified_manufacturers: unverified_manufacturers,
                              unverified_collectors: unverified_collectors,
                              toal_requested_pickups: toal_requested_pickups,
                              manufacturers_logged_ewaste_weight: Math.round(logged_eqiupment_weight),
                              collection_centers_logged_ewaste_weight: Math.round(logged_collection_center_waste_weight),
                              recyclers_logged_ewaste_weight: Math.round(logged_recycler_waste_weight)
                            };
                            res.json({
                              error: false,
                              code: 200,
                              status: 'success',
                              data: data
                            });

                          case 29:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));

                  return function (_x29, _x30) {
                    return _ref15.apply(this, arguments);
                  };
                }());
              });
            });

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function dashboard_counts(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

exports.dashboard_counts = dashboard_counts;

var search_user_varibles = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var query, page, limit, startIndex, endIndex, results, total_users;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            // console.log('Search', req.query.search);
            query = {
              name: req.query.search
            }; // let regex = new RegExp(query,'i');

            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context16.next = 8;
            return _UserModel["default"].countDocuments({
              $or: [{
                'name': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }, {
                'email': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }]
            }).exec();

          case 8:
            total_users = _context16.sent;
            _context16.t0 = endIndex;
            _context16.next = 12;
            return _UserModel["default"].countDocuments({
              $or: [{
                'name': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }, {
                'email': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }]
            }).exec();

          case 12:
            _context16.t1 = _context16.sent;

            if (!(_context16.t0 < _context16.t1)) {
              _context16.next = 15;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 15:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _UserModel["default"].find({
              $or: [{
                'name': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }, {
                'email': {
                  $regex: req.query.search,
                  $options: 'i'
                }
              }]
            }).exec(function (err, user) {
              if (err) {
                _console["default"].log(err);

                return res.status(401).send({
                  error: true,
                  message: "Error occurred while feching users"
                });
              }

              if (!user) {
                return res.status(404).send({
                  error: true,
                  message: "can not find users"
                });
              }

              res.json({
                error: false,
                message: 'success',
                pagination: results,
                total_users: total_users,
                users: user,
                code: 200
              }); // console.log('search', search);
            }), function (err) {
              // console.log(err);
              res.send({
                error: true,
                message: 'server error'
              });
            };

          case 17:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function search_user_varibles(_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}(); // Search Log equipments only user by name and email
// export const search_logged_equipment_with_varibles = (req, res) => {
//     console.log('Search', req.query.search);
//     let query = { name: req.query.search };
//     // let regex = new RegExp(query,'i');
//     User.find({
//         $or: [
//         {'name': {$regex: req.query.search, $options: 'i'}},
//         {'email': {$regex: req.query.search, $options: 'i'}},
//         ]
//     }).exec((err, user) => {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         res.json(user);
//         // console.log('search', search);
//     });
// }
// Search Log equipments only user by name and email


exports.search_user_varibles = search_user_varibles;

var search_logged_equipment_with_varibles = function search_logged_equipment_with_varibles(req, res, next) {
  // console.log('Search', req.query.search);
  _UserModel["default"].find({
    $text: {
      $search: req.query.search,
      $diacriticSensitive: false
    }
  }, {
    score: {
      $meta: "textScore"
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  }).exec(function (err, user) {
    if (err) {
      return res.status(401).send({
        error: true,
        message: "Error occurred while feching users"
      });
    }

    if (!user) {
      return res.status(401).send({
        error: true,
        code: 404,
        message: "User not found"
      });
    }

    _console["default"].log("User serced for", user); // return res.send({error: false, message: "User searched done", user});
    // Log.find({ user_id: user[0]._id }).populate('category_id').populate('sub_category_id').populate('user_id').exec((err, search) => {
    // if (err) {
    //     console.log(err);
    //     return res.send(err);
    // }
    // res.json({search, user});
    // // console.log('search', search);
    // }),((err) => {
    //     // console.log(err);
    //     res.send({error: true, message: 'An error while seaching logged equipment'});
    // });

  });
};

exports.search_logged_equipment_with_varibles = search_logged_equipment_with_varibles;

var find_user_by_date_range = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res) {
    var _req$query, startDate, endDate, page, limit, startIndex, endIndex, results, total_users;

    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _req$query = req.query, startDate = _req$query.startDate, endDate = _req$query.endDate;

            if (!(startDate === '' || endDate === '')) {
              _context17.next = 3;
              break;
            }

            return _context17.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick two dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ startDate, endDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context17.next = 10;
            return _UserModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 10:
            total_users = _context17.sent;
            _context17.t0 = endIndex;
            _context17.next = 14;
            return _UserModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 14:
            _context17.t1 = _context17.sent;

            if (!(_context17.t0 < _context17.t1)) {
              _context17.next = 17;
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
            } // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _UserModel["default"].find({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59)) //   $gte: new Date(new Date(startDate)),
                //   $lt: new Date(new Date(endDate))

              }
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, users) {
              // console.log("users", users)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!users) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find users"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_users: total_users,
                pagination: results,
                users: users,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function find_user_by_date_range(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();

exports.find_user_by_date_range = find_user_by_date_range;

var find_user_by_specific_date = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res) {
    var actualDate, page, limit, startIndex, endIndex, results, total_users;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            actualDate = req.query.actualDate;

            if (!(actualDate === '')) {
              _context18.next = 3;
              break;
            }

            return _context18.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick a dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ actualDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context18.next = 10;
            return _UserModel["default"].countDocuments({
              created_at: actualDate
            }).exec();

          case 10:
            total_users = _context18.sent;
            _context18.t0 = endIndex;
            _context18.next = 14;
            return _UserModel["default"].countDocuments({
              created_at: actualDate
            }).exec();

          case 14:
            _context18.t1 = _context18.sent;

            if (!(_context18.t0 < _context18.t1)) {
              _context18.next = 17;
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
            } // $gte: new Date(2012, 7, 14), 
            // $lt: new Date(2012, 7, 15)
            // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _UserModel["default"].find({
              created_at: {
                // new Date(actualDate)
                $gte: new Date(actualDate),
                $lt: new Date(actualDate)
              }
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, users) {
              // console.log("users", users)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!users) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find users"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_users: total_users,
                pagination: results,
                users: users,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function find_user_by_specific_date(_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}();

exports.find_user_by_specific_date = find_user_by_specific_date;

var find_equipment_by_date_range = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res) {
    var _req$query2, startDate, endDate, page, limit, startIndex, endIndex, results, total_equipments;

    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _req$query2 = req.query, startDate = _req$query2.startDate, endDate = _req$query2.endDate;

            if (!(startDate === '' || endDate === '')) {
              _context19.next = 3;
              break;
            }

            return _context19.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick two dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ startDate, endDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context19.next = 10;
            return _LogModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 10:
            total_equipments = _context19.sent;
            _context19.t0 = endIndex;
            _context19.next = 14;
            return _LogModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 14:
            _context19.t1 = _context19.sent;

            if (!(_context19.t0 < _context19.t1)) {
              _context19.next = 17;
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
            } // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _LogModel["default"].find({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59)) //   $gte: new Date(new Date(startDate)),
                //   $lt: new Date(new Date(endDate))

              }
            }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec(function (err, equipments) {
              // console.log("equipments", equipments)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!equipments) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find equipments"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_equipments: total_equipments,
                pagination: results,
                equipments: equipments,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function find_equipment_by_date_range(_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}();

exports.find_equipment_by_date_range = find_equipment_by_date_range;

var search_ewaste_by_date_range = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res) {
    var _req$query3, startDate, endDate, page, limit, startIndex, endIndex, results, total_ewastes;

    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _req$query3 = req.query, startDate = _req$query3.startDate, endDate = _req$query3.endDate;

            if (!(startDate === '' || endDate === '')) {
              _context20.next = 3;
              break;
            }

            return _context20.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick two dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ startDate, endDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context20.next = 10;
            return _EwasteModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 10:
            total_ewastes = _context20.sent;
            _context20.t0 = endIndex;
            _context20.next = 14;
            return _EwasteModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 14:
            _context20.t1 = _context20.sent;

            if (!(_context20.t0 < _context20.t1)) {
              _context20.next = 17;
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
            } // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _EwasteModel["default"].find({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59)) //   $gte: new Date(new Date(startDate)),
                //   $lt: new Date(new Date(endDate))

              }
            }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec(function (err, ewaste) {
              // console.log("equipments", equipments)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find ewaste"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_ewastes: total_ewastes,
                pagination: results,
                ewaste: ewaste,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function search_ewaste_by_date_range(_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}();

exports.search_ewaste_by_date_range = search_ewaste_by_date_range;

var search_recyclerEwaste_by_date_range = /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res) {
    var _req$query4, startDate, endDate, page, limit, startIndex, endIndex, results, total_recyclerEwastes;

    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _req$query4 = req.query, startDate = _req$query4.startDate, endDate = _req$query4.endDate;

            if (!(startDate === '' || endDate === '')) {
              _context21.next = 3;
              break;
            }

            return _context21.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick two dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ startDate, endDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context21.next = 10;
            return _RecyclerWasteModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 10:
            total_recyclerEwastes = _context21.sent;
            _context21.t0 = endIndex;
            _context21.next = 14;
            return _RecyclerWasteModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 14:
            _context21.t1 = _context21.sent;

            if (!(_context21.t0 < _context21.t1)) {
              _context21.next = 17;
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
            } // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _RecyclerWasteModel["default"].find({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59)) //   $gte: new Date(new Date(startDate)),
                //   $lt: new Date(new Date(endDate))

              }
            }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec(function (err, ewaste) {
              // console.log("equipments", equipments)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!ewaste) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find recycler's ewaste"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_recyclerEwastes: total_recyclerEwastes,
                pagination: results,
                ewaste: ewaste,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function search_recyclerEwaste_by_date_range(_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}();

exports.search_recyclerEwaste_by_date_range = search_recyclerEwaste_by_date_range;

var search_requestedPickups_by_date_range = /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res) {
    var _req$query5, startDate, endDate, page, limit, startIndex, endIndex, results, total_requestedPickups;

    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _req$query5 = req.query, startDate = _req$query5.startDate, endDate = _req$query5.endDate;

            if (!(startDate === '' || endDate === '')) {
              _context22.next = 3;
              break;
            }

            return _context22.abrupt("return", res.status(400).json({
              status: 'failure',
              message: 'Please ensure you pick two dates'
            }));

          case 3:
            //2. check that date is in the right format
            //expected result: YYY-MMM-DDD
            // console.log({ startDate, endDate});
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {};
            _context22.next = 10;
            return _RequestPickupModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 10:
            total_requestedPickups = _context22.sent;
            _context22.t0 = endIndex;
            _context22.next = 14;
            return _RequestPickupModel["default"].countDocuments({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            }).exec();

          case 14:
            _context22.t1 = _context22.sent;

            if (!(_context22.t0 < _context22.t1)) {
              _context22.next = 17;
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
            } // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            // $lt: new Date(new Date(endDate).setHours(23, 59, 59))


            _RequestPickupModel["default"].find({
              created_at: {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59)) //   $gte: new Date(new Date(startDate)),
                //   $lt: new Date(new Date(endDate))

              }
            }).sort('-created_at').limit(limit).skip(startIndex).exec(function (err, requestedPickups) {
              // console.log("equipments", equipments)
              if (err) {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.json({
                  error: true,
                  status: 401,
                  message: "error occured"
                });
              }

              if (!requestedPickups) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "Cant not find requested pickups"
                });
              }

              return res.json({
                error: false,
                status: 201,
                total_requestedPickups: total_requestedPickups,
                pagination: results,
                requestedPickups: requestedPickups,
                message: "success!"
              });
            });

          case 19:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function search_requestedPickups_by_date_range(_x43, _x44) {
    return _ref22.apply(this, arguments);
  };
}();

exports.search_requestedPickups_by_date_range = search_requestedPickups_by_date_range;
//# sourceMappingURL=epron.controllers.js.map