
// const express = require('express');
import express from 'express';
import jwt from 'jsonwebtoken';
// import { fetch_collection_centers_by_userid } from '../collectioncenter/collection.controllers.js';

import { 
    approved_documents_oem,
    asign_collection_center_to_recyclers,
    asign_recycler_to_collection_center,
    block_user,
    dashboard_counts,
    disapprove_documents_oem,
    fetch_all_admin_users,
    fetch_all_categories, 
    fetch_all_loged_ewaste, 
    fetch_all_pickups_accepted, 
    fetch_all_sub_categories, 
    fetch_all_sub_categories_by_categoryid, 
    fetch_all_users,
    fetch_collection_center_byId,
    fetch_logewaste_weight_by_recyclers,
    fetch_logewaste_weight_by_recyclers_id,
    // fetch_recyclers_and_colection_center,
    fetch_recyclers_with_colection_center,
    fetch_users_loged_equiptment_oem,
    fetch_user_loged_equiptment_paid_status_oem,
    find_all_collection_center,
    find_all_user_based_on_verified_status,
    // find_user_by_date,
    find_user_by_date_range,
    find_user_by_specific_date,
    new_category, 
    new_sub_cateory,
    reg_user_erpon,
    remove_collection_center_recycler_user,
    remove_log_category,
    remove_log_type,
    remove_unverified_user,
    search_logged_equipment_with_varibles,
    search_user_varibles,
    // remove_recycler_to_collection_center,
    unblock_user,
    update_category,
    update_sub_category
} from './epron.controllers.js';



const router = express.Router();



router.get('/categories', fetch_all_categories);
router.post('/create_category', new_category);
router.post('/types', new_sub_cateory);
router.get('/get_all_types', fetch_all_sub_categories);
router.get('/get_all_category_types/:id', fetch_all_sub_categories_by_categoryid);
router.delete('/delete_type/:id', remove_log_type);
router.put('/update_category/:id', update_category);
router.get('/get_all_ewastes', fetch_all_loged_ewaste);
router.put('/update_subcategory/:id', update_sub_category);
router.delete('/delete_category/:id', remove_log_category);
router.get('/all_users', fetch_all_users);
router.get('/search-users-name-email', search_user_varibles);
router.post('/user-reg', reg_user_erpon);
router.get('/admin_users', fetch_all_admin_users);
router.patch('/unblock_user/:id', unblock_user);
router.patch('/block_user/:id', block_user);

router.get('/filter_by_date_range', find_user_by_date_range);
router.get('/filter_by_date', find_user_by_specific_date);

router.get('/fetch-all-logged-equipments', fetch_users_loged_equiptment_oem);
router.get('/fetch-all-logged-equipments-paid-status', fetch_user_loged_equiptment_paid_status_oem);

router.get('/search-equipments-logged', search_logged_equipment_with_varibles)


router.get('/all_collection_center', find_all_collection_center);
router.get('/fetch-recycler-with-collection-centers/:collection_center/:recycler_id', fetch_recyclers_with_colection_center);
router.get('/fetch_one_center_byid/:id', fetch_collection_center_byId);
router.patch('/asign_recycler', asign_recycler_to_collection_center);
// router.patch('/remove_recycler', remove_recycler_to_collection_center);

router.delete('/removed-unverified_user/:id', remove_unverified_user);

router.get('/fetct-users-verified-status', find_all_user_based_on_verified_status);

router.get('/all_accepted_requests', fetch_all_pickups_accepted);
router.get('/recyclers-logged-waste-weight', fetch_logewaste_weight_by_recyclers);
router.get('/recyclers-logged-waste-weight-by-userid/:id', fetch_logewaste_weight_by_recyclers_id);


// Look at this again
router.patch('/asign_center_to_recycler', asign_collection_center_to_recyclers);
router.patch('/remove_collection_center', remove_collection_center_recycler_user);
router.patch('/approve-documents/:id', approved_documents_oem);
router.patch('/disapprove-documents/:id', disapprove_documents_oem);

router.get('/dashboard-counts', dashboard_counts);




// module.exports = router;
export default router