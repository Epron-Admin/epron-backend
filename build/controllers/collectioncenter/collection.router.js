"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _collectionControllers = require("./collection.controllers.js");

// const express = require('express');
// import { find_all_collection_center } from '../epron/epron.controllers.js';
var router = _express["default"].Router();

router.post('/log-one-ewaste', _collectionControllers.log_single_ewaste); // router.post('/add_collection_center', new_collection_ceneter);

router.post('/excel-bulk-ewaste', _collectionControllers.excel_bulk_ewaste);
router.get('/fetch_ewaste_userid/:id', _collectionControllers.fetch_ewaste_by_user);
router.put('/update-eqaste/:id', _collectionControllers.update_logged_ewaste);
router["delete"]('/delete_ewaste/:id', _collectionControllers.remove_log_ewaste); // router.get('/fetch_centers', fetch_all_collection_centers);

router.get('/user_centers/:id', _collectionControllers.fetch_collection_centers_by_userid); // router.delete('/delete_center/:id', remove_collection_center);
// router.put('/update_center/:id', update_center);

router.patch('/mark-pickup-completed', _collectionControllers.mark_pickup_as_completed);
router.patch('/accept_pickup', _collectionControllers.accept_request_pickup);
router.patch('/ready-for-pickup', _collectionControllers.update_ewaste_to_ready_pickup); // router.get('/all_collection_center', find_all_collection_center);
// module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=collection.router.js.map