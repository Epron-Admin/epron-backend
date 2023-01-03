import express from 'express';
import {
    fetch_all_pickup_by_location, 
    fetch_ewaste_by_collection_center,
    fetch_ewaste_by_collection_center_pickedup,
    fetch_ewaste_by_collection_center_ready_for_pickup,
    fetch_logewaste_weight_by_recycler,
    fetch_recyclers_collection_center,
    log_weight_from_collection_center_ewaste,
    update_ewaste_to_pickedup_by_recycler
} from './recyclers.controllers.js';


const router = express.Router();


// router.post('/request-pickup', request_pickup);
router.get('/pickups', fetch_all_pickup_by_location);
router.get('/center_ewastes', fetch_ewaste_by_collection_center);
router.get('/center-ewastes-pickedup', fetch_ewaste_by_collection_center_pickedup);
router.get('/center-ewastes-ready-pickup', fetch_ewaste_by_collection_center_ready_for_pickup);
router.post('/log_ewaste_weight', log_weight_from_collection_center_ewaste);
router.get('/recycler-logged-waste-weight/:recycler_id', fetch_logewaste_weight_by_recycler);
router.get('/recycler-collection-centers/:recycler_id', fetch_recyclers_collection_center);
router.patch('/picked-up', update_ewaste_to_pickedup_by_recycler);


export default router