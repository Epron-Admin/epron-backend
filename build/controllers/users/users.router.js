"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _usersControllers = require("./users.controllers.js");

var _middleware = require("../../middleware/middleware.js");

// const express = require('express');
// import { validationFunc } from '../../middleware/middlewareNoBearer';
var router = _express["default"].Router();

router.post('/forgot-password', _usersControllers.forgot_password);
router.post('/reset-password/:token', _usersControllers.password_reset);
router.get('/u-profile/:id', _usersControllers.user_profile); // router.get('/veryfy', mail1);
// router.use('*', validationFunc);

router.put('/edit-profile/:id', _usersControllers.update_profile);
router.put('/update-password', _usersControllers.change_password);
router.get('/countries', _usersControllers.get_countries);
router.get('/states/:isoCode', _usersControllers.get_states);
router.get('/cities/:isoCode/:id', _usersControllers.get_cities);
router.get('/naija_states', _usersControllers.get_naija_states);
router.get('/naija_lgas/:state', _usersControllers.get_naija_lgas);
router.get('/all_naija', _usersControllers.get_naija);
router.post('/log-one-equipment', _usersControllers.log_equiptment);
router.get('/logged_equiptment_by_user_id/:id', _usersControllers.fetch_user_loged_equiptment_byid);
router.get('/logged_equiptment_by_user_id_status/:id', _usersControllers.fetch_user_loged_equiptment_byid_paid_status);
router.get('/logged-equiptments', _usersControllers.fetch_all_loged_equiptments);
router.put('/update-log-byid/:id', _usersControllers.update_logged_equipment);
router["delete"]('/delete-log/:id', _usersControllers.remove_log_equipment);
router.post('/bulk-log', _usersControllers.bulk_log_upload);
router.post('/bulk-log2', _usersControllers.bulk_log_upload2);
router.post('/bulk-log3', _usersControllers.bulk_log_upload3);
router.patch('/update-bulk-payments/:pin/:ref', _usersControllers.update_multiple_payment_options);
router.get("/find_user_by_role/:role", _usersControllers.find_user_by_role);
router.get("/user/:id", _usersControllers.find_user_byid);
router.get('/collection_by_location/:lga', _usersControllers.find_collection_center_by_location);
router.post('/excel-equipment', _usersControllers.excel_bulk_equipment);
router.get('/payment-amount/:pin', _usersControllers.get_price_of_equipment_for_payment); // paystck payment

router.get('/customers', _usersControllers.get_customers);
router.post('/init-transaction', _usersControllers.initialize_transanction);
router.patch('/update-payment-status/:pin/:ref', _usersControllers.update_payment_option); // module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=users.router.js.map