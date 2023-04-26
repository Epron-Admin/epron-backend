"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _recyclersControllers = require("./recyclers.controllers.js");

var router = _express["default"].Router(); // router.post('/request-pickup', request_pickup);


router.get('/pickups', _recyclersControllers.fetch_all_pickup_by_location);
router.get('/center_ewastes', _recyclersControllers.fetch_ewaste_by_collection_center);
router.get('/center-ewastes-pickedup', _recyclersControllers.fetch_ewaste_by_collection_center_pickedup);
router.get('/center-ewastes-ready-pickup/:id', _recyclersControllers.fetch_ewaste_by_collection_center_ready_for_pickup);
router.post('/log_ewaste_weight', _recyclersControllers.log_weight_from_collection_center_ewaste);
router.get('/recycler-logged-waste-weight/:recycler_id', _recyclersControllers.fetch_logewaste_weight_by_recycler);
router.get('/recycler-collection-centers/:recycler_id', _recyclersControllers.fetch_recyclers_collection_center);
router.patch('/picked-up', _recyclersControllers.update_ewaste_to_pickedup_by_recycler);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=recyclers.router.js.map