import async from 'async';
import Pelpay from '../models/Pelpay.model.js';
import jwt from 'jsonwebtoken';



const validationFunc = (req, res, next) => {
    // let token = req.body.token || req.query.token;
    let token = req.headers.authorization.split(" ")[1];
    // console.log('Headers', req.headers.authorization); 
    // console.log('SSSSSSSSSSSSSS', token);
    let decoded = jwt.decode(token);
    req.decoded = decoded;
   if (req.decoded === null) {
        return res.status(401).send("Access denied");
    } else {
        // console.log('Decoded', req.decoded);
        next();
    }

};


export { validationFunc };



// const jwt = require("jsonwebtoken");


// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// export { validationFunc };
// module.exports = verifyToken;
