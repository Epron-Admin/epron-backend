"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.user_profile = exports.update_profile = exports.update_payment_option = exports.update_multiple_payment_options = exports.update_logged_equipment = exports.remove_log_equipment = exports.password_reset = exports.log_equiptment2 = exports.log_equiptment = exports.initialize_transanction = exports.get_states = exports.get_price_of_equipment_for_payment = exports.get_naija_states = exports.get_naija_lgas = exports.get_naija = exports.get_customers = exports.get_countries = exports.get_cities = exports.forgot_password = exports.find_user_byid = exports.find_user_by_role = exports.find_collection_center_by_location = exports.fetch_user_loged_equiptment_byid_paid_status = exports.fetch_user_loged_equiptment_byid = exports.fetch_user_loged_equiptment_by_payment = exports.fetch_all_loged_equiptments = exports.excel_bulk_equipment = exports.change_password = exports.bulk_log_upload3 = exports.bulk_log_upload2 = exports.bulk_log_upload = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

var _LogModel = _interopRequireDefault(require("../../models/Log.model.js"));

var _CategoryTypesModel = _interopRequireDefault(require("../../models/CategoryTypes.model.js"));

var _querystring = _interopRequireDefault(require("querystring"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _crypto = _interopRequireDefault(require("crypto"));

var _async = _interopRequireDefault(require("async"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _multer = _interopRequireDefault(require("multer"));

var _csvIt = _interopRequireDefault(require("csv-it"));

var _paystack = _interopRequireDefault(require("paystack"));

var _countryStateCity = require("country-state-city");

var _naijaStateLocalGovernment = _interopRequireDefault(require("naija-state-local-government"));

var _express = _interopRequireDefault(require("express"));

var _mailgunJs = _interopRequireDefault(require("mailgun-js"));

var _console = _interopRequireDefault(require("console"));

var _os = require("os");

// import GenCtrl from  '@balocodes/express';
// import MailController from '@balocodes/express';
// import csv from 'fast-csv';
var upload = (0, _multer["default"])({
  dest: 'uploads/'
});
var paystack = new _paystack["default"]('sk_test_72c8ff80984a6f3e15c931b9485f55474ea36e81');
var API_KEY = 'a2e391c08729f67397de943776f87024-46ac6b00-d975f38b';
var DOMAIN = 'sandbox086e0a8d8f2f4b748fb92de88df70842.mailgun.org';

// const mailgun = new Mailgun({apiKey: API_KEY, domain: DOMAIN});
// const app = express();
// app.use(upload.array());
var router = _express["default"].Router();

var get_customers = function get_customers(req, res) {
  paystack.customer.list(function (error, body) {
    if (!error) {
      return res.json({
        error: false,
        status: 201,
        customers: body,
        message: "success!"
      });
    }

    if (error) {
      // console.log(error);
      return res.json({
        error: true,
        status: 401,
        message: error
      });
    }
  });
};

exports.get_customers = get_customers;

var initialize_transanction = function initialize_transanction(req, res) {
  paystack.transaction.initialize({
    email: req.body.email,
    amount: Number(req.body.amount) * 100
  }).then(function (body) {
    return res.json({
      error: false,
      status: 201,
      customers: body.data,
      message: "success!"
    }); // res.send(body.data)
    // console.log(body);
  })["catch"](function (error) {
    return res.json({
      error: true,
      status: 401,
      message: error
    }); // console.log(err);
  });
};

exports.initialize_transanction = initialize_transanction;

var update_payment_option = function update_payment_option(req, res) {
  _LogModel["default"].find({
    equipment_pin: req.params.pin
  }).exec(function (err, log) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "An error occured"
      });
    }

    if (!log) {
      return res.json({
        error: true,
        status: 404,
        message: "can not find logged equipment with that equipment pin"
      });
    } else {
      log[0].paid = true;
      log[0].reference = req.params.ref;
      log[0].save().then(function (result) {
        return res.json({
          error: false,
          status: 201,
          message: "Payment updated successfully!"
        });
      })["catch"](function (err) {
        return res.json({
          error: true,
          status: 401,
          message: "Could not update logged payment status"
        });
      });
    }
  });
}; // When payment has to be updated on more than one record.


exports.update_payment_option = update_payment_option;

var update_multiple_payment_options = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _LogModel["default"].updateMany({
              equipment_pin: req.params.pin
            }, {
              paid: true
            }).exec(function (err, log) {
              _console["default"].log("many recoreds", log);

              if (err) {
                return res.json({
                  error: true,
                  status: 401,
                  message: "An error occured"
                });
              }

              if (!log) {
                return res.json({
                  error: true,
                  status: 404,
                  message: "can not find logged equipment with that equipment pin"
                });
              }

              if (log.acknowledged != true) {
                return res.json({
                  error: true,
                  status: 401,
                  message: "could not update multiple records to paid"
                });
              }

              if (log.acknowledged === true) {
                return res.json({
                  error: false,
                  status: 201,
                  message: "Multiple records updated to paid"
                });
              }
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function update_multiple_payment_options(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.update_multiple_payment_options = update_multiple_payment_options;

var user_profile = function user_profile(req, res) {
  _UserModel["default"].findById(req.params.id).exec(function (err, user) {
    if (err) {
      _console["default"].log(err);

      return res.send(err);
    } // res.send(user);


    res.status(200).json({
      user: user
    }); // console.log(user);
    // console.log('Done');
  });
}; // console.log(Country.getAllCountries());
// console.log(State.getStatesOfCountry('NG'))


exports.user_profile = user_profile;

var get_countries = function get_countries(req, res) {
  var countries = _countryStateCity.Country.getAllCountries();

  return res.json({
    error: false,
    message: 'countries loaded',
    data: countries,
    status: 'success',
    code: 201
  });
};

exports.get_countries = get_countries;

var get_states = function get_states(req, res) {
  var id = req.params.isoCode;

  var states = _countryStateCity.State.getStatesOfCountry(id);

  return res.json({
    error: false,
    message: 'states loaded',
    data: states,
    status: 'success',
    code: 201
  });
};

exports.get_states = get_states;

var get_cities = function get_cities(req, res) {
  var id = req.params.isoCode;
  var id2 = req.params.id;

  var cities = _countryStateCity.City.getCitiesOfState(id, id2);

  return res.json({
    error: false,
    message: 'cities loaded',
    data: cities,
    status: 'success',
    code: 201
  });
};

exports.get_cities = get_cities;

var get_naija_states = function get_naija_states(req, res) {
  var states = _naijaStateLocalGovernment["default"].states();

  return res.json({
    error: false,
    message: 'states loaded',
    data: states,
    status: 'success',
    code: 201
  });
};

exports.get_naija_states = get_naija_states;

var get_naija_lgas = function get_naija_lgas(req, res) {
  var states = _naijaStateLocalGovernment["default"].lgas(req.params.state);

  return res.json({
    error: false,
    message: 'states loaded',
    data: states,
    status: 'success',
    code: 201
  });
};

exports.get_naija_lgas = get_naija_lgas;

var get_naija = function get_naija(req, res) {
  var states = _naijaStateLocalGovernment["default"].all();

  return res.json({
    error: false,
    message: 'states loaded',
    data: states,
    status: 'success',
    code: 201
  });
};

exports.get_naija = get_naija;

var update_profile = function update_profile(req, res) {
  _UserModel["default"].findById(req.params.id, function (err, user) {
    if (err) {
      _console["default"].log(err);
    }

    if (!user) return next(new Error('Could not load document'));else {
      // console.log('The user', user);
      // console.log('the body', req.body);
      user.name = req.body.name; // user.email = req.body.email;

      user.phoneNumber = req.body.phoneNumber;
      user.address = req.body.address;
      user.state = req.body.state; // user.city = req.body.city;
      // user.lga = req.body.lga;
      // user.body.user = req.body;

      user.save().then(function (result) {
        res.json({
          'user  ': result
        }); //res.status(200).send({mssage: 'update successful'});
      })["catch"](function (err) {
        _console["default"].log(err.code);

        res.send({
          error: true,
          message: 'failed to update'
        });
      });
    }
  });
};

exports.update_profile = update_profile;

var find_user_by_role = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var page, limit, startIndex, endIndex, results, total;
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
            return _UserModel["default"].countDocuments({
              role: req.params.role
            }).exec();

          case 7:
            total = _context2.sent;
            _context2.t0 = endIndex;
            _context2.next = 11;
            return _UserModel["default"].countDocuments().exec();

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

            _UserModel["default"].find({
              role: req.params.role
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
                total: total,
                pagination: results,
                user: user,
                message: "successful!"
              });
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function find_user_by_role(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.find_user_by_role = find_user_by_role;

var find_user_byid = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _UserModel["default"].find({
              _id: req.params.id
            }).exec(function (err, user) {
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
                user: user,
                message: "successful!"
              });
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function find_user_byid(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.find_user_byid = find_user_byid;

var find_collection_center_by_location = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _UserModel["default"].find({
              lga: req.params.lga,
              role: 'collector'
            }).exec(function (err, user) {
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
                user: user,
                message: "successful!"
              });
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function find_collection_center_by_location(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); // fortgot password to be sent to your email


exports.find_collection_center_by_location = find_collection_center_by_location;

var forgot_password = function forgot_password(req, res, next) {
  // console.log('Email from front', req.body);
  _async["default"].waterfall([function (done) {
    _crypto["default"].randomBytes(20, function (err, buf) {
      var token = buf.toString('hex');
      done(err, token);
    });
  }, function (token, done) {
    _UserModel["default"].findOne({
      email: req.body.email
    }, function (err, user) {
      var userEmail = req.body.email; // console.log('email', userEmail);

      if (!user) {
        // req.flash('error', 'No account with that email address exists.');
        // return next(new Error('No account with that email address exists.'));
        return res.send({
          error: true,
          message: 'Email address does not exists.'
        });
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
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
      subject: 'Reset your password',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://epronregister.com.ng/users/reset-reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged'
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
      // console.log("Dattttttttttttaaaaaaaa", data);
      if (err) {
        // console.log('Error Occurs', err);
        return res.send({
          error: true,
          code: 401,
          message: "Failed to reset user password"
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
    }); // const data = {
    // from: 'Epron Admin <epron@gmail.com>',
    // to: req.body.email,
    // subject: 'Password reset',
    // text: 'You are receiving this because you (or someone else) have requested the reset of the password ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://epronregister.com.ng/users/password-reset/' + token + '\n\n' +
    //             'If you did not request this, please ignore this email and your password will remain unchanged'
    // };
    // mailgun.messages().send(data, (error, body) => {
    // if (error) {
    //     console.log(error);
    //     res.send({error});
    // }
    // console.log('Mailgun body', body);
    // res.json({error: false, message: 'Token sent to your email', status: 'success', code: 201});
    // });
  }])["catch"](function (err) {
    _console["default"].log(err);

    res.send({
      err: err
    });
  });
}; // function to change the forgotten password


exports.forgot_password = forgot_password;

var password_reset = function password_reset(req, res, next) {
  _console["default"].log('password from front: ', req.params.token);

  _async["default"].waterfall([function (done) {
    _UserModel["default"].findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        // console.log('password from front: ', req.body);
        // return next(new Error('Password reset token is invalid or has expired.'));
        return res.send({
          message: 'Password reset token has expired, or user not found.'
        }); // req.flash('success', 'Password reset token is invalid or has expired.');
        // return res.redirct('back');
      }

      if (req.body.password === req.body.confirmPassword) {
        var newPassword = _bcrypt["default"].hashSync(req.body.password, 10);

        _UserModel["default"].findByIdAndUpdate(user._id, {
          password: newPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined
        }, function (error, data) {
          // res.json({ 'user': data });
          var mailTransporter = _nodemailer["default"].createTransport({
            service: 'gmail',
            auth: {
              user: 'charlesamos003@gmail.com',
              pass: 'xwytgfmmdpdnbajp'
            }
          });

          var mailDetails = {
            from: 'Epron Admin <empron@gmail.com>',
            to: req.body.email,
            subject: 'Password has been changed',
            text: 'Hello,\n\n' + ' This is a confirmation that the password for your accout ' + user.email + ' has just been changed'
          };
          mailTransporter.sendMail(mailDetails, function (err, data) {
            // console.log("Dattttttttttttaaaaaaaa", data);
            if (err) {
              // console.log('Error Occurs', err);
              return res.send({
                error: true,
                code: 401,
                message: "Failed to reset user password"
              });
            } else {
              // console.log('Email sent successfully');
              return res.json({
                error: false,
                code: 201,
                status: 'success',
                message: 'Password reset successful'
              });
            }
          }); // const data2 = {
          //   from: 'Epron Admin <epron@gmail.com>',
          //   to: user.email,
          //   subject: 'Your password has been changed',
          //   text: 'Hello,\n\n' + ' This is a confirmation that the password for your accout ' + user.email + ' has just been changed'
          // };
          // mailgun.messages().send(data2, (error, body) => {
          // if (error) {
          //     console.log(error);
          // return res.json({errr: true, error, message: 'An error occured while sending you a mail'});
          // }
          // // console.log('Mailgun body', body);
          // // res.json({body, 'user': data});
          // res.json({error: false, message: 'Password reset successful'});
          // });
          // // done(user);
        });
      } else {
        // req.flash('error', 'Passwords do not match.');
        res.send({
          error: true,
          message: "Can't reset password."
        }); // return res.redirect('back');
      }
    });
  }])["catch"](function (err) {
    _console["default"].log(err);

    res.send({
      err: err
    });
  });
};

exports.password_reset = password_reset;

var change_password = function change_password(req, res) {
  _console["default"].log('Clicked', req.body.oldPassword);

  var oldPassword = req.body.oldPassword;

  var newPassword = _bcrypt["default"].hashSync(req.body.newPassword, 10);

  var email = req.body.email; // console.log("email" ,email);
  // console.log('new passowrd', newPassword);

  _UserModel["default"].find({
    email: email
  }, function (err, user) {
    // console.log('user password', user[0].password, newPassword);
    if (!user) {
      return res.send({
        code: 404,
        error: true,
        message: "Can't find user"
      });
    } else if (user) {
      // console.log('the user ring', user);
      if (_bcrypt["default"].compare(oldPassword, user[0].password)) {
        // console.log('Za user', user[0].password);
        _UserModel["default"].findByIdAndUpdate(user[0]._id.toString(), {
          password: newPassword
        }, function (err, data) {
          // console.log("adatatatata", data);
          if (err) {
            // console.log('failed');
            // console.log('the user error change', user);
            res.send({
              error: true,
              message: 'Failed to change password'
            });
          } else {
            // console.log('the user successful change password', user);
            // console.log('success');
            return res.send({
              error: false,
              message: 'Password successfully changed'
            });
          }
        });
      }
    } else {
      return res.send({
        error: true,
        message: 'User not found'
      });
    }
  });
}; // export const log_equiptment = async (req, res) => {
//     if (
//         (!req.body.category_id) ||
//         (!req.body.price) ||
//         (!req.body.sub_category_id) ||
//         (!req.body.quantity) ||
//         (!req.body.weight) ||
//         (!req.body.unit) ||
//         (!req.body.user_id)
//         ) {
//         return res.status(401).send({error: true, message: "Category_id, price, unit, type, quantity, weight and user_id are required"});
//     }   
//     else {
//         let ton_weight;
//         await Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
//             if (err) {
//                 console.log(err);
//                 return res.json({error: true, status: 401, message: "Failed fetch types"})
//             }
//             if (req.body.price != type.price) {
//                 return res.json({error: true, status: 401, message: "The type price does not match" });
//             }
//             // note the weight is measured in tonage or ton, after the aggregation from the unit.
//             if (req.body.unit === 'kg') {
//                 ton_weight = 0.00110231 * req.body.weight;
//             }
//             if (req.body.unit === 'g') {
//             ton_weight = 0.0000011023 * req.body.weight;
//             }
//             // res.json({error: false, status: 201, requests: type, message: "fetch all types successful!" });
//             const total = type.price *  req.body.quantity * req.body.weight;
//             const pin = Math.random().toString(36).slice(2);
//             let log = new Log({
//                 category_id: req.body.category_id,
//                     price: type.price,
//                     total: Math.round(total),
//                     sub_category_id: req.body.sub_category_id,
//                     quantity: req.body.quantity,
//                     weight: ton_weight,
//                     unit: req.body.unit,
//                     unit_weight: req.body.weight,
//                     user_id: req.body.user_id,
//                     equipment_pin: pin,
//                     created_at: Date.now(),
//                     updated_at: Date.now()
//             });
//             log.save()
//             .then(data => {
//                 res.status(201).json({log: data, error: false, message: "Equipment saved successful!" });
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(401).send({error: true, message: "Failed to save equipment"});
//             });
//         });
//     }
// }


exports.change_password = change_password;

var log_equiptment = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(!req.body.category_id || // (!req.body.price) ||
            !req.body.sub_category_id || !req.body.quantity || !req.body.weight || !req.body.unit || !req.body.user_id)) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", res.status(401).send({
              error: true,
              message: "Category_id, unit, type, quantity, weight and user_id are required"
            }));

          case 2:
            _UserModel["default"].findById({
              _id: req.body.user_id
            }).exec(function (err, user) {
              if (err) {
                // console.log(err);
                return res.send(err);
              }

              if (!user) {
                return res.status(404).send({
                  error: true,
                  message: "User not found"
                });
                ;
              }

              if (user.role != 'manufacturer') {
                return res.status(401).send({
                  error: true,
                  message: "This user can not log equipment"
                });
              } else {
                var ton_weight;

                _CategoryTypesModel["default"].findById({
                  _id: req.body.sub_category_id
                }).exec(function (err, type) {
                  _console["default"].log("Sub category", type);

                  if (err) {
                    // console.log(err);
                    return res.json({
                      error: true,
                      status: 401,
                      message: "Failed fetch types"
                    });
                  }

                  if (!type) {
                    // console.log(err);
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
                  var log = new _LogModel["default"]({
                    category_id: req.body.category_id,
                    // unit_price: type.price,
                    price: type.price,
                    total: Math.round(total),
                    sub_category_id: req.body.sub_category_id,
                    quantity: req.body.quantity,
                    weight: ton_weight,
                    unit: req.body.unit,
                    unit_weight: req.body.weight,
                    user_id: req.body.user_id,
                    equipment_pin: pin,
                    created_at: Date.now(),
                    updated_at: Date.now()
                  });
                  log.save().then(function (data) {
                    res.status(201).json({
                      log: data,
                      error: false,
                      message: "equipment saved successful!"
                    });
                  })["catch"](function (err) {
                    _console["default"].log(err);

                    res.status(401).send({
                      error: true,
                      message: "Failed to save equipment"
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function log_equiptment(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.log_equiptment = log_equiptment;

var update_logged_equipment = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(!req.body.category_id || // (!req.body.price) ||
            !req.body.sub_category_id || !req.body.quantity || !req.body.weight || !req.body.unit || !req.body.user_id // (!req.body.user_id)
            )) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt("return", res.status(401).send({
              error: true,
              message: "Category_id, unit, type, quantity, weight and user_id are required"
            }));

          case 2:
            _LogModel["default"].findById(req.params.id, function (err, log) {
              if (err) {
                _console["default"].log(err);
              }

              if (!log) {
                // return next(new Error('Could not find logged eqiupment'));
                return res.status(404).send({
                  error: true,
                  message: "Could not find logged eqiupment"
                });
              }

              if (log.user_id != req.body.user_id) {
                // return next(new Error('Could not find logged eqiupment'));
                return res.status(402).send({
                  error: true,
                  message: "You can not update this log"
                });
              }

              if (log.paid === true) {
                return res.status(401).send({
                  error: true,
                  message: "you can not update this logged eqiupment, it has been paid for"
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
                    _console["default"].log(err);

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
                  }

                  var total = type.price * req.body.weight;
                  log.category_id = req.body.category_id, // log.category_name = req.body.category_name,
                  log.price = type.price, log.total = total, log.sub_category_id = req.body.sub_category_id, // log.sub_category_name = req.body.sub_category_name,
                  log.quantity = req.body.quantity, log.weight = req.body.weight, // log.user_id = req.body.user_id,
                  // log.equipment_pin = pin,
                  log.updated_at = Date.now(); // user.body.user = req.body;

                  log.save().then(function (result) {
                    res.status(201).json({
                      error: false,
                      message: "Log update successful"
                    }); // res.json({ 'log': result });
                    //res.status(200).send({mssage: 'update successful'});
                  })["catch"](function (err) {
                    // console.log(err);
                    res.send({
                      error: true,
                      message: 'failed to update logged equipment'
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function update_logged_equipment(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.update_logged_equipment = update_logged_equipment;

var fetch_user_loged_equiptment_byid = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var page, limit, startIndex, endIndex, results, total_equipment_logged, total_number_paid;
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
            return _LogModel["default"].countDocuments({
              user_id: req.params.id
            }).exec();

          case 7:
            total_equipment_logged = _context7.sent;
            _context7.next = 10;
            return _LogModel["default"].countDocuments({
              user_id: req.params.id,
              paid: true
            }).exec();

          case 10:
            total_number_paid = _context7.sent;
            _context7.t0 = endIndex;
            _context7.next = 14;
            return _LogModel["default"].countDocuments().exec();

          case 14:
            _context7.t1 = _context7.sent;

            if (!(_context7.t0 < _context7.t1)) {
              _context7.next = 17;
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

            _LogModel["default"].find({
              user_id: req.params.id
            }).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
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
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function fetch_user_loged_equiptment_byid(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.fetch_user_loged_equiptment_byid = fetch_user_loged_equiptment_byid;

var fetch_user_loged_equiptment_byid_paid_status = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var page, limit, startIndex, endIndex, results, total_equipment_logged;
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
            return _LogModel["default"].countDocuments({
              user_id: req.params.id,
              paid: req.query.paid
            }).exec();

          case 7:
            total_equipment_logged = _context8.sent;
            _context8.t0 = endIndex;
            _context8.next = 11;
            return _LogModel["default"].countDocuments().exec();

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

            _LogModel["default"].find({
              user_id: req.params.id,
              paid: req.query.paid
            }).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
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
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function fetch_user_loged_equiptment_byid_paid_status(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.fetch_user_loged_equiptment_byid_paid_status = fetch_user_loged_equiptment_byid_paid_status;

var fetch_user_loged_equiptment_by_payment = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var page, limit, startIndex, endIndex, results;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
            startIndex = (page - 1) * limit;
            endIndex = page * limit;
            results = {}; // const total_equipment_logged = await Log.countDocuments({user_id: req.params.id}).exec();
            // const total_number_paid = await Log.countDocuments({user_id: req.params.id, paid: true}).exec();

            _context9.t0 = endIndex;
            _context9.next = 8;
            return _LogModel["default"].countDocuments().exec();

          case 8:
            _context9.t1 = _context9.sent;

            if (!(_context9.t0 < _context9.t1)) {
              _context9.next = 11;
              break;
            }

            results.next = {
              page: page + 1,
              limit: limit
            };

          case 11:
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              };
            }

            _LogModel["default"].find({
              user_id: req.params.id
            }).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
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

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function fetch_user_loged_equiptment_by_payment(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.fetch_user_loged_equiptment_by_payment = fetch_user_loged_equiptment_by_payment;

var fetch_all_loged_equiptments = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var page, limit, startIndex, endIndex, results, total_log;
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
            return _LogModel["default"].countDocuments().exec();

          case 7:
            total_log = _context10.sent;
            _context10.t0 = endIndex;
            _context10.next = 11;
            return _LogModel["default"].countDocuments().exec();

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

            _LogModel["default"].find({}).sort('-created_at').populate('category_id').populate('sub_category_id').limit(limit).skip(startIndex).exec(function (err, equipment, next) {
              if (err) {
                _console["default"].log(err);

                return res.json({
                  error: true,
                  status: 401,
                  message: "Failed to fetch logged equipment"
                });
              } // console.log("pageNumber:", startIndex)


              return res.json({
                error: false,
                status: 201,
                pagination: results,
                log: equipment,
                total: total_log,
                message: "Fetch all logged equipments successful!"
              });
            });

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function fetch_all_loged_equiptments(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.fetch_all_loged_equiptments = fetch_all_loged_equiptments;

var remove_log_equipment = function remove_log_equipment(req, res) {
  _LogModel["default"].findByIdAndRemove({
    _id: req.params.id
  }, function (err, log) {
    if (err) {
      return res.json({
        error: true,
        status: 401,
        message: "error occured"
      }); // res.json(err);
    }

    if (!log) {
      return res.json({
        error: true,
        status: 401,
        message: "log equipment not found"
      }); // res.json(err);
    }

    if (log.paid === true) {
      return res.status(401).send({
        error: true,
        message: "you can not delete this log"
      });
    } else {
      return res.json({
        error: false,
        status: 201,
        message: "success!"
      }); // res.json('removed successfully');
    }
  });
};

exports.remove_log_equipment = remove_log_equipment;
var bulk_log_upload = (upload.single("log"), /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return (0, _csvtojson["default"])().fromFile(req.file.path).then(function (jsonObj) {
              // console.log("jsonnnnnnnnnnnnnnnnn", jsonObj);
              var army = [];

              for (var i = 0; i < jsonObj.length; i++) {
                var obj = {};
                obj.firstName = jsonObj[i]['First Name'];
                obj.lastName = jsonObj[i]['Last Name'];
                obj.house = jsonObj[i]['House'];
                obj.house = jsonObj[i]['House'];
                obj.category_id = jsonObj[i]['category_id'], obj.category_name = jsonObj[i]['category_name'], // obj.price = type.price,
                // obj.total = total,
                obj.sub_category_id = jsonObj[i]['sub_category_id'], obj.sub_category_name = jsonObj[i]['sub_category_name'], obj.quantity = jsonObj[i]['quantity'], obj.weight = jsonObj[i]['weight'], obj.user_id = jsonObj[i]['user_id'], obj.equipment_pin = jsonObj[i]['equipment_pin'], // created_at: Date.now(),
                // updated_at: Date.now()
                army.push(obj);
              }

              _console["default"].log("armyyyyyyy", army);

              _LogModel["default"].insertMany(army).then(function () {
                res.status(200).send({
                  message: "Successfully Uploaded!"
                });
              })["catch"](function (error) {
                res.status(500).send({
                  message: "failure",
                  error: error
                });
              });
            })["catch"](function (error) {
              res.status(500).send({
                message: "failure",
                error: error
              });
            });

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x21, _x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}());
exports.bulk_log_upload = bulk_log_upload;
var bulk_log_upload2 = (upload.single("file"), /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var authorFile, authors;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _console["default"].log("reqqqqqqqq", req.body);

            if (req.files) {
              _context12.next = 3;
              break;
            }

            return _context12.abrupt("return", res.status(400).send('No files were uploaded.'));

          case 3:
            authorFile = req.files.file;
            authors = [];
            (0, _csvtojson["default"])({
              noheader: true,
              output: "csv"
            }).fromString(req.body).then(function (csvRow) {
              _console["default"].log("csvvvvvvvvvvvvv", csvRow); // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]

            }); // csvtojson
            //  .parseFile(req.body).then(csvData => {
            //     console.log("csv datatttttttt", csvData)
            //     Log.insertMany(csvData).then(() => {
            //         console.log("Data saved");
            //         return res.status(200).send({success: 'Data saved.'});
            //     }).catch((error) => {
            //         res.status(500).send({
            //             message: "failure",
            //             error
            //         });
            //     });
            //  })

          case 6:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x24, _x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}());
exports.bulk_log_upload2 = bulk_log_upload2;

var bulk_log_upload3 = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var authorFile, authors;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _console["default"].log("reqqqqqqqq", req.file); // try{ let data = req.body; console.log("datatatata", data); res.status(200).send('success'); }catch(e){ res.status(400).send(e), console.log(e) }


            if (req.files) {
              _context13.next = 3;
              break;
            }

            return _context13.abrupt("return", res.status(400).send('No files were uploaded.'));

          case 3:
            authorFile = req.files.file;
            authors = [];

            _csvtojson["default"].fromString(authorFile.data.toString(), {
              headers: true,
              ignoreEmpty: true
            }).on("data", function (data) {
              data['_id'] = new mongoose.Types.ObjectId();
              authors.push(data);
            }).on("end", function () {
              Authors.create(authors, function (err, documents) {
                if (err) throw err;
              });
              res.send(authors.length + ' authors have been successfully uploaded.');
            });

          case 6:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function bulk_log_upload3(_x27, _x28, _x29) {
    return _ref13.apply(this, arguments);
  };
}();

exports.bulk_log_upload3 = bulk_log_upload3;

var log_equiptment2 = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (!(!req.body.category_id || // (!req.body.price) ||
            !req.body.sub_category_id || !req.body.quantity || !req.body.weight || !req.body.unit || !req.body.user_id)) {
              _context14.next = 2;
              break;
            }

            return _context14.abrupt("return", res.status(401).send({
              error: true,
              message: "Category_id, unit, type, quantity, weight and user_id are required"
            }));

          case 2:
            _UserModel["default"].findById({
              _id: req.body.user_id
            }).exec(function (err, user) {
              if (err) {
                // console.log(err);
                return res.send(err);
              }

              if (!user) {
                return res.status(404).send({
                  error: true,
                  message: "User not found"
                });
                ;
              }

              if (user.role != 'manufacturer') {
                return res.status(401).send({
                  error: true,
                  message: "This user can not log equipment"
                });
              } else {
                var ton_weight;

                _CategoryTypesModel["default"].findById({
                  _id: req.body.sub_category_id
                }).exec(function (err, type) {
                  _console["default"].log("Sub category", type);

                  if (err) {
                    // console.log(err);
                    return res.json({
                      error: true,
                      status: 401,
                      message: "Failed fetch types"
                    });
                  }

                  if (!type) {
                    // console.log(err);
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
                  var log = new _LogModel["default"]({
                    category_id: req.body.category_id,
                    // unit_price: type.price,
                    price: type.price,
                    total: Math.round(total),
                    sub_category_id: req.body.sub_category_id,
                    quantity: req.body.quantity,
                    weight: ton_weight,
                    unit: req.body.unit,
                    unit_weight: req.body.weight,
                    user_id: req.body.user_id,
                    equipment_pin: pin,
                    created_at: Date.now(),
                    updated_at: Date.now()
                  });
                  log.save().then(function (data) {
                    res.status(201).json({
                      log: data,
                      error: false,
                      message: "equipment saved successful!"
                    });
                  })["catch"](function (err) {
                    _console["default"].log(err);

                    res.status(401).send({
                      error: true,
                      message: "Failed to save equipment"
                    });
                  });
                });
              }
            });

          case 3:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function log_equiptment2(_x30, _x31) {
    return _ref14.apply(this, arguments);
  };
}();

exports.log_equiptment2 = log_equiptment2;

var excel_bulk_equipment = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _UserModel["default"].findById({
              _id: req.body.user_id,
              role: 'manufacturer'
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

              var log = new _LogModel["default"]({
                category_id: req.body.category_id,
                // unit_price: type.price,
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
              log.save().then(function (data) {
                res.status(201).json({
                  error: false,
                  message: "bulk equipment saved successful!"
                });
              })["catch"](function (err) {
                _console["default"].log(err);

                res.status(401).send({
                  error: true,
                  message: "Failed to save bulk equipment"
                });
              });
            });

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function excel_bulk_equipment(_x32, _x33) {
    return _ref15.apply(this, arguments);
  };
}();

exports.excel_bulk_equipment = excel_bulk_equipment;

var get_price_of_equipment_for_payment = function get_price_of_equipment_for_payment(req, res) {
  _LogModel["default"].find({
    equipment_pin: req.params.pin
  }).sort('-created_at').exec(function (err, log) {
    if (err) {
      return res.status(401).send({
        error: true,
        message: "error occured while finding ewaste"
      });
    }

    if (!log) {
      // console.log(err);
      return res.status(404).send({
        error: true,
        message: "ewastes not found"
      });
    }

    var total_payment = log.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.total;
    }, 0);
    return res.status(201).send({
      error: false,
      message: "success",
      total_payment: total_payment
    });
  });
}; // const fileName = req.body.fileName
// csv()
//   .fromFile(req.file.path)
//   .then((jsonObj) => {
//     //finding the document using fileName and setting csvData as the jsonObj
//     sheetModel.findOneAndUpdate({ fileName: fileName }, {$set: { csvData: jsonObj, fileName: fileName}, { upsert: true }}, (err, data) => {
//       if (err) {
//         res.status(400).json({
//           message: "Something went wrong!",
//         });
//       } else {
//         res.status(200).json({
//           message: "File Uploaded Successfully!",
//           result: data,
//         });
//       }
//     });
//   });


exports.get_price_of_equipment_for_payment = get_price_of_equipment_for_payment;
//# sourceMappingURL=users.controllers.js.map