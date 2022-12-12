// const IncomingForm = require ('/formidable');

// import formidable from 'formidable';
import path from 'path';
import express from 'express';
import Log from './models/Log.model.js';
import Epuip from './models/Epuip.model.js';
// import {Cloudinary} from './cloudinaryConfig';
import fs from 'fs';
let errorOccured = false;

import multer from 'multer';  
import csv from 'fast-csv';
import csvtojson from 'csvtojson';
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ dest: 'tmp/csv/' });

// const formidable = require ('formidable');
// const path = require ('path');
// const express = require ('express');


const router = express.Router();
// const fileName;


router.post('/upload-csv1', upload.single('file'), function (req, res) {
    console.log("Requestttttttttttt", req.file)
    if (!req.file)
        return res.status(400).send('No files were uploaded.');
    const fileRows = [];
  
    // open uploaded file
    csv.parseFile(req.file.path)
      .on("data", function (data) {
        fileRows.push(data); // push each row
      })
      .on("end", function () {
        console.log(fileRows)
        fs.unlinkSync(req.file.path);   // remove temp file
        //process "fileRows" and respond

        const pin = Math.random().toString(36).slice(2);
        fileRows.push(pin);

        Log.insertMany(fileRows).then(() => {
            console.log("Data saved");
            return res.status(201).send({data: fileRow, success: 'Data saved.'});
        }).catch((error) => {
            res.status(500).send({
                message: "failure",
                error
            });
        });
        res.json(fileRows);
    })
});


router.post('/upload-csv2', upload.single('file'), function (req, res) {
    if (!req.file)
        return res.status(400).send('No files were uploaded.');
    console.log("Requestttttttttttt", req.file)
     csvtojson
     .parseFile(req.file.path).then(csvData => {
        console.log("csv datatttttttt", csvData)
        Log.insertMany(csvData).then(() => {
            console.log("Data saved");
            return res.status(200).send({success: 'Data saved.'});
        }).catch((error) => {
            res.status(500).send({
                message: "failure",
                error
            });
        });
     })
});


router.post('/upload-csv', upload.single('file'), async function (req, res) {
    if (!req.file)
        return res.status(400).send('No files were uploaded.');
    // console.log("Requestttttttttttt", req.file)
    await csvtojson().fromFile(req.file.path).then((jsonObj)=>{
        fs.unlinkSync(req.file.path);   // remove temp file
        // console.log("jsonnnnnnnnnnnnnnnnn", jsonObj);
        const pin = Math.random().toString(36).slice(2);
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            // obj.category_id = jsonObj[i]['category_id'],
            obj.category_id = jsonObj[i]['category_id'],
            obj.category_name = jsonObj[i]['category_name'],
            obj.sub_category_id = jsonObj[i]['sub_category_id'],
            obj.sub_category_name = jsonObj[i]['sub_category_name'],
            obj.quantity= jsonObj[i]['quantity'],
            obj.weight = jsonObj[i]['weight'],
            // obj.unit_price = jsonObj[i]['unit_price'],
            obj.price = jsonObj[i]['price'],
            obj.total = obj.price * obj.weight * obj.quantity,
            obj.equipment_pin = pin,
            obj.user_id = jsonObj[i]['user_id'],
            army.push(obj);
        }
        // console.log("armyyyyyyy", army);
        // const payable = army.
        let payable = army.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
          }, 0);
          console.log("payable", payable);
          Log.insertMany(army).then(() => {
            res.status(200).send({
                message: "Successfully Uploaded!",
                payable: payable
            });
        }).catch((error) => {
            res.status(500).send({
                message: "failure",
                error
            });
        });
    }).catch((error) => {
        res.status(500).send({
            message: "failure",
            error: error
        });
    });
});

// module.exports = router;
export default router