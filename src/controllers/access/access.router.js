
// const express = require('express');
import express from 'express';
import jwt from 'jsonwebtoken';

import { reg_userx, login_user, generate_verify_token_validate_user, verify_user, reg_user_fake } from './user.access.js';



const router = express.Router();







router.post('/user-reg', reg_userx);
router.post('/user-login', login_user);
router.post('/verify-token', generate_verify_token_validate_user);
router.post('/verify/:token', verify_user);

router.post('/fake', reg_user_fake);




// module.exports = router;
export default router