
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
