import express from 'express';
// const express = require('express');


import {
		get_costomers, 
		// initialize_transanction, 
		user_profile, 
		update_profile,
		forgot_password,
		password_reset,
		change_password,
		get_countries,
		get_states,
		get_cities,
		log_equiptment,
		fetch_user_loged_equiptment_byid,
		fetch_all_loged_equiptments,
		update_logged_equipment,
		remove_log_equipment,
		bulk_log_upload,
		bulk_log_upload2,
		bulk_log_upload3,
		get_naija_states,
		get_naija_lgas,
		get_naija,
		find_user_by_role,
		find_user_byid
		// mail1
	} from './users.controllers.js';
import { validationFunc } from '../../middleware/middleware.js';
// import { validationFunc } from '../../middleware/middlewareNoBearer';




const router = express.Router();


router.post('/forgot-password', forgot_password);
router.post('/reset-password/:token', password_reset);

router.get('/costomers', get_costomers);
router.get('/u-profile/:id', user_profile);
// router.get('/veryfy', mail1);
// router.use('*', validationFunc);
router.put('/edit-profile/:id', update_profile);
router.put('/update-password', change_password);
router.get('/countries', get_countries);
router.get('/states/:isoCode', get_states);
router.get('/cities/:isoCode/:id', get_cities);

router.get('/naija_states', get_naija_states);
router.get('/naija_lgas/:state', get_naija_lgas);
router.get('/all_naija', get_naija);

router.post('/log-one-equipment', log_equiptment);
router.get('/logged_equiptment_by_user_id/:id', fetch_user_loged_equiptment_byid);
router.get('/logged-equiptments', fetch_all_loged_equiptments);
router.put('/update-log/:id', update_logged_equipment);
router.delete('/delete-log/:id', remove_log_equipment);
router.post('/bulk-log', bulk_log_upload);
router.post('/bulk-log2', bulk_log_upload2);
router.post('/bulk-log3', bulk_log_upload3);

router.get("/find_user_by_role", find_user_by_role);
router.get("/user/:id", find_user_byid);





// module.exports = router;

export default router