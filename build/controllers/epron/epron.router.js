"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _epronControllers = require("./epron.controllers.js");

// const express = require('express');
// import { fetch_collection_centers_by_userid } from '../collectioncenter/collection.controllers.js';
var router = _express["default"].Router();

router.get('/categories', _epronControllers.fetch_all_categories);
router.post('/create_category', _epronControllers.new_category);
router.post('/types', _epronControllers.new_sub_cateory);
router.get('/get_all_types', _epronControllers.fetch_all_sub_categories);
router.get('/get_all_category_types/:id', _epronControllers.fetch_all_sub_categories_by_categoryid);
router["delete"]('/delete_type/:id', _epronControllers.remove_log_type);
router.put('/update_category/:id', _epronControllers.update_category);
router.get('/get_all_ewastes', _epronControllers.fetch_all_loged_ewaste);
router.put('/update_subcategory/:id', _epronControllers.update_sub_category);
router["delete"]('/delete_category/:id', _epronControllers.remove_log_category);
router.get('/all_users', _epronControllers.fetch_all_users);
router.get('/search-users-name-email', _epronControllers.search_user_varibles);
router.post('/user-reg', _epronControllers.reg_user_erpon);
router.get('/admin_users', _epronControllers.fetch_all_admin_users);
router.patch('/unblock_user/:id', _epronControllers.unblock_user);
router.patch('/block_user/:id', _epronControllers.block_user);
router.get('/filter_by_date_range', _epronControllers.find_user_by_date_range);
router.get('/filter_by_date', _epronControllers.find_user_by_specific_date);
router.get('/filter_equipment_by_date', _epronControllers.find_equipment_by_date_range);
router.get('/filter_ewaste_by_date', _epronControllers.search_ewaste_by_date_range);
router.get('/filter_recyclerewaste_by_date', _epronControllers.search_recyclerEwaste_by_date_range);
router.get('/filter_requestedpickups_by_date', _epronControllers.search_requestedPickups_by_date_range);
router.get('/fetch-all-logged-equipments', _epronControllers.fetch_users_loged_equiptment_oem);
router.get('/fetch-all-logged-equipments-paid-status', _epronControllers.fetch_user_loged_equiptment_paid_status_oem);
router.get('/search-equipments-logged', _epronControllers.search_logged_equipment_with_varibles);
router.get('/pickups_based_on_acceptance', _epronControllers.fetch_all_pickup_based_on_acceptance);
router.get('/all_collection_center', _epronControllers.find_all_collection_center);
router.get('/fetch-recycler-with-collection-centers/:collection_center/:recycler_id', _epronControllers.fetch_recyclers_with_colection_center);
router.get('/fetch_one_center_byid/:id', _epronControllers.fetch_collection_center_byId); // router.patch('/asign_recycler', asign_recycler_to_collection_center);
// router.patch('/remove_recycler', remove_recycler_to_collection_center);

router["delete"]('/removed-unverified_user/:id', _epronControllers.remove_unverified_user);
router.get('/fetct-users-verified-status', _epronControllers.find_all_user_based_on_verified_status);
router.get('/all_accepted_requests', _epronControllers.fetch_all_pickups_accepted);
router.get('/recyclers-logged-waste-weight', _epronControllers.fetch_logewaste_weight_by_recyclers);
router.get('/recyclers-logged-waste-weight-by-userid/:id', _epronControllers.fetch_logewaste_weight_by_recyclers_id); // Look at this again

router.patch('/asign_center_to_recycler', _epronControllers.asign_collection_center_to_recyclers);
router.patch('/remove_collection_center', _epronControllers.remove_collection_center_recycler_user);
router.patch('/approve-documents/:id', _epronControllers.approved_documents_oem);
router.patch('/disapprove-documents/:id', _epronControllers.disapprove_documents_oem);
router.get('/dashboard-counts', _epronControllers.dashboard_counts); // module.exports = router;

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=epron.router.js.map