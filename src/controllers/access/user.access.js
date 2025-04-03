
import User from '../../models/User.model.js';
import Fake from '../../models/FakeUser.model.js';
// import Collection from '../../models/CollectionCenter.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import async from 'async';
import bcrypt from 'bcrypt';

var API_KEY = 'a2e391c08729f67397de943776f87024-46ac6b00-d975f38b';
// var DOMAIN = 'sandbox086e0a8d8f2f4b748fb92de88df70842.mailgun.org';
var DOMAIN = 'https://blackbox.epron.org.ng'
// var DOMAIN = 'www.epron.netlify.app.com'

import Mailgun from 'mailgun-js';

const mailgun = new Mailgun({apiKey: API_KEY, domain: DOMAIN});
// const Verifier = require('email-verifier');


// Register user


export const reg_userx = (req, res) => {
    if (
        (!req.body.name) ||
        (!req.body.email) ||
        (!req.body.phoneNumber) ||
        (!req.body.password) ||
        (!req.body.role)
        ) {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Name, email, phone, password and role are required"});
    } 
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        countryid: req.body.countryid,
        state: req.body.state,
        stateid: req.body.stateid,
        city: req.body.city,
        cityid: req.body.cityid,
        lga: req.body.lga,
        address: req.body.address,
        password: User.hashPassword(req.body.password),
        // image_url: req.body.image_url,
        role: req.body.role,
        created_at: Date.now(),
        updated_at: Date.now()

    });
    User.findOne({ email: req.body.email }).exec((err, doc, next) => {
                
        // let userEmail = req.body.email;
        if (err) {
            return res.status(401).send({error: true, code: 401, message: "An error occcured"});
        }
        if (doc) {
            return res.status(401).send({error: true, message: "Email already exists"});
        }
        user.save()
        .then((dataRes) => {
            // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
            async.waterfall([
                (done) => {
                    crypto.randomBytes(20, (err, buf) => {
                        let token = buf.toString('hex');
                        done(err, token);
                    });
                },
                (token, done) => {
                    // User.findOne({email: req.body.email}).exec
                    User.findOne({ email: req.body.email }, (err, user) => {
                        // userEmail = req.body.email;
                        // console.log('User', user);
                        if (!user) {
                            // req.flash('error', 'No account with that email address exists.');
                            // return next(new Error('No account with that email address exists.'));
                            return res.send({error: true, code: 401, message: 'Email address does not exists.'});
        
                        }
                        user.verifyToken = token;
                        user.verifyTokenExpires = Date.now() + 3600000;
        
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
                            pass: 'ulaaprnvrwogzkci'
                        }
                    });
                     
                    let mailDetails = {
                        from: `Epron Admin <epronnigeria@gmail.com>`,
                        to: req.body.email,
                        subject: 'Epron Registration',
                        text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://blackbox.epron.org.ng/verify/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your registration will be canceled'
                    };
                     
                    mailTransporter.sendMail(mailDetails, function(err, data) {
                        // console.log("Dattttttttttttaaaaaaaa", data);
                        if(err) {
                            console.log('Error Occurs', err);
                            return res.send({error: true, code: 401, message: "Failed to add new unverified user"});
                        } else {
                            // console.log('Email sent successfully');
                            return res.json({error: false, code: 201, status: 'success', message: 'Token sent to your email'});
                        }
                    });
                },
            ]).catch(err => {
            console.log(err);
            return res.send({err});
            })
        })
        .catch(err => {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.send({error: true, code: 401, message: "Failed to add new user"});
        });
        
    });
    
};

export const reg_user_fake = (req, res) => {
    if (
        (!req.body.name) ||
        (!req.body.email) ||
        (!req.body.phoneNumber) ||
        (!req.body.password) ||
        (!req.body.role)
        ) {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Name, email, phone, password and role are required"});
    } 
    let fake = new Fake({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        countryid: req.body.countryid,
        state: req.body.state,
        stateid: req.body.stateid,
        city: req.body.city,
        cityid: req.body.cityid,
        lga: req.body.lga,
        address: req.body.address,
        password: User.hashPassword(req.body.password),
        // image_url: req.body.image_url,
        role: req.body.role,
        created_at: Date.now(),
        updated_at: Date.now()

    });
    Fake.findOne({ email: req.body.email }).exec((err, doc, next) => {
                
        console.log("Docu user", doc)
        if (err) {
            return res.status(401).send({error: true, code: 401, message: "An error occcured"});
        }
        if (doc) {
            return res.status(401).send({error: true, message: "Email already exists"});
        }
        fake.save()
        .then((dataRes) => {
            // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
            async.waterfall([
                (done) => {
                    crypto.randomBytes(20, (err, buf) => {
                        let token = buf.toString('hex');
                        done(err, token);
                    });
                },
                (token, done) => {
                    // User.findOne({email: req.body.email}).exec
                    Fake.findOne({ email: req.body.email }, (err, user) => {
                        // userEmail = req.body.email;
                        // console.log('User', user);
                        if (!fake) {
                            // req.flash('error', 'No account with that email address exists.');
                            // return next(new Error('No account with that email address exists.'));
                            return res.send({error: true, message: 'Email address does not exists.'});
        
                        }
                        fake.verifyToken = token;
                        fake.verifyTokenExpires = Date.now() + 3600000;
        
                        fake.save(function (err) {
                            done(err, token, fake);
                        });
                        if (req.body.role === 'collector') {
                            let collector = new Collection({
                                user_id: user._id,
                                
                            });
                            collector.save().then((result) => {
                                // console.log("resilt of center", result);
                            }).catch(err => {
                                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                                return res.send({error: true, code: 401, message: "Failed to add new user to center"});
                            });
                        }
                    });
                },
                (token, user, done) => {
                    let mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'epronnigeria@gmail.com',
                            pass: 'ulaaprnvrwogzkci'
                        }
                    });
                     
                    let mailDetails = {
                        from: `Epron Admin <epronnigeria@gmail.com>`,
                        to: req.body.email,
                        subject: 'Epron Registration',
                        text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://blackbox.epron.org.ng/verify/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your registration will be canceled'
                    };
                     
                    mailTransporter.sendMail(mailDetails, function(err, data) {
                        // console.log("Dattttttttttttaaaaaaaa", data);
                        if(err) {
                            // console.log('Error Occurs', err);
                            return res.send({error: true, code: 401, message: "Failed to add new unverified user"});
                        } else {
                            // console.log('Email sent successfully');
                            return res.json({error: false, code: 201, status: 'success', message: 'Token sent to your email'});
                        }
                    });
                }
            ]).catch(err => {
            console.log(err);
            return res.send({err});
            })
        })
        .catch(err => {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.send({error: true, code: 401, message: "Failed to add new user"});
        });
        
    });
    
};


// token validation for unverified user that did not get token or has expired
export const generate_verify_token_validate_user = (req, res, next) => {
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
               let email = req.body.email;
                // console.log('email', email);
                if (!user) {
                    // req.flash('error', 'No account with that email address exists.');
                    // return next(new Error('No account with that email address exists.'));
                    return res.send({error: true, message: 'Email address does not exists.'});

                }
                if (user.verified === false) {
                    user.verifyToken = token;
                    user.verifyTokenExpires = Date.now() + 3600000;
    
                    user.save(function (err) {
                        done(err, token, user);
                    });
                }
               
            });
        },
        (token, user, done) => {
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'epronnigeria@gmail.com',
                    pass: 'ulaaprnvrwogzkci'
                }
            });
             
            let mailDetails = {
                from: `Epron Admin <epronnigeria@gmail.com>`,
                to: req.body.email,
                subject: 'Epron Registration',
                text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://blackbox.epron.org.ng/verify/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your registration will be canceled'
            };
             
            mailTransporter.sendMail(mailDetails, function(err, data) {
                // console.log("Dattttttttttttaaaaaaaa", data);
                if(err) {
                    // console.log('Error Occurs', err);
                    return res.send({error: true, code: 401, message: "Failed to add new user unverified user"});
                } else {
                    // console.log('Email sent successfully');
                    return res.json({error: false, code: 201, status: 'success', message: 'Token sent to your email'});
                }
            });
        }
    ]).catch(err => {
         console.log(err);
         res.send({err});
     })
    
}

// token validation for unverified user that did not get token or has expired


// Verify user by token
export const verify_user = (req, res, next) => {
    // console.log("Request params", req);
    async.waterfall([
        (done) => {
           User.findOne({ verifyToken: req.params.token, verifyTokenExpires: { $gt: Date.now() } }, (err, user) => {
             if (!user) {
                   // console.log('password from front: ', req.body);
                   // return next(new Error('Password reset token is invalid or has expired.'));
                   return res.send({message: 'User verify token has expired, or user not found.'});
                   // req.flash('success', 'Password reset token is invalid or has expired.');
                   // return res.redirct('back');
               }
            else {
                user.verified = true;
                user.save().then(result => {
                    res.json({ 'user': result });
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    // console.log(err.code);
                    return res.send({ error: true, code: 401, message: 'Failed to verify data' });
                });
                return res.json({error: false, code: 201, status: 'success', message: 'User Verified'});
            }
               
           });
       }
       
    ]).catch(err => {
        console.log(err);
        res.send({err});
    })
}
// Verify user by token



// Register user
    export const reg_user2 = (req, res, next) => {
        console.log('clicked function', req.body);
        if (
            (!req.body.name) ||
            (!req.body.email) ||
            (!req.body.phoneNumber) ||
            (!req.body.password) ||
            (!req.body.role)
            ) {
            // console.log("All not filled");
            return res.status(401).send({error: true, message: "Name, email, phone, password and role are required"});
        } 
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: User.hashPassword(req.body.password),
            // image_url: req.body.image_url,
            role: req.body.role,
            created_at: Date.now(),
            updated_at: Date.now()

        });
        User.findOne({ email: req.body.email }).exec((err, doc, next) => {
                    
            // let userEmail = req.body.email;
            console.log('error caused', err);
            if (err) {
                return res.status(401).send({error: true, code: 401, message: "An error occcured"});
            }
            if (doc) {
                return res.status(401).send({error: true, message: "Email already exists"});
            }
            user.save()
            .then((dataRes) => {
                // console.log("dataaaaaa", dataRes);
                // res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });
                async.waterfall([
                    (done) => {
                        crypto.randomBytes(20, (err, buf) => {
                            let token = buf.toString('hex');
                            done(err, token);
                        });
                    },
                    (token, done) => {
                        // User.findOne({email: req.body.email}).exec
                        User.findOne({ email: req.body.email }, (err, user) => {
                            // userEmail = req.body.email;
                            // console.log('email', userEmail);
                            if (!user) {
                                // req.flash('error', 'No account with that email address exists.');
                                // return next(new Error('No account with that email address exists.'));
                                return res.send({error: true, message: 'Email address does not exists.'});
            
                            }
                            user.verifyToken = token;
                            user.verifyTokenExpires = Date.now() + 3600000;
            
                            user.save(function (err) {
                                done(err, token, user);
                            });
                        });
                    },
                    (token, user, done) => {
                        const data = {
                        from: 'Epron Admin <epronnigeria@gmail.com>',
                        to: req.body.email,
                        subject: 'Registration validation',
                        text: 'You are receiving this because you (or someone else) have requested to signup on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://blackbox.epron.org.ng/users/verify-user/' + token + '\n\n' +
                                'If you did not request this, please ignore this email and your registration will be canceled'
                        };
                
                        mailgun.messages().send(data, (error, body) => {
                            if (error) {
                                console.log(error);
                                return res.send({error});
                            }
                        //   console.log('Mailgun body', body);
                        //   console.log('Mailgun dataaaaa', data);
                            res.json({error: false, code: 201, status: 'success', message: 'Token sent to your email'});
                        //   res.status(201).json({'user': dataRes, error: false, status: 'success', message: "Registration successful!", code: 201 });

                        });
                    }
                ]).catch(err => {
                console.log(err);
                return res.send({err});
                })
            })
            .catch(err => {
                // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
                return res.send({error: true, code: 401, message: "Failed to add new user"});
            });
        });
    };
 // Registration ends 



   // login for user
   export const login_user = (req, res) => {
        let promise = User.findOne({ email: req.body.email, blocked: false}).exec();
        promise.then(function (doc) {
            if (doc) {
                if (doc.verified === false) {
                    return res.json({ error: true, message: 'you are not verified', code: 403 });
                }
                if (doc.blocked === true) {
                    return res.json({ error: true, message: 'you have been disabled', code: 405 });
                }
                if (doc.isValid(req.body.password)) {
                    // const token = jwt.sign({ email: doc.get('email'), _id: doc._id }, 'secret');
                    const token = jwt.sign({ email: doc.email, _id: doc._id}, 'secret');
                    return res.json({ token: token, error: false, user: doc, message: 'login successful', code: 201 });
                    // return res.status(201).json({ error: false, message: 'Successful' });
                } else {
                    return res.send({ error: true, message: 'Invalid credentials' });
                    
                }
            } else {
                return res.send({ error: true, message: 'User not found' });
            }

        })
        // promise.catch(function(err)) {
        //         return res.status(501).json({message: 'Some internal server error'});
        // }
        .catch(err => {
            res.send({error: true, message: 'Some internal error' });
        });
    }

