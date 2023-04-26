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
import Types from './models/CategoryTypes.model.js';
import Categories from './models/Category.model.js';

let cvsConvertData;
let user_id;
// let sub_cat;
let general = [];




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


export const moveDate = async (req, res) => {
    console.log(" Csv data", cvsConvertData);

    const pin = Math.random().toString(36).slice(2);
    var army = [];
    for(var i = 0; i < cvsConvertData.length; i++ ) {
        let ton_weight;
        if (cvsConvertData[i]['unit'] === 'kg') {
            ton_weight = 0.00110231 * cvsConvertData[i]['weight'];
        }
        if (cvsConvertData[i]['unit'] === 'g') {
            ton_weight = 0.0000011023 * cvsConvertData[i]['weight'];
        }
        
        // const total_weight = ton_weight;
        var obj = {};
        obj.category_id = cvsConvertData[i]['category_id'],
        obj.sub_category_id = cvsConvertData[i]['sub_category_id'],
        obj.unit = cvsConvertData[i]['unit'],
        obj.quantity = Number(cvsConvertData[i]['quantity']),
        obj.weight = Number(cvsConvertData[i]['weight']),
        // obj.unit_price = jsonObj[i]['unit_price'],
        obj.price = Number(cvsConvertData[i]['price']),
        obj.total = Number(obj.price * ton_weight),
        obj.equipment_pin = pin,
        obj.user_id = user_id,
        await army.push(obj);
        // general.push(obj);
    }
    // console.log("GENERAL ASEMBLY", general);
    let payable = army.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue.total;
    }, 0);
    console.log("payable", payable);
    // var newArray = general.filter((el) => {
    //     return el.category_id != undefined &&
    //         el.sub_category_id != undefined 
    //         // el.unit &&
    //         // el.quantity &&
    //         // el.weight &&
    //         // el.price &&
    //         // el.total &&
    //         // el.equipment_pin &&
    //         // el.user_id;
    //     }
    // );
        console.log("saved jason", army)
        Log.insertMany(army).then(() => {
        console.log("saved datatatatatatattttttt", army)
        res.status(200).send({
            message: "Successfully Uploaded bulk equipment!",
            payable: payable
        });
    })

    // const payable = army;
    // res.status(200).send({
    //     message: "Successfully Uploaded!",
    // });
    // let payable = army.reduce(function (previousValue, currentValue) {
    //     return previousValue + currentValue.total;
    //   }, 0);
    //   console.log("payable", payable);
    //   Log.insertMany(army).then(() => {
    //     res.status(200).send({
    //         message: "Successfully Uploaded!",
    //         payable: payable
    //     });
    // }).catch((error) => {
    //     res.status(500).send({
    //         message: "failure",
    //         error
    //     });
    // });
}

router.post('/upload-csv-bulk', upload.single('file'), async (req, res) => {
    console.log("reqest jsonnnnnn", req.file)

    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    user_id = req.body.user_id;
    await csvtojson().fromFile(req.file.path).then(async (jsonObj) => {
        fs.unlinkSync(req.file.path);  // remove temp file
        console.log("reqest jsonnnnnn", jsonObj)
        cvsConvertData = jsonObj;
        let typeData;
        for(var i = 0; i < jsonObj.length; i++ ) {
            let ton_weight;
            if (cvsConvertData[i]['unit'] === 'kg') {
                ton_weight = 0.00110231 * cvsConvertData[i]['weight'];
            }
            if (cvsConvertData[i]['unit'] === 'g') {
                ton_weight = 0.0000011023 * cvsConvertData[i]['weight'];
            }
            Types.find({ }).exec( async (err, type) => {
                if (err) {
                    console.log(err);
                    return res.json({ error: true, status: 401, message: "Error occured in getting sub category" });
                }
                if (!type) {
                    return res.json({ error: true, status: 404, message: "Can not find sub category" });
                }
                else {
                    
                    console.log("Typessssssssssssssss", type)
                    console.log("Index data", jsonObj);
                    type.filter((element) => {
                        // console.log("element", element)
                        cvsConvertData.forEach(object => {
                            
                            
                            // console.log("Objecttttttttttt", object);
                            if (element.type_code === object.type_code) {
                                object.sub_category_id = element._id;
                                object.category_id = element.category_id;
                                object.price = element.price;
                                // object.unit = element.unit;
                                // object.weight = element.ton_weight;
                                object.user_id = req.body.user_id;
                                object.total = Number(element.price * ton_weight);
                            }
                            // console.log("elementary object", element)
                            // moveDate(req, res)
                            
                        });

                        console.log("Adjusted array", cvsConvertData);
                        let payable = cvsConvertData.reduce(function (previousValue, currentValue) {
                            return previousValue + currentValue.total;
                        }, 0);
                        console.log("payable", payable, cvsConvertData);
                        Log.create(cvsConvertData[0]).then(() => {
                            console.log("saved datatatatatatattttttt", cvsConvertData)
                            // return res.json({error: false, status: 200,  payable: payable, message: "Successfully Uploaded bulk equipment!" });

                            // res.status(200).send({
                            //     message: "Successfully Uploaded bulk equipment!",
                            //     payable: payable
                            // });
                        })
                        
                        
                    });
                    //  moveDate(req, res);
                    // console.log("GENERAL ASEMBLY", general);
                }
                
                // moveDate(req, res);

            });

            // let payable = general;
            // res.status(200).send({
            //     message: "Successfully Uploaded!",
            // });

        }
        // console.log("New category array", army2);
        // console.log("armyyyyyyy", army);
        // res.status(200).send({
        //     message: "Got category succefully!",
        // });
        
    
    }).catch((error) => {
        res.status(500).send({
            message: "failure",
            error: error
        });
    });
    res.status(200).send({
        message: "Successfully Uploaded bulk equipment!",
        // payable: payable
    });
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
            obj.total = obj.price * obj.weight,
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