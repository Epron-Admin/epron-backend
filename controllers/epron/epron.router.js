
// const express = require('express');
import express from 'express';
import jwt from 'jsonwebtoken';
// import { fetch_collection_centers_by_userid } from '../collectioncenter/collection.controllers.js';

import { 
    asign_collection_center_to_recyclers,
    asign_recycler_to_collection_center,
    block_user,
    fetch_all_admin_users,
    fetch_all_categories, 
    fetch_all_loged_ewaste, 
    fetch_all_pickups_accepted, 
    fetch_all_sub_categories, 
    fetch_all_sub_categories_by_categoryid, 
    fetch_all_users,
    fetch_collection_center_byId,
    fetch_logewaste_weight_by_recyclers,
    fetch_recyclers_and_colection_center,
    find_all_collection_center,
    new_category, 
    new_sub_cateory,
    reg_user_erpon,
    remove_collection_center_recycler_user,
    remove_log_category,
    remove_log_type,
    remove_recycler_to_collection_center,
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
router.post('/user-reg', reg_user_erpon);
router.get('/admin_users', fetch_all_admin_users);
router.patch('/unblock_user/:id', unblock_user);
router.patch('/block_user/:id', block_user);


router.get('/all_collection_center', find_all_collection_center);
router.get('/fetch-recycler-with-collection-centers/:collection_center/:recycler_id', fetch_recyclers_and_colection_center);
router.get('/fetch_one_center_byid/:id', fetch_collection_center_byId);
router.patch('/asign_recycler', asign_recycler_to_collection_center);
router.patch('/remove_recycler', remove_recycler_to_collection_center);

router.get('/all_accepted_requests', fetch_all_pickups_accepted);
router.get('/recyclers-logged-waste-weight', fetch_logewaste_weight_by_recyclers);


// Look at this again
router.patch('/asign_center_to_recycler', asign_collection_center_to_recyclers);
router.patch('/remove_collection_center', remove_collection_center_recycler_user);




// module.exports = router;
export default router