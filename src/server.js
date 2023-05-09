import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
import connectDB from './config/db.js';
// import balocodes from 'balocodes/express';
// const accessRouter = require('./controllers/access/access.router.js');
// const userRouter = require('./controllers/users/users.router.js');


import accessRouter from './controllers/access/access.router.js';
import userRouter from './controllers/users/users.router.js';
import pickupRouter from './controllers/requestpickup/pickups.router.js';
import epronRouter from './controllers/epron/epron.router.js';
import recyclersRouter from './controllers/recyclers/recyclers.router.js';
import collectionRouter from './controllers/collectioncenter/collection.router.js';
import uploadRouter from './uploads.js';
import dotenv from 'dotenv';
// import uploadRouter from './sr./uploads.jsmport uploadRouter from './upload';
// import verifier from 'email-verifier';

//Load config files
dotenv.config();
// dotenv.config({ path: './config/config.env'});


const app = express();

connectDB();
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/access', accessRouter);
app.use('/user', userRouter); 
app.use('/pickup', pickupRouter); 
app.use('/epron', epronRouter); 
app.use('/recyclers', recyclersRouter);
app.use('/centers', collectionRouter); 
app.use('/upload', uploadRouter);

app.use('*', function (req, res) {
	res.send('Welcome to Epron Backend, route not found');
});


const server = app.listen(port, () => console.log(`Express server running in ${process.env.NODE_ENV} mode on port ${port}`)); 

export default server

// module.exports = server;