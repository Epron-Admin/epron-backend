import express from 'express';
import {
    fetch_all_pickup_by_location, 
    fetch_ewaste_by_collection_center,
    fetch_logewaste_weight_by_recycler,
    log_ewaste_from_collection_weight
} from './recyclers.controllers.js';


const router = express.Router();



// router.post('/request-pickup', request_pickup);
router.get('/pickups', fetch_all_pickup_by_location);
router.get('/center_ewastes', fetch_ewaste_by_collection_center);
router.post('/log_ewaste_weight', log_ewaste_from_collection_weight);
router.get('/recycler-logged-waste-weight/:recycler_id', fetch_logewaste_weight_by_recycler)


export default router