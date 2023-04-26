"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveDate = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _LogModel = _interopRequireDefault(require("./models/Log.model.js"));

var _EpuipModel = _interopRequireDefault(require("./models/Epuip.model.js"));

var _fs = _interopRequireDefault(require("fs"));

var _multer = _interopRequireDefault(require("multer"));

var _fastCsv = _interopRequireDefault(require("fast-csv"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _CategoryTypesModel = _interopRequireDefault(require("./models/CategoryTypes.model.js"));

var _CategoryModel = _interopRequireDefault(require("./models/Category.model.js"));

// const IncomingForm = require ('/formidable');
// import formidable from 'formidable';
// import {Cloudinary} from './cloudinaryConfig';
var errorOccured = false;
// const upload = multer({ dest: 'uploads/' });
var upload = (0, _multer["default"])({
  dest: 'tmp/csv/'
}); // const formidable = require ('formidable');
// const path = require ('path');
// const express = require ('express');

var cvsConvertData;
var user_id; // let sub_cat;

var general = [];

var router = _express["default"].Router(); // const fileName;


router.post('/upload-csv1', upload.single('file'), function (req, res) {
  console.log("Requestttttttttttt", req.file);
  if (!req.file) return res.status(400).send('No files were uploaded.');
  var fileRows = []; // open uploaded file

  _fastCsv["default"].parseFile(req.file.path).on("data", function (data) {
    fileRows.push(data); // push each row
  }).on("end", function () {
    console.log(fileRows);

    _fs["default"].unlinkSync(req.file.path); // remove temp file
    //process "fileRows" and respond


    var pin = Math.random().toString(36).slice(2);
    fileRows.push(pin);

    _LogModel["default"].insertMany(fileRows).then(function () {
      console.log("Data saved");
      return res.status(201).send({
        data: fileRow,
        success: 'Data saved.'
      });
    })["catch"](function (error) {
      res.status(500).send({
        message: "failure",
        error: error
      });
    });

    res.json(fileRows);
  });
});
router.post('/upload-csv2', upload.single('file'), function (req, res) {
  if (!req.file) return res.status(400).send('No files were uploaded.');
  console.log("Requestttttttttttt", req.file);

  _csvtojson["default"].parseFile(req.file.path).then(function (csvData) {
    console.log("csv datatttttttt", csvData);

    _LogModel["default"].insertMany(csvData).then(function () {
      console.log("Data saved");
      return res.status(200).send({
        success: 'Data saved.'
      });
    })["catch"](function (error) {
      res.status(500).send({
        message: "failure",
        error: error
      });
    });
  });
});

var moveDate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var pin, army, i, ton_weight, obj, payable;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(" Csv data", cvsConvertData);
            pin = Math.random().toString(36).slice(2);
            army = [];
            i = 0;

          case 4:
            if (!(i < cvsConvertData.length)) {
              _context.next = 23;
              break;
            }

            ton_weight = void 0;

            if (cvsConvertData[i]['unit'] === 'kg') {
              ton_weight = 0.00110231 * cvsConvertData[i]['weight'];
            }

            if (cvsConvertData[i]['unit'] === 'g') {
              ton_weight = 0.0000011023 * cvsConvertData[i]['weight'];
            } // const total_weight = ton_weight;


            obj = {};
            obj.category_id = cvsConvertData[i]['category_id'];
            obj.sub_category_id = cvsConvertData[i]['sub_category_id'];
            obj.unit = cvsConvertData[i]['unit'];
            obj.quantity = Number(cvsConvertData[i]['quantity']);
            obj.weight = Number(cvsConvertData[i]['weight']);
            // obj.unit_price = jsonObj[i]['unit_price'],
            obj.price = Number(cvsConvertData[i]['price']);
            obj.total = Number(obj.price * ton_weight);
            obj.equipment_pin = pin;
            obj.user_id = user_id;
            _context.next = 20;
            return army.push(obj);

          case 20:
            i++;
            _context.next = 4;
            break;

          case 23:
            // console.log("GENERAL ASEMBLY", general);
            payable = army.reduce(function (previousValue, currentValue) {
              return previousValue + currentValue.total;
            }, 0);
            console.log("payable", payable); // var newArray = general.filter((el) => {
            //     return el.category_id != undefined &&
            //         el.sub_category_id != undefined 
            //         // el.unit &&
            //         // el.quantity &&
            //         // el.weight &&
            //         // el.price &&
            //         // el.total &&
            //         // el.equipment_pin &&
            //         // el.user_id;
            //     }
            // );

            console.log("saved jason", army);

            _LogModel["default"].insertMany(army).then(function () {
              console.log("saved datatatatatatattttttt", army);
              res.status(200).send({
                message: "Successfully Uploaded bulk equipment!",
                payable: payable
              });
            }); // const payable = army;
            // res.status(200).send({
            //     message: "Successfully Uploaded!",
            // });
            // let payable = army.reduce(function (previousValue, currentValue) {
            //     return previousValue + currentValue.total;
            //   }, 0);
            //   console.log("payable", payable);
            //   Log.insertMany(army).then(() => {
            //     res.status(200).send({
            //         message: "Successfully Uploaded!",
            //         payable: payable
            //     });
            // }).catch((error) => {
            //     res.status(500).send({
            //         message: "failure",
            //         error
            //     });
            // });


          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function moveDate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.moveDate = moveDate;
router.post('/upload-csv-bulk', upload.single('file'), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("reqest jsonnnnnn", req.file);

            if (req.file) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", res.status(400).send('No files were uploaded.'));

          case 3:
            user_id = req.body.user_id;
            _context4.next = 6;
            return (0, _csvtojson["default"])().fromFile(req.file.path).then( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(jsonObj) {
                var typeData, _loop, i;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _fs["default"].unlinkSync(req.file.path); // remove temp file


                        console.log("reqest jsonnnnnn", jsonObj);
                        cvsConvertData = jsonObj;

                        _loop = function _loop() {
                          var ton_weight = void 0;

                          if (cvsConvertData[i]['unit'] === 'kg') {
                            ton_weight = 0.00110231 * cvsConvertData[i]['weight'];
                          }

                          if (cvsConvertData[i]['unit'] === 'g') {
                            ton_weight = 0.0000011023 * cvsConvertData[i]['weight'];
                          }

                          _CategoryTypesModel["default"].find({}).exec( /*#__PURE__*/function () {
                            var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, type) {
                              return _regenerator["default"].wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      if (!err) {
                                        _context2.next = 3;
                                        break;
                                      }

                                      console.log(err);
                                      return _context2.abrupt("return", res.json({
                                        error: true,
                                        status: 401,
                                        message: "Error occured in getting sub category"
                                      }));

                                    case 3:
                                      if (type) {
                                        _context2.next = 7;
                                        break;
                                      }

                                      return _context2.abrupt("return", res.json({
                                        error: true,
                                        status: 404,
                                        message: "Can not find sub category"
                                      }));

                                    case 7:
                                      console.log("Typessssssssssssssss", type);
                                      console.log("Index data", jsonObj);
                                      type.filter(function (element) {
                                        // console.log("element", element)
                                        cvsConvertData.forEach(function (object) {
                                          // console.log("Objecttttttttttt", object);
                                          if (element.type_code === object.type_code) {
                                            object.sub_category_id = element._id;
                                            object.category_id = element.category_id;
                                            object.price = element.price; // object.unit = element.unit;
                                            // object.weight = element.ton_weight;

                                            object.user_id = req.body.user_id;
                                            object.total = Number(element.price * ton_weight);
                                          } // console.log("elementary object", element)
                                          // moveDate(req, res)

                                        });
                                        console.log("Adjusted array", cvsConvertData);
                                        var payable = cvsConvertData.reduce(function (previousValue, currentValue) {
                                          return previousValue + currentValue.total;
                                        }, 0);
                                        console.log("payable", payable, cvsConvertData);

                                        _LogModel["default"].create(cvsConvertData[0]).then(function () {
                                          console.log("saved datatatatatatattttttt", cvsConvertData); // return res.json({error: false, status: 200,  payable: payable, message: "Successfully Uploaded bulk equipment!" });
                                          // res.status(200).send({
                                          //     message: "Successfully Uploaded bulk equipment!",
                                          //     payable: payable
                                          // });
                                        });
                                      }); //  moveDate(req, res);
                                      // console.log("GENERAL ASEMBLY", general);

                                    case 10:
                                    case "end":
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2);
                            }));

                            return function (_x6, _x7) {
                              return _ref4.apply(this, arguments);
                            };
                          }()); // let payable = general;
                          // res.status(200).send({
                          //     message: "Successfully Uploaded!",
                          // });

                        };

                        for (i = 0; i < jsonObj.length; i++) {
                          _loop();
                        } // console.log("New category array", army2);
                        // console.log("armyyyyyyy", army);
                        // res.status(200).send({
                        //     message: "Got category succefully!",
                        // });


                      case 5:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"](function (error) {
              res.status(500).send({
                message: "failure",
                error: error
              });
            });

          case 6:
            res.status(200).send({
              message: "Successfully Uploaded bulk equipment!" // payable: payable

            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('/upload-csv', upload.single('file'), /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (req.file) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", res.status(400).send('No files were uploaded.'));

          case 2:
            _context5.next = 4;
            return (0, _csvtojson["default"])().fromFile(req.file.path).then(function (jsonObj) {
              _fs["default"].unlinkSync(req.file.path); // remove temp file
              // console.log("jsonnnnnnnnnnnnnnnnn", jsonObj);


              var pin = Math.random().toString(36).slice(2);
              var army = [];

              for (var i = 0; i < jsonObj.length; i++) {
                var obj = {}; // obj.category_id = jsonObj[i]['category_id'],

                obj.category_id = jsonObj[i]['category_id'], obj.category_name = jsonObj[i]['category_name'], obj.sub_category_id = jsonObj[i]['sub_category_id'], obj.sub_category_name = jsonObj[i]['sub_category_name'], obj.quantity = jsonObj[i]['quantity'], obj.weight = jsonObj[i]['weight'], // obj.unit_price = jsonObj[i]['unit_price'],
                obj.price = jsonObj[i]['price'], obj.total = obj.price * obj.weight, obj.equipment_pin = pin, obj.user_id = jsonObj[i]['user_id'], army.push(obj);
              } // console.log("armyyyyyyy", army);
              // const payable = army.


              var payable = army.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.total;
              }, 0);
              console.log("payable", payable);

              _LogModel["default"].insertMany(army).then(function () {
                res.status(200).send({
                  message: "Successfully Uploaded!",
                  payable: payable
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

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}()); // module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=uploads.js.map