
// const express = require('express');
import express from 'express';
// import { find_all_collection_center } from '../epron/epron.controllers.js';
import { 
    accept_request_pickup,
    excel_bulk_ewaste,
    // fetch_all_collection_centers, 
    fetch_collection_centers_by_userid, 
    fetch_ewaste_by_user, 
    log_single_ewaste, 
    mark_pickup_as_completed, 
    // new_collection_ceneter,
    // remove_collection_center,
    remove_log_ewaste,
    update_ewaste_to_ready_pickup,
    // update_center,
    update_logged_ewaste
 } from './collection.controllers.js';




const router = express.Router();



router.post('/log-one-ewaste', log_single_ewaste);
// router.post('/add_collection_center', new_collection_ceneter);
router.post('/excel-bulk-ewaste', excel_bulk_ewaste);
router.get('/fetch_ewaste_userid/:id', fetch_ewaste_by_user);
router.put('/update-eqaste/:id', update_logged_ewaste);
router.delete('/delete_ewaste/:id', remove_log_ewaste);
// router.get('/fetch_centers', fetch_all_collection_centers);
router.get('/user_centers/:id', fetch_collection_centers_by_userid); 
// router.delete('/delete_center/:id', remove_collection_center);
// router.put('/update_center/:id', update_center);

router.patch('/mark-pickup-completed', mark_pickup_as_completed);

router.patch('/accept_pickup', accept_request_pickup);

router.patch('/ready-for-pickup', update_ewaste_to_ready_pickup);

// router.get('/all_collection_center', find_all_collection_center);




// module.exports = router;
export default router