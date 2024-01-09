
import User from '../../models/User.model.js'
import Log from '../../models/Log.model.js';
import Types from '../../models/CategoryTypes.model.js';
import Contactus from '../../models/Contactus.model.js';
import querystring from 'querystring';
// import GenCtrl from  '@balocodes/express';
// import MailController from '@balocodes/express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import async from 'async';
import bcrypt from 'bcrypt';
import csvtojson from 'csvtojson';
import csv from 'csvtojson';
// import csv from 'fast-csv';
import multer from 'multer';  
const upload = multer({ dest: 'uploads/' });
import CsvIt from "csv-it";

// const paystack = require("paystack")("sk_test_72c8ff80984a6f3e15c931b9485f55474ea36e81");
import Paystack from 'paystack';
import { Country, State, City }  from 'country-state-city';

// import Paystack from 'paystack';
// const paystack = Paystack('sk_test_72c8ff80984a6f3e15c931b9485f55474ea36e81');

// const express = require('express');
import NaijaStates from 'naija-state-local-government';
import express from 'express';

const paystack = new Paystack('sk_test_72c8ff80984a6f3e15c931b9485f55474ea36e81');





var API_KEY = 'a2e391c08729f67397de943776f87024-46ac6b00-d975f38b';
var DOMAIN = 'sandbox086e0a8d8f2f4b748fb92de88df70842.mailgun.org';

import Mailgun from 'mailgun-js';
import console from 'console';
import { type } from 'os';

// const mailgun = new Mailgun({apiKey: API_KEY, domain: DOMAIN});

// const app = express();
// app.use(upload.array());

const router = express.Router();



export const get_customers = (req, res) => {
    paystack.customer.list(function(error, body) {
        if (!error) {
        return res.json({error: false, status: 201, customers: body, message: "success!" });

        } if (error) {
            // console.log(error);
            return res.json({error: true, status: 401, message: error});
        }
    });
}; 
  
export const initialize_transaction = (req, res) => {
    paystack.transaction.initialize({
        email: req.body.email,
        amount: Number(req.body.amount) * 100
    }).then((body) => {
        return res.json({error: false, status: 201, customers: body.data, message: "success!" });
        // res.send(body.data)
        // console.log(body);
    }).catch((error) => {
        return res.json({error: true, status: 401, message: error});
        // console.log(err);
    })
}

export const update_payment_option = (req, res) => {
    Log.find({equipment_pin: req.params.pin}).exec((err, log) => {
        console.log("Bulk log", log);
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured" });
        }
        if (!log) {
            return res.json({error: true, status: 404, message: "can not find logged equipment with that equipment pin" });
        }
        else {
            log[0].paid = true;
            log[0].reference = req.params.ref;
            log[0].save().then(result => {
                return res.json({error: false, status: 201, message: "Payment updated successfully!" });
            }).catch(err => {
                return res.json({error: true, status: 401, message: "Could not update logged payment status" });
            });
        }
    });
}


// When payment has to be updated on more than one record.
export const update_multiple_payment_options = async (req, res) => {
    Log.updateMany({equipment_pin: req.params.pin}, {paid: true}).exec((err, log) => {
        console.log("many recoreds", log)
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured" });
        }
        if (!log) {
            return res.json({error: true, status: 404, message: "can not find logged equipment with that equipment pin" });
        }
        if (log.acknowledged != true) {
            return res.json({error: true, status: 401, message: "could not update multiple records to paid" });
        }
        if (log.acknowledged === true) {
            return res.json({error: false, status: 201, message: "Multiple records updated to paid" });
        }
    });
}


export const user_profile = (req, res) => {
    User.findById(req.params.id).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        // res.send(user);
        res.status(200).json({user});
        // console.log(user);
        // console.log('Done');
    });
}

// console.log(Country.getAllCountries());
// console.log(State.getStatesOfCountry('NG'))

export const get_countries = (req, res) => {
    
    const countries = Country.getAllCountries();
    return res.json({error: false, message: 'countries loaded', data: countries,  status: 'success', code: 201});
}

export const get_states = (req, res) => {
    const id  = req.params.isoCode;
    const states = State.getStatesOfCountry(id);
    return res.json({error: false, message: 'states loaded', data: states,  status: 'success', code: 201});
}

export const get_cities = (req, res) => {
    const id  = req.params.isoCode;
    const id2 = req.params.id;
    const cities = City.getCitiesOfState(id, id2);
    return res.json({error: false, message: 'cities loaded', data: cities,  status: 'success', code: 201});
}

export const get_naija_states = (req, res) => {
    const states = NaijaStates.states();
    return res.json({error: false, message: 'states loaded', data: states,  status: 'success', code: 201});
}

export const get_naija_lgas = (req, res) => {
    const states = NaijaStates.lgas(req.params.state);
    return res.json({error: false, message: 'states loaded', data: states,  status: 'success', code: 201});
}

export const get_naija = (req, res) => {
    const states = NaijaStates.all();
    return res.json({error: false, message: 'states loaded', data: states,  status: 'success', code: 201});
}


export const update_profile = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
        }
        if (!user)
            return next(new Error('Could not load document'));
        else {
            // console.log('The user', user);
            // console.log('the body', req.body);
            user.name = req.body.name;
            // user.email = req.body.email;
            user.phoneNumber = req.body.phoneNumber;
            user.address = req.body.address;
            user.state = req.body.state;
            // user.city = req.body.city;
            // user.lga = req.body.lga;
           
            // user.body.user = req.body;
            user.save().then(result => {
                res.json({ 'user  ': result });
                //res.status(200).send({mssage: 'update successful'});
            }).catch(err => {
                console.log(err.code);
                res.send({ error: true, message: 'failed to update' });
            });
        }
    });
}

export const find_user_by_role = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total = await User.countDocuments({role: req.params.role}).exec();

    if (endIndex <  await User.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    User.find({role: req.params.role}).sort('-created_at').limit(limit).skip(startIndex).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Error occured"})
        }
        if (!user) {
            console.log(err);
            return res.json({error: true, status: 404, message: "User not found"})
        }
        
        return res.json({error: false, status: 201, total: total, pagination: results, user: user, message: "successful!" });
    });
}

export const find_user_byid = async (req, res) => {
    
    User.find({ _id: req.params.id }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Error occured"})
        }
        if (!user) {
            console.log(err);
            return res.json({error: true, status: 404, message: "User not found"})
        }
        
        return res.json({error: false, status: 201, user: user, message: "successful!" });
    });
}


export const find_collection_center_by_location = async (req, res) => {
    
    User.find({ lga: req.params.lga, role: 'collector' }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Error occured"})
        }
        if (!user) {
            console.log(err);
            return res.json({error: true, status: 404, message: "User not found"})
        }
        
        return res.json({error: false, status: 201, user: user, message: "successful!" });
    });
}





// fortgot password to be sent to your email
export const forgot_password = (req, res, next) => {
    // console.log('Email from front', req.body);
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, (err, user) => {
               let userEmail = req.body.email;
                // console.log('email', userEmail);
                if (!user) {
                    // req.flash('error', 'No account with that email address exists.');
                    // return next(new Error('No account with that email address exists.'));
                    return res.send({error: true, message: 'Email address does not exists.'});

                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'epronnigeria@gmail.com',
                    pass: 'fpzoqihwtdstymgx'
                }
            });

            let mailDetails = {
                from: `Epron Admin <epronnigeria@gmail.com>`,
                to: req.body.email,
                subject: 'Reset your password',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epronregister.com.ng/reset-password' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged'
            };
            mailTransporter.sendMail(mailDetails, function(err, data) {
                // console.log("Dattttttttttttaaaaaaaa", data);
                if(err) {
                    // console.log('Error Occurs', err);
                    return res.send({error: true, code: 401, message: "Failed to reset user password"});
                } else {
                    // console.log('Email sent successfully');
                    return res.json({error: false, code: 201, status: 'success', message: 'Token sent to your email'});
                }
            });


            


            // const data = {
            // from: 'Epron Admin <epron@gmail.com>',
            // to: req.body.email,
            // subject: 'Password reset',
            // text: 'You are receiving this because you (or someone else) have requested the reset of the password ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epronregister.com.ng/users/password-reset/' + token + '\n\n' +
            //             'If you did not request this, please ignore this email and your password will remain unchanged'
            // };

            // mailgun.messages().send(data, (error, body) => {
            // if (error) {
            //     console.log(error);
            //     res.send({error});
            // }
            // console.log('Mailgun body', body);
            // res.json({error: false, message: 'Token sent to your email', status: 'success', code: 201});
            // });
        }
    ]).catch(err => {
         console.log(err);
         res.send({err});
     })
    
}



// function to change the forgotten password
export const password_reset = (req, res, next) => {
    console.log('password from front: ', req.params.token);
 async.waterfall([
         (done) => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    // console.log('password from front: ', req.body);
                    // return next(new Error('Password reset token is invalid or has expired.'));
                    return res.send({message: 'Password reset token has expired, or user not found.'});
                    // req.flash('success', 'Password reset token is invalid or has expired.');
                    // return res.redirct('back');
                }
                if (req.body.password === req.body.confirmPassword) {
                    const newPassword = bcrypt.hashSync(req.body.password, 10);
                        User.findByIdAndUpdate(user._id, { password: newPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined }, (error, data) => {
                            // res.json({ 'user': data });

                            let mailTransporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'epronnigeria@gmail.com',
                                    pass: 'fpzoqihwtdstymgx'
                                }
                            });
                            let mailDetails = {
                                from: `Epron Admin <epronnigeria@gmail.com>`,
                                to: req.body.email,
                                subject: 'Password has been changed',
                                text: 'Hello,\n\n' + ' This is a confirmation that the password for your account ' + user.email + ' has just been changed'
                            };

                            mailTransporter.sendMail(mailDetails, function(err, data) {
                                // console.log("Dattttttttttttaaaaaaaa", data);
                                if(err) {
                                    // console.log('Error Occurs', err);
                                    return res.send({error: true, code: 401, message: "Failed to reset user password"});
                                } else {
                                    // console.log('Email sent successfully');
                                    return res.json({error: false, code: 201, status: 'success', message: 'Password reset successful'});
                                }
                            });



                            // const data2 = {
                            //   from: 'Epron Admin <epron@gmail.com>',
                            //   to: user.email,
                            //   subject: 'Your password has been changed',
                            //   text: 'Hello,\n\n' + ' This is a confirmation that the password for your accout ' + user.email + ' has just been changed'
                            // };
                            // mailgun.messages().send(data2, (error, body) => {
                            // if (error) {
                            //     console.log(error);
                            // return res.json({errr: true, error, message: 'An error occured while sending you a mail'});
                            // }
                            // // console.log('Mailgun body', body);
                            // // res.json({body, 'user': data});
                            // res.json({error: false, message: 'Password reset successful'});
                            // });
                            // // done(user);
                    });
                } else {
                    // req.flash('error', 'Passwords do not match.');
                    res.send({error: true, message: "Can't reset password."});
                    // return res.redirect('back');
                }
            });
        }
        
     ]).catch(err => {
         console.log(err);
         res.send({err});
     })

}


export const change_password = (req, res) => {
    console.log('Clicked', req.body.oldPassword);
    let oldPassword = req.body.oldPassword;
    let newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    let email = req.body.email;
    // console.log("email" ,email);
    // console.log('new passowrd', newPassword);
    User.find({ email: email }, (err, user) => {
        // console.log('user password', user[0].password, newPassword);
        if (!user) {
            return res.send({ code: 404, error: true, message: "Can't find user" });
        } else if (user) {
            // console.log('the user ring', user);
            if (bcrypt.compare(oldPassword, user[0].password)) {
                // console.log('Za user', user[0].password);
                User.findByIdAndUpdate(user[0]._id.toString(), { password: newPassword }, (err, data) => {
                    // console.log("adatatatata", data);
                    if (err) {
                        // console.log('failed');
                        // console.log('the user error change', user);
                         res.send({ error: true, message: 'Failed to change password' });
                    } else {
                        // console.log('the user successful change password', user);
                        // console.log('success');
                        return res.send({ error: false, message: 'Password successfully changed' });

                    }
                });
            }
        } else {
            return res.send({ error: true, message: 'User not found' });
        }
    });
}

// export const log_equiptment = async (req, res) => {
//     if (
//         (!req.body.category_id) ||
//         (!req.body.price) ||
//         (!req.body.sub_category_id) ||
//         (!req.body.quantity) ||
//         (!req.body.weight) ||
//         (!req.body.unit) ||
//         (!req.body.user_id)
//         ) {
//         return res.status(401).send({error: true, message: "Category_id, price, unit, type, quantity, weight and user_id are required"});
//     }   
//     else {
//         let ton_weight;
//         await Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
//             if (err) {
//                 console.log(err);
//                 return res.json({error: true, status: 401, message: "Failed fetch types"})
//             }
//             if (req.body.price != type.price) {
//                 return res.json({error: true, status: 401, message: "The type price does not match" });
//             }
//             // note the weight is measured in tonage or ton, after the aggregation from the unit.
//             if (req.body.unit === 'kg') {
//                 ton_weight = 0.00110231 * req.body.weight;
//             }
//             if (req.body.unit === 'g') {
//             ton_weight = 0.0000011023 * req.body.weight;
//             }
//             // res.json({error: false, status: 201, requests: type, message: "fetch all types successful!" });
//             const total = type.price *  req.body.quantity * req.body.weight;
//             const pin = Math.random().toString(36).slice(2);
//             let log = new Log({
//                 category_id: req.body.category_id,
//                     price: type.price,
//                     total: Math.round(total),
//                     sub_category_id: req.body.sub_category_id,
//                     quantity: req.body.quantity,
//                     weight: ton_weight,
//                     unit: req.body.unit,
//                     unit_weight: req.body.weight,
//                     user_id: req.body.user_id,
//                     equipment_pin: pin,
//                     created_at: Date.now(),
//                     updated_at: Date.now()
//             });
//             log.save()
//             .then(data => {
//                 res.status(201).json({log: data, error: false, message: "Equipment saved successful!" });
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(401).send({error: true, message: "Failed to save equipment"});
//             });
//         });
    
//     }
// }

export const log_equiptment = async (req, res) => {
    if (
        (!req.body.category_id) ||
        // (!req.body.price) ||
        (!req.body.sub_category_id) ||
        (!req.body.quantity) ||
        (!req.body.weight) ||
        (!req.body.unit) ||
        (!req.body.user_id)
        ) {
        return res.status(401).send({error: true, message: "Category_id, unit, type, quantity, weight and user_id are required"});
    } 

    User.findById({_id: req.body.user_id}).exec((err, user) => {
        if (err) {
            // console.log(err);
            return res.send(err);
        }
        if (!user) {
            return res.status(404).send({error: true, message: "User not found"});;
        }

        if (user.role != 'manufacturer') {
            return res.status(401).send({error: true, message: "This user can not log equipment"});
        }
        else {
            let ton_weight;
            Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
                console.log("Sub category", type)
                if (err) {
                    // console.log(err);
                    return res.json({error: true, status: 401, message: "Failed fetch types"})
                }
                if (!type) {
                    // console.log(err);
                    return res.json({error: true, status: 404, message: "Sub category not found"});
                }
                
                // note the weight is measured in tonage or ton, after the aggregation from the unit.
                if (req.body.unit === 'kg') {
                    ton_weight = 0.00110231 * req.body.weight;
                }
                if (req.body.unit === 'g') {
                ton_weight = 0.0000011023 * req.body.weight;
                }
                // const ton_weight = req.body.unit * req.body.weight;
                // const total = type.price *  req.body.quantity * ton_weight;
                const total = type.price * ton_weight;
                const pin = Math.random().toString(36).slice(2);
                 let log = new Log({
                category_id: req.body.category_id,
                // unit_price: type.price,
                price: type.price,
                total: Math.round(total),
                sub_category_id: req.body.sub_category_id,
                quantity: req.body.quantity,
                weight: ton_weight,
                unit: req.body.unit,
                unit_weight: req.body.weight,
                user_id: req.body.user_id,
                equipment_pin: pin,
                created_at: Date.now(),
                updated_at: Date.now()
        
            });
            log.save()
            .then(data => {
                res.status(201).json({log: data, error: false, message: "equipment saved successful!" });
            })
            .catch(err => {
                console.log(err);
                res.status(401).send({error: true, message: "Failed to save equipment"});
            });
        });
        }
    });
}

export const update_logged_equipment = async (req, res) => {
    if (
        (!req.body.category_id) ||
        // (!req.body.price) ||
        (!req.body.sub_category_id) ||
        (!req.body.quantity) ||
        (!req.body.weight) ||
        (!req.body.unit) ||
        (!req.body.user_id)
        // (!req.body.user_id)
        ) {
            return res.status(401).send({error: true, message: "Category_id, unit, type, quantity, weight and user_id are required"});
    }
    Log.findById(req.params.id, (err, log) => {
        if (err) {
            console.log(err);
        }
        if (!log) {
            // return next(new Error('Could not find logged eqiupment'));
            return res.status(404).send({error: true, message: "Could not find logged eqiupment"});
        }
        if (log.user_id != req.body.user_id) {
            // return next(new Error('Could not find logged eqiupment'));
            return res.status(402).send({error: true, message: "You can not update this log"});
        } 
        if (log.paid === true) {
            return res.status(401).send({error: true, message: "you can not update this logged eqiupment, it has been paid for"});
        }  
        else {
            let ton_weight;
            Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
                if (err) {
                    console.log(err);
                    return res.json({error: true, status: 401, message: "Failed fetch types"})
                }
                if (!type) {
                    console.log(err);
                    return res.json({error: true, status: 404, message: "Sub category not found"})
                }
                
                // note the weight is measured in tonage or ton, after the aggregation from the unit.
                if (req.body.unit === 'kg') {
                    ton_weight = 0.00110231 * req.body.weight;
                }
                if (req.body.unit === 'g') {
                    ton_weight = 0.0000011023 * req.body.weight;
                }
                const total = type.price * ton_weight;
            
                log.category_id = req.body.category_id,
                // log.category_name = req.body.category_name,
                log.price = type.price,
                log.total = total,
                log.sub_category_id = req.body.sub_category_id,
                // log.sub_category_name = req.body.sub_category_name,
                log.quantity = req.body.quantity,
                log.weight = ton_weight,
                log.unit_weight = req.body.weight,
                log.unit = req.body.unit,
                // log.user_id = req.body.user_id,
                // log.equipment_pin = pin,
                log.updated_at = Date.now()
                // user.body.user = req.body;
                log.save().then(result => {
                    res.status(201).json({error: false, message: "Log update successful" });
                    // res.json({ 'log': result });
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    // console.log(err);
                    res.send({ error: true, message: 'failed to update logged equipment' });
            });
        });
        }
        
    });
}

export const fetch_user_loged_equiptment_byid = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_equipment_logged = await Log.countDocuments({user_id: req.params.id}).exec();
    const total_number_paid = await Log.countDocuments({user_id: req.params.id, paid: true}).exec();

    if (endIndex <  await Log.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    Log.find({user_id: req.params.id}).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, equipment, next) => {
        if (err) {
            // console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch user logged equipment"})
        }
        if (!equipment) {
            // console.log(err);
            return res.json({error: true, status: 404, message: "user logged equipment not found"})
        }
        const log_weight = equipment.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);

        const value = equipment.filter(result => result.paid === true);
        
        const total_payment_made = value.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);

        const value2 = equipment.filter(result => result.paid === false);
        
        const total_unpaid = value2.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);
        
        // const amount_unpaid = 
        const number_of_unpaid = total_equipment_logged - total_number_paid;
       
        return res.json({error: false, status: 201, total_logged_equipment_paid: total_number_paid, unpaid_log_number: number_of_unpaid, total_payment_made: total_payment_made, unpaid_payment: total_unpaid, total_logged_eqiupment: total_equipment_logged, total_weight_logged: log_weight, pagination: results, log: equipment, message: "Fetch all logged equipments successful!" });
    });
}

export const fetch_user_loged_equiptment_byid_paid_status = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_equipment_logged = await Log.countDocuments({user_id: req.params.id, paid: req.query.paid}).exec();
    // const total_number_paid = await Log.countDocuments({user_id: req.params.id, paid: true}).exec();

    if (endIndex <  await Log.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    Log.find({user_id: req.params.id, paid: req.query.paid}).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, equipment, next) => {
        if (err) {
            // console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch user logged equipment"})
        }
        if (!equipment) {
            // console.log(err);
            return res.json({error: true, status: 404, message: "user logged equipment not found"})
        }
       
        return res.json({error: false, status: 201, total_logged_eqiupment: total_equipment_logged, pagination: results, log: equipment, message: "success" });
    });
}

export const fetch_user_loged_equiptment_by_payment = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    // const total_equipment_logged = await Log.countDocuments({user_id: req.params.id}).exec();
    // const total_number_paid = await Log.countDocuments({user_id: req.params.id, paid: true}).exec();

    if (endIndex <  await Log.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    Log.find({user_id: req.params.id}).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, equipment, next) => {
        if (err) {
            // console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch user logged equipment"})
        }
        if (!equipment) {
            return res.json({error: true, status: 404, message: "Log equipent does not exist!"})
        }
        const log_weight = equipment.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);

        const value = equipment.filter(result => result.paid === true);
        
        const total_payment_made = value.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);

        const value2 = equipment.filter(result => result.paid === false);
        
        const total_unpaid = value2.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);
        
        // const amount_unpaid = 
        const number_of_unpaid = total_equipment_logged - total_number_paid;
       
        return res.json({error: false, status: 201, total_logged_equipment_paid: total_number_paid, unpaid_log_number: number_of_unpaid, total_payment_made: total_payment_made, unpaid_payment: total_unpaid, total_logged_eqiupment: total_equipment_logged, total_weight_logged: log_weight, pagination: results, log: equipment, message: "Fetch all logged equipments successful!" });
    });
}


export const fetch_all_loged_equiptments = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_log = await Log.countDocuments().exec();
    if (endIndex <  await Log.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    Log.find({}).sort('-created_at').populate('category_id').populate('sub_category_id').limit(limit).skip(startIndex).exec((err, equipment, next) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch logged equipment"})
        }
        // console.log("pageNumber:", startIndex)
        return res.json({error: false, status: 201, pagination: results, log: equipment, total: total_log,  message: "Fetch all logged equipments successful!" });
    });
}



export const remove_log_equipment = (req, res) => {
    Log.findByIdAndRemove({ _id: req.params.id }, (err, log) => {
        if (err) {
            return res.json({error: true, status: 401, message: "error occured"});
            // res.json(err);
        }
        if (!log) {
            return res.json({error: true, status: 401, message: "log equipment not found"});
            // res.json(err);
        }
        if (log.paid === true) {
            return res.status(401).send({error: true, message: "you can not delete this log"});
        }
        else {
            return res.json({error: false, status: 201, message: "success!" });
            // res.json('removed successfully');
        }
    });
}


export const bulk_log_upload = (upload.single("log"), async (req, res, next) => {
    // console.log("loggggggg", upload);
    // console.log("filesssssssssssss", req.file);
    await csv().fromFile(req.file.path).then((jsonObj)=>{
        // console.log("jsonnnnnnnnnnnnnnnnn", jsonObj);
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            obj.firstName = jsonObj[i]['First Name'];
            obj.lastName = jsonObj[i]['Last Name'];
            obj.house = jsonObj[i]['House'];

            obj.house = jsonObj[i]['House'];

            obj.category_id = jsonObj[i]['category_id'],
            obj.category_name = jsonObj[i]['category_name'],
            // obj.price = type.price,
            // obj.total = total,
            obj.sub_category_id = jsonObj[i]['sub_category_id'],
            obj.sub_category_name= jsonObj[i]['sub_category_name'],
            obj.quantity = jsonObj[i]['quantity'],
            obj.weight = jsonObj[i]['weight'],
            obj.user_id = jsonObj[i]['user_id'],
            obj.equipment_pin = jsonObj[i]['equipment_pin'],
            // created_at: Date.now(),
            // updated_at: Date.now()


            army.push(obj);
        }
        console.log("armyyyyyyy", army);
        Log.insertMany(army).then(() => {
            res.status(200).send({
                message: "Successfully Uploaded!"
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
    })
});



export const bulk_log_upload2 = (upload.single("file"), async (req, res, next) => {
    console.log("reqqqqqqqq", req.body)
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
 
    var authors = [];

    csvtojson({
        noheader:true,
        output: "csv"
    })
    .fromString(req.body)
    .then((csvRow)=>{ 
        console.log("csvvvvvvvvvvvvv", csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
    })
         
    // csvtojson
    //  .parseFile(req.body).then(csvData => {
    //     console.log("csv datatttttttt", csvData)
    //     Log.insertMany(csvData).then(() => {
    //         console.log("Data saved");
    //         return res.status(200).send({success: 'Data saved.'});
    //     }).catch((error) => {
    //         res.status(500).send({
    //             message: "failure",
    //             error
    //         });
    //     });
    //  })
});




export const bulk_log_upload3 = async (req, res, next) => {
    console.log("reqqqqqqqq", req.file)

    // try{ let data = req.body; console.log("datatatata", data); res.status(200).send('success'); }catch(e){ res.status(400).send(e), console.log(e) }
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
 
    var authors = [];
         
    csv
     .fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         authors.push(data);
     })
     .on("end", function(){
         Authors.create(authors, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(authors.length + ' authors have been successfully uploaded.');
     });
};


export const log_equiptment2 = async (req, res) => {
    if (
        (!req.body.category_id) ||
        // (!req.body.price) ||
        (!req.body.sub_category_id) ||
        (!req.body.quantity) ||
        (!req.body.weight) ||
        (!req.body.unit) ||
        (!req.body.user_id)
        ) {
        return res.status(401).send({error: true, message: "Category_id, unit, type, quantity, weight and user_id are required"});
    } 

    User.findById({_id: req.body.user_id}).exec((err, user) => {
        if (err) {
            // console.log(err);
            return res.send(err);
        }
        if (!user) {
            return res.status(404).send({error: true, message: "User not found"});;
        }

        if (user.role != 'manufacturer') {
            return res.status(401).send({error: true, message: "This user can not log equipment"});
        }
        else {
            let ton_weight;
            Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
                console.log("Sub category", type)
                if (err) {
                    // console.log(err);
                    return res.json({error: true, status: 401, message: "Failed fetch types"})
                }
                if (!type) {
                    // console.log(err);
                    return res.json({error: true, status: 404, message: "Sub category not found"});
                }
                
                // note the weight is measured in tonage or ton, after the aggregation from the unit.
                if (req.body.unit === 'kg') {
                    ton_weight = 0.00110231 * req.body.weight;
                }
                if (req.body.unit === 'g') {
                ton_weight = 0.0000011023 * req.body.weight;
                }
                // const ton_weight = req.body.unit * req.body.weight;
                // const total = type.price *  req.body.quantity * ton_weight;
                const total = type.price * ton_weight;
                const pin = Math.random().toString(36).slice(2);
                 let log = new Log({
                category_id: req.body.category_id,
                // unit_price: type.price,
                price: type.price,
                total: Math.round(total),
                sub_category_id: req.body.sub_category_id,
                quantity: req.body.quantity,
                weight: ton_weight,
                unit: req.body.unit,
                unit_weight: req.body.weight,
                user_id: req.body.user_id,
                equipment_pin: pin,
                created_at: Date.now(),
                updated_at: Date.now()
        
            });
            log.save()
            .then(data => {
                res.status(201).json({log: data, error: false, message: "equipment saved successful!" });
            })
            .catch(err => {
                console.log(err);
                res.status(401).send({error: true, message: "Failed to save equipment"});
            });
        });
        }
    });
}

export const excel_bulk_equipment = async (req, res) => {
    User.findById({ _id: req.body.user_id, role: 'manufacturer' }).exec((err, user) => {
        if (
            (!req.body.category_id) ||
            (!req.body.total) ||
            (!req.body.price) ||
            (!req.body.sub_category_id) ||
            (!req.body.unit_weight) ||
            (!req.body.quantity) ||
            (!req.body.weight) ||
            (!req.body.unit) ||
            (!req.body.user_id)
            ) {
            return res.status(401).send({error: true, message: "Category_id, price, sub_category_id, unit_weight, unit, total, quantity, weight and user_id are required"});
        }
        if (err) {
            return res.json({error: true, status: 401, message: "error occured for this user"});
        }
        if (!user) {
            return res.json({error: true, status: 401, message: "user not found"});
        }
        let log = new Log({
            category_id: req.body.category_id,
            // unit_price: type.price,
            price: req.body.price,
            total: req.body.total,
            sub_category_id: req.body.sub_category_id,
            quantity: req.body.quantity,
            weight: req.body.weight,
            unit: req.body.unit,
            unit_weight: req.body.unit_weight,
            user_id: req.body.user_id,
            equipment_pin: req.body.equipment_pin,
            created_at: Date.now(),
            updated_at: Date.now()
        }); 
        log.save().then(data => {
            res.status(201).json({error: false, message: "bulk equipment saved successful!" });
        }).catch(err => {
            console.log(err);
            res.status(401).send({error: true, message: "Failed to save bulk equipment"});
        });
    });
};


export const get_price_of_equipment_for_payment = (req, res) => {
    Log.find({equipment_pin: req.params.pin}).sort('-created_at').exec((err, log) => {
        if (err) {
            return res.status(401).send({error: true, message: "error occured while finding ewaste"});
        }
        if (!log) {
            // console.log(err);
            return res.status(404).send({error: true, message: "ewastes not found"});
        }
        const total_payment = log.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);
        return res.status(201).send({error: false, message: "success", total_payment: total_payment});

    });
};

export const feedback = async (req, res) => {
    // User.findOne({ email: req.body.email }).exec((err, user) => {
        if (
            (!req.body.email) ||
            (!req.body.name) ||
            (!req.body.phone) ||
            (!req.body.message) ||
            (!req.body.company)
            ) {
            return res.status(401).send({error: true, message: "Name, email, phone, company, message are required"});
        }  
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'epronnigeria@gmail.com',
                    pass: 'fpzoqihwtdstymgx'
                }
            });
             
            let mailDetails = {
                from: `${req.body.name} ${req.body.email} <epronnigeria@gmail.com>`,
                to: `epronnigeria@gmail.com`,
                subject: 'Feedback',
                text: req.body.message
            };
             
            await mailTransporter.sendMail(mailDetails, function(err, data) {
                // console.log("Dattttttttttttaaaaaaaa", data);
                if(err) {
                    console.log('Error Occurs', err);
                    return res.send({error: true, code: 401, message: "Error occured"});
                } else {
                    // console.log('Email sent successfully');
                    return res.json({error: false, code: 201, status: 'success', message: 'Message sent to Epron'});
                }
            });
        // },
        
    // }).catch(err => {
    //     // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
    //     return res.send({error: true, code: 401, message: "Failed to send feedback"});
    // });
}






// const fileName = req.body.fileName
 
// csv()
//   .fromFile(req.file.path)
//   .then((jsonObj) => {
//     //finding the document using fileName and setting csvData as the jsonObj
//     sheetModel.findOneAndUpdate({ fileName: fileName }, {$set: { csvData: jsonObj, fileName: fileName}, { upsert: true }}, (err, data) => {
//       if (err) {
//         res.status(400).json({
//           message: "Something went wrong!",
//         });
//       } else {
//         res.status(200).json({
//           message: "File Uploaded Successfully!",
//           result: data,
//         });
//       }
//     });
//   });






