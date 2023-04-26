"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify_user = exports.reg_userx = exports.reg_user_fake = exports.reg_user2 = exports.login_user = exports.generate_verify_token_validate_user = void 0;

var _UserModel = _interopRequireDefault(require("../../models/User.model.js"));

var _FakeUserModel = _interopRequireDefault(require("../../models/FakeUser.model.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _crypto = _interopRequireDefault(require("crypto"));

var _async = _interopRequireDefault(require("async"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _mailgunJs = _interopRequireDefault(require("mailgun-js"));

// import Collection from '../../models/CollectionCenter.model.js';
var API_KEY = 'a2e391c08729f67397de943776f87024-46ac6b00-d975f38b'; // var DOMAIN = 'sandbox086e0a8d8f2f4b748fb92de88df70842.mailgun.org';

var DOMAIN = 'www.epron.netlify.app.com';
var mailgun = new _mailgunJs["default"]({
  apiKey: API_KEY,
  domain: DOMAIN
}); // const Verifier = require('email-verifier');
// Register user

var reg_userx = function reg_userx(req, res) {
  if (!req.body.name || !req.body.email || !req.body.phoneNumber || !req.body.password || !req.body.role) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name, email, phone, password and role are required"
    });
  }

  var user = new _UserModel["default"]({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    country: req.body.country,
    countryid: req.body.countryid,
    state: req.body.state,
    stateid: req.body.stateid,
    city: req.body.city,
    cityid: req.body.cityid,
    lga: req.body.lga,
    address: req.body.address,
    password: _UserModel["default"].hashPassword(req.body.password),
    // image_url: req.body.image_url,
    role: req.body.role,
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
          // console.log('User', user);
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
          }); // if (req.body.role === 'collector') {
          //     let collector = new Collection({
          //         user_id: user._id,
          //     });
          //     collector.save().then((result) => {
          //         // console.log("resilt of center", result);
          //     }).catch(err => {
          //         // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
          //         return res.send({error: true, code: 401, message: "Failed to add new user to center"});
          //     });
          // }
        });
      }, function (token, user, done) {
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
          subject: 'Epron Registration',
          text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epron.netlify.app/verify/' + token + '\n\n' + 'If you did not request this, please ignore this email and your registration will be canceled'
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
        console.log(err);
        return res.send({
          err: err
        });
      });
    })["catch"](function (err) {
      // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
      return res.send({
        error: true,
        code: 401,
        message: "Failed to add new user"
      });
    });
  });
};

exports.reg_userx = reg_userx;

var reg_user_fake = function reg_user_fake(req, res) {
  if (!req.body.name || !req.body.email || !req.body.phoneNumber || !req.body.password || !req.body.role) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name, email, phone, password and role are required"
    });
  }

  var fake = new _FakeUserModel["default"]({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    country: req.body.country,
    countryid: req.body.countryid,
    state: req.body.state,
    stateid: req.body.stateid,
    city: req.body.city,
    cityid: req.body.cityid,
    lga: req.body.lga,
    address: req.body.address,
    password: _UserModel["default"].hashPassword(req.body.password),
    // image_url: req.body.image_url,
    role: req.body.role,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  _FakeUserModel["default"].findOne({
    email: req.body.email
  }).exec(function (err, doc, next) {
    console.log("Docu user", doc);

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

    fake.save().then(function (dataRes) {
      // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
      _async["default"].waterfall([function (done) {
        _crypto["default"].randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      }, function (token, done) {
        // User.findOne({email: req.body.email}).exec
        _FakeUserModel["default"].findOne({
          email: req.body.email
        }, function (err, user) {
          // userEmail = req.body.email;
          // console.log('User', user);
          if (!fake) {
            // req.flash('error', 'No account with that email address exists.');
            // return next(new Error('No account with that email address exists.'));
            return res.send({
              error: true,
              message: 'Email address does not exists.'
            });
          }

          fake.verifyToken = token;
          fake.verifyTokenExpires = Date.now() + 3600000;
          fake.save(function (err) {
            done(err, token, fake);
          });

          if (req.body.role === 'collector') {
            var collector = new Collection({
              user_id: user._id
            });
            collector.save().then(function (result) {// console.log("resilt of center", result);
            })["catch"](function (err) {
              // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
              return res.send({
                error: true,
                code: 401,
                message: "Failed to add new user to center"
              });
            });
          }
        });
      }, function (token, user, done) {
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
          subject: 'Epron Registration',
          text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epron.netlify.app/verify/' + token + '\n\n' + 'If you did not request this, please ignore this email and your registration will be canceled'
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
        console.log(err);
        return res.send({
          err: err
        });
      });
    })["catch"](function (err) {
      // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
      return res.send({
        error: true,
        code: 401,
        message: "Failed to add new user"
      });
    });
  });
}; // token validation for unverified user that did not get token or has expired


exports.reg_user_fake = reg_user_fake;

var generate_verify_token_validate_user = function generate_verify_token_validate_user(req, res, next) {
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
      var email = req.body.email; // console.log('email', email);

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
        user: 'charlesamos003@gmail.com',
        pass: 'xwytgfmmdpdnbajp'
      }
    });

    var mailDetails = {
      from: 'Epron Admin <empron@gmail.com>',
      to: req.body.email,
      subject: 'Epron Registration',
      text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epron.netlify.app/verify/' + token + '\n\n' + 'If you did not request this, please ignore this email and your registration will be canceled'
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
      // console.log("Dattttttttttttaaaaaaaa", data);
      if (err) {
        // console.log('Error Occurs', err);
        return res.send({
          error: true,
          code: 401,
          message: "Failed to add new user unverified user"
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
    console.log(err);
    res.send({
      err: err
    });
  });
}; // token validation for unverified user that did not get token or has expired
// Verify user by token


exports.generate_verify_token_validate_user = generate_verify_token_validate_user;

var verify_user = function verify_user(req, res, next) {
  console.log("Request params", req);

  _async["default"].waterfall([function (done) {
    _UserModel["default"].findOne({
      verifyToken: req.params.token,
      verifyTokenExpires: {
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
      } else {
        user.verified = true;
        user.save().then(function (result) {
          res.json({
            'user': result
          }); //res.status(200).send({mssage: 'update successful'});
        })["catch"](function (err) {
          console.log(err.code);
          res.send({
            error: true,
            message: 'failed to verify data'
          });
        });
        return res.json({
          error: false,
          code: 201,
          status: 'success',
          message: 'User Verified'
        });
      }
    });
  }])["catch"](function (err) {
    console.log(err);
    res.send({
      err: err
    });
  });
}; // Verify user by token
// Register user


exports.verify_user = verify_user;

var reg_user2 = function reg_user2(req, res, next) {
  console.log('clicked function', req.body);

  if (!req.body.name || !req.body.email || !req.body.phoneNumber || !req.body.password || !req.body.role) {
    // console.log("All not filled");
    return res.status(401).send({
      error: true,
      message: "Name, email, phone, password and role are required"
    });
  }

  var user = new _UserModel["default"]({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: _UserModel["default"].hashPassword(req.body.password),
    // image_url: req.body.image_url,
    role: req.body.role,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  _UserModel["default"].findOne({
    email: req.body.email
  }).exec(function (err, doc, next) {
    // let userEmail = req.body.email;
    console.log('error caused', err);

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
      console.log("dataaaaaa", dataRes); // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });

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
        var data = {
          from: 'Epron Admin <empron@gmail.com>',
          to: req.body.email,
          subject: 'Registration validation',
          text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epron.netlify.app/users/verify-user/' + token + '\n\n' + 'If you did not request this, please ignore this email and your registration will be canceled'
        };
        mailgun.messages().send(data, function (error, body) {
          if (error) {
            console.log(error);
            return res.send({
              error: error
            });
          } //   console.log('Mailgun body', body);
          //   console.log('Mailgun dataaaaa', data);


          res.json({
            error: false,
            code: 201,
            status: 'success',
            message: 'Token sent to your email'
          }); //   res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
        });
      }])["catch"](function (err) {
        console.log(err);
        return res.send({
          err: err
        });
      });
    })["catch"](function (err) {
      console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
      return res.send({
        error: true,
        code: 401,
        message: "Failed to add new user"
      });
    });
  });
}; // Registration ends 
// login for user


exports.reg_user2 = reg_user2;

var login_user = function login_user(req, res) {
  var promise = _UserModel["default"].findOne({
    email: req.body.email,
    blocked: false
  }).exec();

  promise.then(function (doc) {
    if (doc) {
      if (doc.verified === false) {
        return res.json({
          error: true,
          message: 'you are not verified',
          code: 403
        });
      }

      if (doc.blocked === true) {
        return res.json({
          error: true,
          message: 'you have been disabled',
          code: 405
        });
      }

      if (doc.isValid(req.body.password)) {
        // const token = jwt.sign({ email: doc.get('email'), _id: doc._id }, 'secret');
        var token = _jsonwebtoken["default"].sign({
          email: doc.email,
          _id: doc._id
        }, 'secret');

        return res.json({
          token: token,
          error: false,
          user: doc,
          message: 'login successful',
          code: 201
        }); // return res.status(201).json({ error: false, message: 'Successful' });
      } else {
        return res.send({
          error: true,
          message: 'Invalid credentials'
        });
      }
    } else {
      return res.send({
        error: true,
        message: 'User not found'
      });
    }
  }) // promise.catch(function(err)) {
  //         return res.status(501).json({message: 'Some internal server error'});
  // }
  ["catch"](function (err) {
    res.send({
      error: true,
      message: 'Some internal error'
    });
  });
};

exports.login_user = login_user;
//# sourceMappingURL=user.access.js.map