
import jwt from 'jsonwebtoken';
// import express from 'express';

// const router = express.Router();


const validationFunc = (req, res, next) => {
    let token = req.body.token || req.query.token;
    let decoded = jwt.decode(token);
    req.decoded = decoded;
    if (req.decoded === null) {
        return res.status(401).send("Access denied");
    } else {
        // console.log('Decoded', req.decoded);
        next();
    }

};

// const validationFunc2 = (req, res, next) => {
//     let token = req.body.token || req.query.token;
//     let decoded = jwt.decode(token);
//     req.decoded = decoded;
//     next();
// };


export { validationFunc };
// export { validationFunc2 };