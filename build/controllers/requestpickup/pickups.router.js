"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _pickupsControllers = require("./pickups.controllers.js");

// const express = require('express');
var router = _express["default"].Router();

router.post('/request-pickup', _pickupsControllers.request_pickup);
router.get('/pickups', _pickupsControllers.fetch_all_pickup);
router.get('/pickups-completed-or-not', _pickupsControllers.fetch_all_pickup_status_completed_or_not);
router.get('/pickups/:location', _pickupsControllers.fetch_all_pickup_based_on_location);
router.get('/unaccepted_pickups_only/:location', _pickupsControllers.fetch_all_pickup_based_on_location_unaccepted);
router.get('/accepted_pickups/:location', _pickupsControllers.fetch_all_pickup_based_on_location_accepted);
router.get('/accepted_pickups', _pickupsControllers.fetch_all_pickup_accepted);
router.get('/pickups_based_on_acceptance', _pickupsControllers.fetch_all_pickup_based_on_acceptance);
router.get('/accepted_pickup_byuser/:id/:location', _pickupsControllers.fetch_all_pickup_based_on_location_anduser); // module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=pickups.router.js.map