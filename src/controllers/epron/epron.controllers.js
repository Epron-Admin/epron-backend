
import Category from '../../models/Category.model.js';
import Types from '../../models/CategoryTypes.model.js';
import User from '../../models/User.model.js'
import Ewaste from '../../models/Ewaste.model.js';
import console from 'console';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import async from 'async';
// import Collection from '../../models/CollectionCenter.model.js';
import RequestPickup from '../../models/RequestPickup.model.js';
import RecyclerWaste from '../../models/RecyclerWaste.model.js';
import Log from '../../models/Log.model.js';
import schedule from 'node-schedule';
import Pelpay from '../../models/Pelpay.model.js';
import dotenv from 'dotenv';
import  request from 'request';
// import { response } from 'express';
import { resolve } from 'path';
dotenv.config();

const config = process.env;



export const new_category = (req, res) => {
    if (!req.body.name) {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Name is required"});
    }  
    const code = Math.random().toString(36).slice(2, 7);
    let category = new Category({
        name: req.body.name,
        category_code: code,
        created_at: Date.now(),
        updated_at: Date.now()

    });
    Category.findOne({ name: req.body.name }).exec((err, doc, next) => {
        if (err) {
            return res.status(401).send({error: true, code: 401, message: "An error occcured"});
        }
        if (doc) {
            return res.send({error: true, message: 'Category already exists.'});
        }
        category.save().then(result => {
            res.json({error: false, code: 201, status: 'success', message: 'category created successfuly', 'category': result });
            // res.status(200).send({mssage: 'Category created successful'});
        }).catch(err => {
            console.log(err.code);
            res.send({ error: true, message: 'failed to add data' });
        });
    })
}

export const fetch_all_categories = (req, res) => {
    Category.find({}).exec((err, category) => {
        if (err) {
            console.log(err);
            return res.send({error: true, code: 401, message: "Failed to fetch all categories"});
            // return res.send(err);
        }
        return res.json({error: false, code: 201, status: 'success', message: 'fetch all categories', categories: category });
        // res.send(category);
        console.log(category);
    });
}

export const update_category = async (req, res) => {
    if (!req.body.name) {
        return res.status(401).send({error: true, message: "Name is required"});
    } 
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            console.log(err);
        }
        if (!category) {
            return res.status(404).send({error: true, message: "Could not find category"});
        }   
        else {
            category.name = req.body.name,
            category.updated_at = Date.now()
            category.save().then(result => {
                res.status(201).json({category: result, error: false, message: "Category update successful" });
                // res.json({ 'log': result });
                //res.status(200).send({mssage: 'update successful'});
            }).catch(err => {
                console.log(err);
                res.send({ error: true, message: 'failed to update logged equipment' });
            });
        }
        
    });
}



export const new_sub_cateory = (req, res) => {
    //  console.log("reqquests", req.body);
    if ((!req.body.name) || (!req.body.category_id) || (!req.body.price)) {
        return res.status(401).send({error: true, message: "Name and category id are required"});
    } 
    const code = Math.random().toString(36).slice(2, 7);
    let types = new Types({
        name: req.body.name,
        price: req.body.price,
        type_code: code,
        category_id: req.body.category_id,
        created_at: Date.now(),
        updated_at: Date.now()

    });
    Types.findOne({ name: req.body.name }).exec((err, doc, next) => {
        if (err) {
            return res.status(401).send({error: true, code: 401, message: "An error occcured"});
        }
        if (doc) {
            return res.send({error: true, message: 'sub category name already exists.'});
        }
        // let id = types.category_id;
        types.save().then(result => {
            return res.json({error: false, code: 201, status: 'success', message: 'type category created successfuly', type: result });
        }).catch(err => {
            console.log(err);
            return res.send({ error: true, message: 'failed to add data' });
        });
    })
}

export const fetch_all_sub_categories = (req, res) => {
    Types.find({}).exec((err, types) => {
        if (err) {
            console.log(err);
            return res.send({error: true, code: 401, message: "Failed to fetch all types"});
            // return res.send(err);
        }
        return res.json({error: false, code: 201, status: 'success', message: 'fetch all categories', types: types });
        // res.send(category);
    });
}

export const fetch_all_sub_categories_by_categoryid = (req, res) => {
    Types.find({category_id: req.params.id}).exec((err, types) => {
        if (err) {
            console.log(err);
            return res.send({error: true, code: 401, message: "Failed to fetch all types based on category"});
            // return res.send(err);
        }
        return res.json({error: false, code: 201, status: 'success', message: 'fetch all types based on category', types: types });
        // res.send(category);
    });
}


// export const fetch_sub_categories = (req, res) => {
//     Types.findById(req.params.id).populate('category').exec((err, types) => {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         res.send(types);

//     });
// }

export const update_sub_category = async (req, res) => {
    if ((!req.body.name) || (!req.body.category_id) || (!req.body.price)) {
        return res.status(401).send({error: true, message: "Name and category id are required"});
    } 
    Types.findById(req.params.id, (err, types) => {
        if (err) {
            console.log(err);
        }
        if (!types) {
            return res.status(404).send({error: true, message: "Could not find sub category"});
        }   
        else {
            
            Types.findOne({ name: req.body.name }).exec((err, doc, next) => {
                if (err) {
                    return res.status(401).send({error: true, code: 401, message: "An error occcured"});
                }
                // if (doc) {
                //     return res.send({error: true, message: 'sub category name already exists.'});
                // }
                types.name = req.body.name,
                types.price = req.body.price,
                types.category_id = req.body.category_id,
                types.updated_at = Date.now()
                types.save().then(result => {
                    res.status(201).json({sub_category: result, error: false, message: "Sub category update successful" });
                    // res.json({ 'log': result });
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    console.log(err);
                    res.send({ error: true, message: 'failed to update sub category' });
                });

            });

            
        }
        
    });
}

export const remove_log_category = (req, res) => {
    Category.findByIdAndRemove({ _id: req.params.id }, (err, log) => {
        if (err) {
            return res.json({error: true, status: 401, message: "error occuredd"});
        }
        if (!log) {
            return res.json({error: true, status: 404, message: "can not find category"});
        }
        else {
            Types.deleteMany({category_id: req.params.id}).exec((err, doc, next) => {
                if (doc) {
                    return res.send({error: false, status: 201, message: 'success!', info: 'the deleted category if it has a sub category which has been deleted too'});
                } else {
                    return res.json({error: true, status: 401, message: "failed to delete category!" });
                }
            });
        }
    });
}

export const remove_unverified_user = (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id, verified: false }, (err, user) => {
        if (err) {
            return res.json({error: true, status: 401, message: "failed to delete category"});
        }
        if (!user) {
            return res.json({error: true, status: 404, message: "can not find user"});
        }
        if (user.verified === true) {
            return res.json({error: true, status: 404, message: "this user is already verified"});
        }
        else {
            return res.json({error: false, status: 201, message: "user removed"});
        }
    });
}

export const remove_log_type = (req, res) => {
    Types.findByIdAndRemove({ _id: req.params.id }, (err, type) => {
        if (err) {
            return res.json({error: true, status: 401, message: "failed to delete category type"});
        }
        if (!type) {
            return res.json({error: true, status: 404, message: "can not find sub category"});
        }
        else {
            return res.json({error: false, status: 201, message: "success!" });
        }
    });
}




export const fetch_all_users = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_users = await User.countDocuments().exec();
    const total_verified_users = await User.countDocuments({verified: true}).exec();
    const total_blocked_users = await User.countDocuments({blocked: true}).exec();

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
    User.find({}).sort('-created_at').limit(limit).skip(startIndex).exec((err, users, next) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch users"})
        }
        return res.json({error: false, status: 201, total_users: total_users, verified_users: total_verified_users, blocked_users: total_blocked_users, pagination: results, users: users, message: "Fetch all users successful!" });
    });
}

export const reg_user_erpon = (req, res, next) => {
    if (
        (!req.body.name) ||
        (!req.body.email) ||
        (!req.body.phoneNumber) ||
        (!req.body.password) ||
        (!req.body.epron_admin)
        ) {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Name, email, phone, epron_admin and role password are required"});
    } 
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        epron_admin: req.body.epron_admin,
        password: User.hashPassword(req.body.password),
        // image_url: req.body.image_url,
        role: 'epron',
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
                        subject: 'Epron Registration',
                        text: 'You are receiving this because Epron have requested to sign you up as admin on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epronregister.com.ng/verify/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your registration will be canceled.\n\n' + ' Your password is ' + (req.body.password) + ' you can change it at anytime for privacy.'
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
            return res.send({error: true, code: 401, message: "Failed to add new epron admin user"});
        });
    });
    
};

export const fetch_users_loged_equiptment_oem = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_equipment_logged = await Log.countDocuments({}).exec();
    const total_number_paid = await Log.countDocuments({paid: true}).exec();

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
    Log.find({}).populate('category_id').populate('sub_category_id').populate('user_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, equipment, next) => {
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

export const fetch_user_loged_equiptment_paid_status_oem = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_equipment_logged = await Log.countDocuments({paid: req.query.paid}).exec();
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
    Log.find({paid: req.query.paid}).populate('category_id').populate('sub_category_id').populate('user_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, equipment, next) => {
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


export const fetch_all_admin_users = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_users = await User.countDocuments({role: 'epron'}).exec();
    const total_blocked_users = await User.countDocuments({blocked: true, role: 'epron'}).exec();

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
    User.find({role: 'epron'}).sort('-created_at').limit(limit).skip(startIndex).exec((err, users, next) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch users"})
        }
        return res.json({error: false, status: 201, total_users: total_users, blocked_users: total_blocked_users, pagination: results, users: users, message: "Fetch all users successful!" });
    });
}

export const block_user = (req, res) => {
    User.findById({_id: req.params.id}, (err, user) => {
        if (err) {
            res.send({code: 505, error: true, err: err, message: 'error occured' });
            // console.log(err);
        }
        if (user.blocked === true) {
            res.send({code: 401, error: true, message: 'User is alraedy blocked' });
        }
        if (!user) {
            res.send({code: 404, error: true, message: 'Can not find user' });
        }    
            // return next(new Error('Could not load document'));
        else {
            user.blocked = true,
            user.updated_at = Date.now()
            user.save().then(result => {
                res.json({ error: false, code: 200, status: 'success', message: 'user has been blocked'});
                //res.status(200).send({mssage: 'update successful'});
            }).catch(err => {
                // console.log(err.code);
                res.send({ error: true, message: 'failed to block user' });
            });
        }
    });
}
export const unblock_user = (req, res) => {
    User.findById({_id: req.params.id}, (err, user) => {
        if (err) {
            res.send({code: 505, error: true, err: err, message: 'error occured' });
            // console.log(err);
        }
        if (user.blocked === false) {
            res.send({code: 401, error: true, message: 'User is alraedy unblocked' });
        }
        if (!user) {
            res.send({code: 404, error: true, message: 'Can not find user' });
        }   // return next(new Error('Could not load document'));
        else {
            user.blocked = false,
            user.updated_at = Date.now()
            user.save().then(result => {
                res.json({ error: false, code: 200, status: 'success', message: 'user has been unblocked'});
                //res.status(200).send({mssage: 'update successful'});
            }).catch(err => {
                // console.log(err.code);
                res.send({ error: true, message: 'failed to unblock user' });
            });
        }
    });
}

export const fetch_all_loged_ewaste = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewaste = await Ewaste.countDocuments({}).exec();
    const total_pickedup = await Ewaste.countDocuments({pickedup: true}).exec();
    const total_unpickedup = await Ewaste.countDocuments({pickedup: false}).exec();
    const total_ready_for_pickup = await Ewaste.countDocuments({ready_pickup: true}).exec();
    const total_not_ready_for_pickup = await Ewaste.countDocuments({ready_pickup: false}).exec();

    if (endIndex <  await Ewaste.countDocuments().exec()) {
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
    Ewaste.find({}).sort('-created_at').populate('category_id').populate('sub_category_id').populate('user_id').limit(limit).skip(startIndex).exec((err, ewaste, next) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!ewaste) {
            console.log(err);
            return res.json({error: true, status: 404, message: "e-waste not found"})
        }
        
        else {
            const total_ewaste_weight = ewaste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
            }, 0);
            return res.json({error: false, status: 201, pagination: results, total_ewaste: total_ewaste, total_ready_for_pickup: total_ready_for_pickup, total_not_ready_for_pickup: total_not_ready_for_pickup, total_ewaste_weight: total_ewaste_weight, total_unpickedup: total_unpickedup, total_pickedup: total_pickedup, ewaste: ewaste, message: "Fetch all logged ewaste successful!" });
        }
    });
}

// export const asign_recycler_to_collection_center = (req, res) => {
//     //  the user_id is the id of the user which is a collection center or collector while signing up
//     Collection.findOne({user_id: req.body.collector_user_id}).exec((err, center) => {
//         if (
//             (!req.body.collector_user_id)
//             (!req.body.recycler_user_id)
//         ) {
//             return res.status(401).send({error: true, message: "Collection center ID, and recycler ID are required"});
//         }
//         if (err) {
//             return res.json({error: true, status: 401, message: "An error occured"})
//         }
//         if (!center) {
//             res.send({code: 404, error: true, message: 'Can not find collection center' });
//         }
//         // if (center.role != 'recycler') {
//         //     res.send({code: 404, error: true, message: 'user not a recycler' });
//         // }
//         else {
//             // the recycler id id the id of the user who is a recycler in this case.
//             const index = center.recyclers.includes(req.body.recycler_user_id);
//             console.log("index", index);
//             if (index === false) {
//                 center.recyclers.push(req.body.recycler_user_id);
//                 center.save().then(result => {
//                     res.json({ error: false, code: 200, status: 'success', message: 'user has been asigned to collection center'});
//                 }).catch(err => {
//                     // console.log(err.code);
//                     res.send({ error: true, message: 'failed to asign user to collection' });
//                 });
//             } else {
//                 res.send({ error: true, message: 'user already asigned to this collection center' });
//             }
//         }
        
//     })
// }

export const remove_recycler_to_collection_center = (req, res) => {
    //  the user_id is the id of the user which is a collection center or collector while signing up
    Collection.findOne({user_id: req.body.collector_user_id}).exec((err, center) => {
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured"})
        }
        if (!center) {
            res.send({code: 404, error: true, message: 'Can not find collection center' });
        }
        // if (center.role != 'recycler') {
        //     res.send({code: 404, error: true, message: 'user not a recycler' });
        // }
        else {
            console.log("centers", center)
            // the recycler id id the id of the user who is a recycler in this case.
            const index = center.recyclers.indexOf(req.body.recycler_user_id);
            // console.log("index", index);
            if (center.recyclers.length != 0) {
                center.recyclers.splice(index, 1);
                center.save().then(result => {
                    res.json({ error: false, code: 200, status: 'success', message: 'user has been removed from collection center'});
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to remove  user' });
                });
            } else {
                res.send({ error: true, code: 404, message: 'recyceler was not asined to this collection center' });
            }
            
        }
        
    })
}

// this function get a collection cecnter based on the user id and populate its recyclers.
export const fetch_collection_center_byId = (req, res) => {
    Collection.findById({ _id: req.params.id}).populate('recyclers').exec((err, result) => {
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured"})
        }
        if (!result) {
            res.send({code: 404, error: true, message: 'Can not find collection center' });
        }
        else {
            // console.log("result", result)
            res.json({ error: false, code: 200, center: result, status: 'success', message: 'success!'});

        }
    })
}

export const fetch_all_pickups_accepted = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({accept_request: true}).exec();

    if (endIndex <  await RequestPickup.countDocuments().exec()) {
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
    RequestPickup.find({accept_request: true}).populate('accepted_by').sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch request accepted pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "successful!" });
    });
}

export const find_all_collection_center = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_centers = await User.countDocuments({role: 'collector'}).exec();

    if (endIndex <  await User.countDocuments({role: 'collector'}).exec()) {
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
    
    User.find({ role: 'collector' }).sort('-created_at').limit(limit).skip(startIndex).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Error occured"})
        }
        if (!user) {
            console.log(err);
            return res.json({error: true, status: 404, message: "User not found"})
        }
        
        return res.json({error: false, status: 201, pagination: results, total_users: total_centers, user: user, message: "successful!" });
    });
}

export const fetch_all_pickup_based_on_acceptance = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({accept_request: req.query.accepted}).exec();

    if (endIndex <  await RequestPickup.countDocuments({accept_request: req.query.accepted}).exec()) {
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
    RequestPickup.find({accept_request: req.query.accepted}).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "All request for pickup based on loaction and accepted successful!" });
    });
}


export const find_all_user_based_on_verified_status = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_users = await User.countDocuments({verified: req.query.verified}).exec();

    if (endIndex <  await User.countDocuments({role: 'collector'}).exec()) {
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
    
    User.find({ verified: req.query.verified }).sort('-created_at').limit(limit).skip(startIndex).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Error occured"})
        }
        if (!user) {
            console.log(err);
            return res.json({error: true, status: 404, message: "User not found"})
        }
        
        return res.json({error: false, status: 201, pagination: results, total_users: total_users, user: user, message: "successful!" });
    });
}



export const fetch_logewaste_weight_by_recyclers = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewaste_logged = await RecyclerWaste.countDocuments().exec();

    if (endIndex <  await RecyclerWaste.countDocuments().exec()) {
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
    RecyclerWaste.find().sort('-created_at').populate('collection_centerid').populate('recycler_id').limit(limit).skip(startIndex).exec((err, ewaste) => {
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "Failed to fetch recycler ewaste weight logged"})
        }
        if (!ewaste) {
            return res.json({error: true, status: 404, message: "Cant not find recyceler e-waste weight logged"})
        }
        const waste_weight = ewaste.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);
        return res.json({error: false, status: 201, total_logged_ewaste: total_ewaste_logged, total_weight_logged_ton: waste_weight, pagination: results, ewaste: ewaste, message: "Fetch all logged ewaste successful!" });
    });
}

export const fetch_logewaste_weight_by_recyclers_id = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewaste_logged = await RecyclerWaste.countDocuments({recycler_id: req.params.id}).exec();

    if (endIndex <  await RecyclerWaste.countDocuments({recycler_id: req.params.id}).exec()) {
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
    RecyclerWaste.find({recycler_id: req.params.id}).sort('-created_at').populate('collection_centerid').populate('recycler_id').limit(limit).skip(startIndex).exec((err, ewaste) => {
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "Failed to fetch recycler ewaste weight logged"})
        }
        if (!ewaste) {
            return res.json({error: true, status: 404, message: "Cant not find recyceler e-waste weight logged"})
        }
        const waste_weight = ewaste.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);
        return res.json({error: false, status: 201, total_logged_ewaste: total_ewaste_logged, total_weight_logged_ton: waste_weight, pagination: results, ewaste: ewaste, message: "Fetch all logged ewaste by user successful!" });
    });
}

export const asign_collection_center_to_recyclers = (req, res) => {
    //  the user_id is the id of the user which is a collection center or collector while signing up
    User.findById({_id: req.body.recycler_id}).exec((err, user) => {
        // console.log("user", user)
        if (
            (!req.body.collection_center) ||
            (!req.body.role) ||
            (!req.body.recycler_id)
        ) {
            return res.status(401).send({error: true, message: "Collection center ID, Role and recycler ID are required"});
        }
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured"});
        }
        if (!user) {
            res.send({code: 404, error: true, message: 'Can not find user' });
        }
        if (user.role != 'recycler') {
            res.send({code: 404, error: true, message: 'user not a recycler' });
        }
        else {
            // collection_center is the user id of which has a role of collector.
            User.findById({_id: req.body.collection_center, role: 'collector'}).exec((err2, center) => {
                console.log("collection center", center);
                if (err2) {
                    return res.json({error: true, status: 401, message: "An error occured in getting collection center"});
                }
                if (!center) {
                    res.send({code: 404, error: true, message: 'Can not find collection center' });
                }
                if (center.collection_center_assigned === true) {
                    res.send({code: 400, error: true, message: 'collection center already assigned to a recycler' });
                } else {
                    center.collection_center_assigned = true;
                    center.save().then(result => {
                        const index = user.collection_center.includes(req.body.collection_center);
                        // console.log("index", index);
                        if (index === false) {
                            user.collection_center.push(req.body.collection_center);
                            user.save().then(result => {
                            res.json({ error: false, code: 200, status: 'success', message: 'collection center has been asigned to recycler'});
                            }).catch(err => {
                            // console.log(err.code);
                                res.send({ error: true, message: 'failed to asign collection center' });
                            });
                        } else {
                            res.send({ error: true, message: 'collection center already asigned to this recycler' });
                        }
                    }).catch(err => {
                            // console.log(err.code);
                        res.send({ error: true, message: 'failed to asign collection center' });
                    });
                }
            });
        
            // const index = user.collection_center.includes(req.body.collection_center);
            // console.log("index", index);
            // if (index === false) {
            //     user.collection_center.push(req.body.collection_center);
            //     user.save().then(result => {
            //         res.json({ error: false, code: 200, status: 'success', message: 'collection center has been asigned to recycler'});
            //     }).catch(err => {
            //         // console.log(err.code);
            //         res.send({ error: true, message: 'failed to asign collection center' });
            //     });
            // } else {
            //     res.send({ error: true, message: 'collection center already asigned to this recycler' });
            // }
        }
        
    })
}

export const remove_collection_center_recycler_user = (req, res) => {
    if (
        (!req.body.collection_center) ||
        (!req.body.role) ||
        (!req.body.recycler_id)
    ) {
        return res.status(401).send({error: true, message: "Collection center ID, role and recycler ID are required"});
    }
    User.findById({_id: req.body.recycler_id}).exec((err, user) => {
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured"})
        }
        if (!user) {
            res.send({code: 404, error: true, message: 'Can not find user' });
        }
        if (user.role != 'recycler') {
            res.send({code: 404, error: true, message: 'user not a recycler' });
        }
        else {
            console.log("centers", user)
            // the recycler id is the id of the user who is a recycler in this case.
            const index = user.collection_center.includes(req.body.collection_center);
            console.log("index", index);
            // if (!user.collection_center.includes(req.body.recycler_id)) {
            if (user.collection_center.length != 0) {
                user.collection_center.splice(user.collection_center.indexOf(req.body.collection_center), 1);
                user.save().then(result => {
                    User.findById({_id: req.body.collection_center}).exec((err, center) => {
                        if (!center) {
                            res.send({code: 404, error: true, message: 'Can not find collection center assigned' });
                        }
                        if (err) {
                            return res.json({error: true, status: 401, message: "An error occured while searching collection center"})
                        }
                        center.collection_center_assigned = false;
                        center.save();

                    });
                    res.json({ error: false, code: 200, status: 'success', message: 'collection center has been removed for this user'});
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to unasigncCollection center' });
                });
            } else {
                res.send({ error: true, code: 401, message: 'collection center was not asigned to this user' });
            }
            
        }
        
    })
}


export const fetch_recyclers_with_colection_center = (req, res) => {
    //  the user_id is the id of the user which is a collection center or collector while signing up
    if (
        (!req.params.collection_center) ||
        (!req.params.recycler_id)
    ) {
        return res.status(401).send({error: true, message: "Collection center ID and recycler ID are required"});
    }
    User.findById({_id: req.params.recycler_id}).populate('collection_center').exec((err, user) => {
        console.log("user", user)
        if (err) {
            return res.json({error: true, status: 401, message: "An error occured"});
        }
        if (!user) {
            res.send({code: 404, error: true, message: 'Can not find user' });
        }
        if (user.role != 'recycler') {
            res.send({code: 401, error: true, message: 'user not a recycler' });
        }
        if ( user.collection_center.length <= 0 ) {
            res.send({error: true, message: 'user not asigned a collection center' });
        }
        else {
        
            res.send({ error: false, data: user, message: 'success!' });
        }
        
    });
}

export const approved_documents_oem = (req, res) => {
    User.findById({_id: req.params.id, role: 'manufacturer'}).exec((err, user) => {
        if (err) {
            return res.status(401).send({error: true, message: "Error occurred"});
        }
        if (!user) {
            return res.status(404).send({error: true, message: "User not found"});
        }
        if (user.approved_documents === true) {
            return res.status(401).send({error: true, message: "Documents already approved"});
        }
        user.approved_documents = true;
        user.save().then(result => {
            res.json({ error: false, code: 200, status: 'success', message: 'documents approved'});
        }).catch(err => {
            // console.log(err.code);
            res.send({ error: true, err: err, message: 'server error, failed to approve document' });
        });
    });
}
export const disapprove_documents_oem = (req, res) => {
    User.findById({_id: req.params.id, role: 'manufacturer'}).exec((err, user) => {
        if (err) {
            return res.status(401).send({error: true, message: "Error occurred"});
        }
        if (!user) {
            return res.status(404).send({error: true, message: "User not found"});
        }
        if (user.approved_documents === false) {
            return res.status(401).send({error: true, message: "No documents approved yet"});
        }
        user.approved_documents = false;
        user.save().then(result => {
            res.json({ error: false, code: 200, status: 'success', message: 'documents approval reversed'});
        }).catch(err => {
            // console.log(err.code);
            res.send({ error: true, err: err, message: 'server error, failed to disapprove document' });
        });
    });
}

export const dashboard_counts = async (req, res) => {
    Log.find({}).exec((err, equipment) => {
        if (err) {
            return res.status(401).send({error: true, message: "Error occurred while feching manufacturer logged equipment"});
        }
        let logged_eqiupment_weight = equipment.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);

        const paid = equipment.filter((el) => {
            return el.paid === true
        });

        let total_payment_reciceved = paid.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.total;
        }, 0);
        Ewaste.find({}).exec((err, waste, next) => {
            if (err) {
                return res.status(401).send({error: true, message: "Error occurred while feching collection center logged ewaste"});
            }
            
            let logged_collection_center_waste_weight = waste.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue.weight;
            }, 0);
        
            RecyclerWaste.find({}).exec(async (err, recycler_waste) => {
                if (err) {
                    return res.status(401).send({error: true, message: "Error occurred while feching reycler logged ewaste"});
                }
                let logged_recycler_waste_weight = recycler_waste.reduce((previousValue, currentValue) => {
                    return previousValue + currentValue.weight;
                }, 0);

                // verified
                const recyclers = await User.countDocuments({role: 'recycler', verified: true}).exec();
                const manufacturers = await User.countDocuments({role: 'manufacturer', verified: true}).exec();
                const collectors = await User.countDocuments({role: 'collector', verified: true}).exec();
                const admin = await User.countDocuments({role: 'admin'}).exec();

                const unverified_recyclers = await User.countDocuments({role: 'recycler', verified: false}).exec();
                const unverified_manufacturers = await User.countDocuments({role: 'manufacturer', verified: false}).exec();
                const unverified_collectors = await User.countDocuments({role: 'collector', verified: false}).exec();
                const toal_requested_pickups = await RequestPickup.countDocuments({}).exec();

                let data = {
                    total_payment_reciceved: total_payment_reciceved,
                    recyclers: recyclers,
                    manufacturers: manufacturers,
                    collectors: collectors,
                    admin: admin,
                    unverified_recyclers: unverified_recyclers,
                    unverified_manufacturers: unverified_manufacturers,
                    unverified_collectors: unverified_collectors,
                    toal_requested_pickups: toal_requested_pickups,
                    manufacturers_logged_ewaste_weight: Math.round(logged_eqiupment_weight),
                    collection_centers_logged_ewaste_weight: Math.round(logged_collection_center_waste_weight),
                    recyclers_logged_ewaste_weight: Math.round(logged_recycler_waste_weight)
                }


                res.json({ error: false, code: 200, status: 'success', data});
            });
        });
    });
}


export const search_user_varibles = async (req, res) => {
    // console.log('Search', req.query.search);
    let query = { name: req.query.search };
    // let regex = new RegExp(query,'i');

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_users = await User.countDocuments({$or: [
        {'name': {$regex: req.query.search, $options: 'i'}},
        {'email': {$regex: req.query.search, $options: 'i'}},
        ]}).exec();

    if (endIndex <  await User.countDocuments({$or: [
        {'name': {$regex: req.query.search, $options: 'i'}},
        {'email': {$regex: req.query.search, $options: 'i'}},
        ]}).exec()) {
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
    User.find({
        $or: [
        {'name': {$regex: req.query.search, $options: 'i'}},
        {'email': {$regex: req.query.search, $options: 'i'}},
        ]
    }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).send({error: true, message: "Error occurred while feching users"});
        }
        if (!user) {
            return res.status(404).send({error: true, message: "can not find users"});
        }
        res.json({error: false, message: 'success', pagination: results, total_users: total_users, users: user, code: 200});
        // console.log('search', search);
    }),((err) => {
        // console.log(err);
        res.send({error: true, message: 'server error'});
    });
}



// Search Log equipments only user by name and email
// export const search_logged_equipment_with_varibles = (req, res) => {
//     console.log('Search', req.query.search);
//     let query = { name: req.query.search };
//     // let regex = new RegExp(query,'i');
//     User.find({
//         $or: [
//         {'name': {$regex: req.query.search, $options: 'i'}},
//         {'email': {$regex: req.query.search, $options: 'i'}},
//         ]
//     }).exec((err, user) => {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         res.json(user);
//         // console.log('search', search);
//     });
// }


// Search Log equipments only user by name and email
export const search_logged_equipment_with_varibles  = (req, res, next) => {
    // console.log('Search', req.query.search);

    User.find({$text: { $search: req.query.search, $diacriticSensitive: false}}, { score: { $meta: "textScore" } }).sort( 
        {  score: { $meta : 'textScore' } }).exec((err, user) => {
        if (err) {
            return res.status(401).send({error: true, message: "Error occurred while feching users"});
        }
        if (!user) {
            return res.status(401).send({error: true, code: 404, message: "User not found"});
        }
        console.log("User serced for", user);
        // return res.send({error: false, message: "User searched done", user});

        // Log.find({ user_id: user[0]._id }).populate('category_id').populate('sub_category_id').populate('user_id').exec((err, search) => {
        // if (err) {
        //     console.log(err);
        //     return res.send(err);
        // }
        // res.json({search, user});
        // // console.log('search', search);
        // }),((err) => {
        //     // console.log(err);
        //     res.send({error: true, message: 'An error while seaching logged equipment'});
        // });

    })

    
}



export const find_user_by_date_range = async (req, res) => {

    let { startDate, endDate } = req.query;

    if(startDate === '' || endDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ startDate, endDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_users = await User.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec();

    if (endIndex <  await User.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec()) {
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
    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    User.find({ 
        created_at: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            //   $gte: new Date(new Date(startDate)),
            //   $lt: new Date(new Date(endDate))
               }
        }).sort('-created_at').limit(limit).skip(startIndex).exec((err, users) => {
        // console.log("users", users)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!users) {
            return res.json({error: true, status: 404, message: "Cant not find users"})
        }
        return res.json({error: false, status: 201, total_users: total_users, pagination: results, users: users, message: "success!" });
    });
}

export const find_user_by_specific_date = async (req, res) => {

    let { actualDate } = req.query;

    if(actualDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick a dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ actualDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_users = await User.countDocuments({created_at: actualDate}).exec();

    if (endIndex <  await User.countDocuments({created_at: actualDate}).exec()) {
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
    // $gte: new Date(2012, 7, 14), 
    // $lt: new Date(2012, 7, 15)

    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    User.find({ 
        created_at: 
        {
            // new Date(actualDate)
            $gte: new Date(actualDate),
            $lt: new Date(actualDate)
        }
               
        }).sort('-created_at').limit(limit).skip(startIndex).exec((err, users) => {
        // console.log("users", users)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!users) {
            return res.json({error: true, status: 404, message: "Cant not find users"})
        }
        return res.json({error: false, status: 201, total_users: total_users, pagination: results, users: users, message: "success!" });
    });
}

export const find_equipment_by_date_range = async (req, res) => {

    let { startDate, endDate } = req.query;

    if(startDate === '' || endDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ startDate, endDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_equipments = await Log.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec();

    if (endIndex <  await Log.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec()) {
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
    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    Log.find({ 
        created_at: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            //   $gte: new Date(new Date(startDate)),
            //   $lt: new Date(new Date(endDate))
               }
        }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec((err, equipments) => {
        // console.log("equipments", equipments)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!equipments) {
            return res.json({error: true, status: 404, message: "Cant not find equipments"})
        }
        return res.json({error: false, status: 201, total_equipments: total_equipments, pagination: results, equipments: equipments, message: "success!" });
    });
}

export const search_ewaste_by_date_range = async (req, res) => {

    let { startDate, endDate } = req.query;

    if(startDate === '' || endDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ startDate, endDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewastes = await Ewaste.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec();

    if (endIndex <  await Ewaste.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec()) {
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
    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    Ewaste.find({ 
        created_at: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            //   $gte: new Date(new Date(startDate)),
            //   $lt: new Date(new Date(endDate))
               }
        }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec((err, ewaste) => {
        // console.log("equipments", equipments)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!ewaste) {
            return res.json({error: true, status: 404, message: "Cant not find ewaste"})
        }
        return res.json({error: false, status: 201, total_ewastes: total_ewastes, pagination: results, ewaste: ewaste, message: "success!" });
    });
}


export const search_recyclerEwaste_by_date_range = async (req, res) => {

    let { startDate, endDate } = req.query;

    if(startDate === '' || endDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ startDate, endDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_recyclerEwastes = await RecyclerWaste.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec();

    if (endIndex <  await RecyclerWaste.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec()) {
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
    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    RecyclerWaste.find({ 
        created_at: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            //   $gte: new Date(new Date(startDate)),
            //   $lt: new Date(new Date(endDate))
               }
        }).sort('-created_at').limit(limit).skip(startIndex).populate('user_id').exec((err, ewaste) => {
        // console.log("equipments", equipments)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!ewaste) {
            return res.json({error: true, status: 404, message: "Cant not find recycler's ewaste"})
        }
        return res.json({error: false, status: 201, total_recyclerEwastes: total_recyclerEwastes, pagination: results, ewaste: ewaste, message: "success!" });
    });
}

export const search_requestedPickups_by_date_range = async (req, res) => {

    let { startDate, endDate } = req.query;

    if(startDate === '' || endDate === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
        })
    }
     
       //2. check that date is in the right format
      //expected result: YYY-MMM-DDD
        // console.log({ startDate, endDate});

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_requestedPickups = await RequestPickup.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec();

    if (endIndex <  await RequestPickup.countDocuments({created_at: { $gte: new Date(new Date(startDate).setHours(0, 0, 0)), $lt: new Date(new Date(endDate).setHours(23, 59, 59)) }}).exec()) {
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
    // $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    // $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    RequestPickup.find({ 
        created_at: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            //   $gte: new Date(new Date(startDate)),
            //   $lt: new Date(new Date(endDate))
               }
        }).sort('-created_at').limit(limit).skip(startIndex).exec((err, requestedPickups) => {
        // console.log("equipments", equipments)
        if (err) {
            // console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "error occured"})
        }
        if (!requestedPickups) {
            return res.json({error: true, status: 404, message: "Cant not find requested pickups"})
        }
        return res.json({error: false, status: 201, total_requestedPickups: total_requestedPickups, pagination: results, requestedPickups: requestedPickups, message: "success!" });
    });
}


// async function main() {
//     const res = await httpsPost({
//         hostname: 'sentry.io',
//         path: `/api/0/organizations/org/releases/${changesetId}/deploys/`,
//         headers: {
//             'Authorization': `Bearer ${process.env.SENTRY_AUTH_TOKEN}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             environment: isLive ? 'production' : 'demo',
//         })
//     })
// }

// Pelpay paymet gateway for epron

// schedule.scheduleJob('*/60 * * * * *', async function() {
//     // This will run every Monday at 10:30;
//     // payment_login();
//     // console.log("environemt variables", config.PELPAYMENT_CLIENT_ID);
//     pelpay_payment_login();
//     // console.log('hey One Minute');
// });

schedule.scheduleJob('0 * * * *', async function() {
    // This will run every One Hour;
     pelpay_payment_login();
    // console.log('hey! One Hour');
});


export const pelpay_payment_login = (req, res) => {
    request({
        url: "https://api.pelpay.africa/api/Account/login",
        method: "POST",
        json: true,   // <--Very important!!!
        body: paydata
    }, 
    function (error, req, body) {
        if (!error) {
            let token = new Pelpay({
                access_token: body.access_token,
                created_at: Date.now(),
                updated_at: Date.now()
            });
            Pelpay.findOne((err, access) => {
                // console.log('query data', access)
                if (err) {
                    console.log(err);
                }
                if (!access) {
                    token.save().then(data => {
                    res.status(201).json({token: data, error: false, message: "access token saved successful!" });
                        console.log("new token", data);
                    }).catch(err => {
                        console.log(err);
                        // res.status(401).send({error: true, message: "Failed to save access token"});
                    });
                } else {
                    access.access_token = body.access_token,
                    access.updated_at = Date.now()
                    access.save().then(result => {
                        // console.log("Updateeeeeeeeeeeeeeeee",  result);
                        res.status(201).json({token: result, error: false, message: "token update successful" });
                    }).catch(err => {
                        // console.log(err);
                        // res.send({ error: true, message: 'failed to update token' });
                    });
                }
            });
        }   
        
    });
    
}

export const pelpay_advice = (req, res) => {
    Pelpay.findOne((err, access) => {
        // console.log('query data', access)
        if (err) {
            console.log(err);
        }
        if (access) {
            // console.log("Access key", access);
            // Authorization
            // req.headers['x-access-token'] =  access.access_token;
            if (!access.access_token) return res.status(401).send({ auth: false, message: 'No token provided in headers' });
            req.body.integrationKey = process.env.INTEGRATION_KEY;
          request({
                url: "https://api.pelpay.africa/Payment/advice",
                method: "POST",
                json: true, // <--Very important!!!
                headers :{
                    Authorization:"Bearer " + access.access_token // token
                },
                // Authorization: Bearer `${access.access_token}`,
                body: req.body,
                // response: res
            },
            (error, response, body) => {
                // console.log("error advice", error)
                // console.log("Bodyyyyyyyy", req.body);
                const jsonContent = JSON.stringify(response.body);
                res.end(jsonContent);
                
            });
        } else {
            res.status(404).send({error: true, message: "access token not found in db"});
        }
    });
}

export const verify_payment = (req, res) => {
    Pelpay.findOne((err, access) => {
        // console.log('query data', access)
        if (err) {
            console.log(err);
        }
        if (access) {
            // console.log("Access key", access);
            // Authorization
            // req.headers['x-access-token'] =  access.access_token;
            if (!access.access_token) return res.status(401).send({ auth: false, message: 'No token providedin headers' });
            req.body.integrationKey = process.env.INTEGRATION_KEY;
          request({
                url: `https://api.pelpay.africa/Transaction/bypaymentreference/${req.params.ref}`,
                method: "GET",
                json: true, // <--Very important!!!
                headers :{
                    Authorization:"Bearer " + access.access_token // token
                },
                // Authorization: Bearer `${access.access_token}`,
                body: req.body,
                // response: res
            },
            (error, response, body) => {
                // console.log("error advice", error)
                // console.log("Bodyyyyyyyy", req.body);
                const jsonContent = JSON.stringify(response.body);
                res.end(jsonContent);
                
            });
        } else {
            res.status(404).send({error: true, message: "access token not found in db"});
        }
    });
}

const paydata = {
    clientId: "E-w0000071",
    clientSecret: "8cfbeed8-0932-4149-af1d-cba5695f64e9"
    // clientId: config.PELPAYMENT_CLIENT_ID,
    // clientSecret: config.PELPAYMENT_CLIENT_SECRET
};

// Pelpay payment ends











