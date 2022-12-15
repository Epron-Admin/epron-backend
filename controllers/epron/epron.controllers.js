
import Category from '../../models/Category.model.js';
import Types from '../../models/CategoryTypes.model.js';
import User from '../../models/User.model.js'
import Ewaste from '../../models/Ewaste.model.js';
import console from 'console';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import async from 'async';
import Collection from '../../models/CollectionCenter.model.js';
import RequestPickup from '../../models/RequestPickup.model.js';
import RecyclerWaste from '../../models/RecyclerWaste.model.js'

import Fake from '../../models/FakeUser.model.js'; // remove this import


 


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
                if (doc) {
                    return res.send({error: true, message: 'sub category name already exists.'});
                }
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
            return res.json({error: true, status: 401, message: "failed to delete category"});
        }
        else {
            Types.deleteMany({category_id: req.params.id}).exec((err, doc, next) => {
                if (doc) {
                    return res.send({error: true, message: 'success!', info: 'the deleted category has a sub category which has been deleted too'});
                } else {
                    return res.json({error: false, status: 201, message: "success!" });
                }
            });
        }
    });
}

export const remove_log_type = (req, res) => {
    Types.findByIdAndRemove({ _id: req.params.id }, (err, type) => {
        if (err) {
            return res.json({error: true, status: 401, message: "failed to delete category type"});
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
                            user: 'charlesamos003@gmail.com',
                            pass: 'xwytgfmmdpdnbajp'
                        }
                    });
                     
                    let mailDetails = {
                        from: 'Epron Admin <empron@gmail.com>',
                        to: req.body.email,
                        subject: 'Epron Registration',
                        text: 'You are receiving this because Epron have requested to sign you up as admin on Epron ' + ' please click on the following link, or paste this into your browser to complete the process:\n\n' + 'https://epron.netlify.app/verify/' + token + '\n\n' +
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
            console.log("errrrrrrrrrrrrrrrrrrrrrr", err);
            return res.send({error: true, code: 401, message: "Failed to add new epron admin user"});
        });
    });
    
};


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
    Ewaste.find({}).sort('-created_at').populate('category_id').populate('sub_category_id').limit(limit).skip(startIndex).exec((err, ewaste, next) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch logged equipment"})
        }
        else {
            return res.json({error: false, status: 201, pagination: results, ewaste: ewaste, message: "Fetch all logged ewaste successful!" });
        }
    });
}

export const asign_recycler_to_collection_center = (req, res) => {
    //  the user_id is the id of the user which is a collection center or collector while signing up
    Collection.findOne({user_id: req.body.collector_user_id}).exec((err, center) => {
        if (
            (!req.body.collector_user_id)
            (!req.body.recycler_user_id)
        ) {
            return res.status(401).send({error: true, message: "Collection center ID, and recycler ID are required"});
        }
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
            // the recycler id id the id of the user who is a recycler in this case.
            const index = center.recyclers.includes(req.body.recycler_user_id);
            console.log("index", index);
            if (index === false) {
                center.recyclers.push(req.body.recycler_user_id);
                center.save().then(result => {
                    res.json({ error: false, code: 200, status: 'success', message: 'user has been asigned to collection center'});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to asign user to collection' });
                });
            } else {
                res.send({ error: true, message: 'user already asigned to this collection center' });
            }
        }
        
    })
}

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
    RecyclerWaste.find().sort('-created_at').populate('collection_centerid').limit(limit).skip(startIndex).exec((err, ewaste) => {
        if (err) {
            console.log(err);
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

export const asign_collection_center_to_recyclers = (req, res) => {
    //  the user_id is the id of the user which is a collection center or collector while signing up
    User.findById({_id: req.body.recycler_id}).exec((err, user) => {
        console.log("user", user)
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
        
            const index = user.collection_center.includes(req.body.collection_center);
            console.log("index", index);
            if (index === false) {
                user.collection_center.push(req.body.collection_center);
                user.save().then(result => {
                    res.json({ error: false, code: 200, status: 'success', message: 'collection center has been asigned to recycler'});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to asign collection center' });
                });
            } else {
                res.send({ error: true, message: 'collection center already asigned to this recycer' });
            }
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
            // the recycler id id the id of the user who is a recycler in this case.
            const index = user.collection_center.includes(req.body.recycler_id);
            console.log("index", index);
            // if (!user.collection_center.includes(req.body.recycler_id)) {
            if (user.collection_center.length != 0) {
                user.collection_center.splice(index, 1);
                user.save().then(result => {
                    res.json({ error: false, code: 200, status: 'success', message: 'collection center has been removed for this user'});
                    //res.status(200).send({mssage: 'update successful'});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to asign Collection center' });
                });
            } else {
                res.send({ error: true, code: 401, message: 'collection center was not asined to this user' });
            }
            
        }
        
    })
}


// export const fetch_sub_categories = (res, req) => {
//     Category.find({visibility: true}).populate('category').exec((err, types) => {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         res.send(types);

//     });
// }








