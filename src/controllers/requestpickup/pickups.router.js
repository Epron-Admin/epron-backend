import express from 'express';
// const express = require('express');


import {
    fetch_all_pickup,
    fetch_all_pickup_accepted,
    fetch_all_pickup_based_on_acceptance,
    fetch_all_pickup_based_on_location,
    fetch_all_pickup_based_on_location_accepted,
    fetch_all_pickup_based_on_location_anduser,
    fetch_all_pickup_based_on_location_unaccepted,
    fetch_all_pickup_status_completed_or_not,
    // fetch_all_pickup_based_on_location_acepted,
    request_pickup,
	} from './pickups.controllers.js';




const router = express.Router();


router.post('/request-pickup', request_pickup);
router.get('/pickups', fetch_all_pickup);
router.get('/pickups-completed-or-not', fetch_all_pickup_status_completed_or_not);
router.get('/pickups/:location', fetch_all_pickup_based_on_location);
router.get('/unaccepted_pickups_only/:location', fetch_all_pickup_based_on_location_unaccepted);
router.get('/accepted_pickups/:location', fetch_all_pickup_based_on_location_accepted);
router.get('/accepted_pickups', fetch_all_pickup_accepted);
router.get('/pickups_based_on_acceptance', fetch_all_pickup_based_on_acceptance);
router.get('/accepted_pickup_byuser/:id/:location', fetch_all_pickup_based_on_location_anduser);




// module.exports = router;

export default router