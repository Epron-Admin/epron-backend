
// import Collection from '../../models/CollectionCenter.model.js';
import User from '../../models/User.model.js'
import Ewaste from '../../models/Ewaste.model.js';
import Types from '../../models/CategoryTypes.model.js';
import RequestPickup from '../../models/RequestPickup.model.js';
import console from 'console';

 
// export const new_collection_ceneter = (req, res) => {
//     if ((!req.body.name) ||
//        (!req.body.address) ||
//        (!req.body.user_id) ||
//        (!req.body.lga) ||
//        (!req.body.lat) ||
//        (!req.body.long)
//     ) 
//     {
//         // console.log("All not filled");
//         return res.status(401).send({error: true, message: "Name, address, lga, lat, long, user_id are required"});
//     } 
//     let collection = new Collection({
//         name: req.body.name,
//         address: req.body.address,
//         user_id: req.body.user_id,
//         lga: req.body.lga,
//         lat: req.body.lat,
//         long: req.body.long,
//         created_at: Date.now(),
//         updated_at: Date.now()

//     });
//     collection.save().then(result => {
//         res.json({error: false, code: 201, status: 'success', message: 'collection center added successfully', 'collection_centers': result });
//     }).catch(err => {
//         // console.log(err);
//         res.send({ error: true, message: 'failed to add data' });
//     });
// }

// export const fetch_all_collection_centers = (req, res) => {
//     Collection.find({}).populate('user_id').sort('-created_at').exec((err, collection) => {
//         if (err) {
//             console.log(err);
//             return res.send({error: true, code: 401, message: "Failed to fecth your collecton centers"});
//             // return res.send(err);
//         }
//         return res.json({error: false, code: 201, status: 'success', message: 'fetch all categories', centers: collection });
//         // res.send(category);
//     });
// }

export const fetch_collection_centers_by_userid = (req, res) => {
    User.findById({_id: req.params.id}).sort('-created_at').exec((err, centers) => {
        if (err) {
            // console.log(err);
            return res.status(401).send({error: true, message: "error occured"});
        }
        if (!centers) {
            // console.log(err);
            return res.status(404).send({error: true, message: "collection centers not found"});
        }
        return res.status(201).send({error: false, message: "success", collection_centers: centers});

    });
}

// export const remove_collection_center = (req, res) => {
//     Collection.findByIdAndRemove({ _id: req.params.id }, (err, center) => {
//         if (err) {
//             return res.json({error: true, status: 401, message: "failed to delete collection center"});
//         }
//         else {
//             return res.json({error: false, status: 201, message: "success!" });
//         }
//     });
// }

// export const update_center = (req, res) => {
//     let ton_weight = '';
//     if ((!req.body.name) ||
//         (!req.body.address) ||
//         // (!req.body.user_id) ||
//         (!req.body.lga) ||
//         (!req.body.lat) ||
//         (!req.body.long)
//     ) 
//     {
//      // console.log("All not filled");
//      return res.status(401).send({error: true, message: "Name, address, lga, lat and long are required"});
//     }
//     Collection.findById({_id: req.params.id}, (err, center) => {
//         if (err) {
//             res.send({code: 505, error: true, err: err, message: 'error occured' });
//             console.log(err);
//         }
//         if (!center)
//             res.send({code: 404, error: true, message: 'Can not find collection center' });
//             // return next(new Error('Could not load document'));
//         else {
//             // console.log('The user', user);
//             // console.log('the body', req.body);

//             center.name = req.body.name,
//             center.address = req.body.address,
//             // center.user_id = req.body.user_id,
//             center.lga = req.body.lga,
//             center.lat = req.body.lat,
//             center.long = req.body.long,
//             center.updated_at = Date.now()


//             center.save().then(result => {
//                 res.json({ error: false, code: 200, status: 'success', 'collection center  ': result });
//                 //res.status(200).send({mssage: 'update successful'});
//             }).catch(err => {
//                 console.log(err.code);
//                 res.send({ error: true, message: 'failed to update collection' });
//             });
//         }
//     });
// }

export const log_single_ewaste = async (req, res) => {
    if (
        (!req.body.category_id) ||
        // (!req.body.category_name) ||
        // (!req.body.price) ||
        (!req.body.sub_category_id) ||
        // (!req.body.sub_category_name) ||
        (!req.body.quantity) ||
        (!req.body.weight) ||
        (!req.body.unit) ||
        (!req.body.user_id)
        ) {
        return res.status(401).send({error: true, message: "Category_id, unit, type, quantity, weight and user_id are required"});
    } 

    await User.findById({_id: req.body.user_id, role: 'collector'}).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        if (user.role != 'collector') {
            return res.status(401).send({error: true, message: "This user can not log e-waste"});
        }
        else {
            let ton_weight;
         Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
            if (err) {
                console.log(err);
                return res.json({error: true, status: 401, message: "Failed fetch types"})
            }
            if (!type) {
                return res.json({error: true, status: 404, message: "Sub category not found" });
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
            let ewaste = new Ewaste({
                category_id: req.body.category_id,
                // category_name: req.body.category_name,
                // unit_price: type.price,
                price: type.price,
                total: Math.round(total),
                sub_category_id: req.body.sub_category_id,
                // sub_category_name: req.body.sub_category_name,
                quantity: req.body.quantity,
                weight: ton_weight,
                unit: req.body.unit,
                unit_weight: req.body.weight,
                user_id: req.body.user_id,
                ewaste_pin: pin,
                created_at: Date.now(),
                updated_at: Date.now()
        
            });
            ewaste.save()
            .then(data => {
                res.status(201).json({ewaste: data, error: false, message: "e-Waste saved successful!" });
            })
            .catch(err => {
                console.log(err);
                res.status(401).send({error: true, message: "Failed to save e-Waste"});
            });
        });
        }
    });
}



export const fetch_ewaste_by_user = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
  
    const total_ewaste_logged = await Ewaste.countDocuments({user_id: req.params.id}).exec();
    const total_ewaste_pickedup = await Ewaste.countDocuments({user_id: req.params.id, pickedup: true}).exec();


    if (endIndex <  await Ewaste.countDocuments({user_id: req.params.id}).exec()) {
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
    Ewaste.find({user_id: req.params.id}).populate('category_id').populate('sub_category_id').sort('-created_at').limit(limit).skip(startIndex).exec((err, waste) => {
        // console.log("ewasteeeeeeeeeeeeeeeee", waste)
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch user logged ewaste"})
        }
        const waste_weight = waste.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
        }, 0);
        return res.json({error: false, status: 201, total_ewaste_pickedup: total_ewaste_pickedup, total_logged_ewaste: total_ewaste_logged, total_weight_logged: waste_weight, pagination: results, ewaste: waste, message: "Fetch all logged ewaste successful!" });
    });
}


export const update_logged_ewaste = async (req, res) => {
    if (
        (!req.body.category_id) ||
        // (!req.body.category_name) ||
        (!req.body.price) ||
        (!req.body.unit) ||
        (!req.body.sub_category_id) ||
        // (!req.body.sub_category_name) ||
        (!req.body.quantity) ||
        (!req.body.weight)
        // (!req.body.user_id)
        ) {
        return res.status(401).send({error: true, message: "Category_id, price, unit, type, quantity, weight and are required"});
    }
    Ewaste.findById(req.params.id, (err, ewaste) => {
        if (err) {
            console.log(err);
        }
        // if (log.paid === true) {
        // return res.status(401).send({error: true, message: "you can not update this log"});
        // }
        if (ewaste.pickedup === true) {
            // return next(new Error('Could not find logged eqiupment'));
            return res.status(404).send({error: true, message: "You can not update this ewaste, it has been picked up"});
        }
        if (!ewaste) {
            // return next(new Error('Could not find logged eqiupment'));
            return res.status(404).send({error: true, message: "Could not find logged ewaste"});
        }   
        else {

            Types.findById({ _id: req.body.sub_category_id }).exec((err, type) => {
                if (err) {
                    console.log(err);
                    return res.json({error: true, status: 401, message: "Failed fetch types"})
                }
                if (req.body.price != type.price) {
                    return res.json({error: true, status: 401, message: "The type price does not match" });
                }
                // res.json({error: false, status: 201, requests: type, message: "fetch all types successful!" });
                const total = type.price *  req.body.quantity * req.body.weight;
            // });

            ewaste.category_id = req.body.category_id,
            // ewaste.category_name = req.body.category_name,
            ewaste.price = type.price,
            ewaste.total = total,
            ewaste.unit = unit,
            ewaste.sub_category_id = req.body.sub_category_id,
            // ewaste.sub_category_name = req.body.sub_category_name,
            ewaste.quantity = req.body.quantity,
            ewaste.weight = req.body.weight,
            // log.user_id = req.body.user_id,
            // log.equipment_pin = pin,
            ewaste.updated_at = Date.now()
            // user.body.user = req.body;
            ewaste.save().then(result => {
                res.status(201).json({log: result, error: false, message: "Ewaste update successful" });
                // res.json({ 'log': result });
                //res.status(200).send({mssage: 'update successful'});
            }).catch(err => {
                console.log(err);
                res.send({ error: true, message: 'failed to update ewaste' });
            });
        });
        }
        
    });
}

export const remove_log_ewaste = (req, res) => {
    Ewaste.findByIdAndRemove({ _id: req.params.id }).exec((err, ewaste) => {
        if (err) {
            return res.json({error: true, status: 401, message: "failed to delete waste"});
            // res.json(err);
        }
        if (ewaste.pickedup === true) {
            return res.status(404).send({error: true, message: "you can not delete this e-waste, it has been picked up"});
        }
        if (!ewaste) {
            return res.status(404).send({error: true, message: "e-waste not found"});
        }
        return res.status(401).send({error: true, message: "e-waste has been deleted succuesfuly"});
    });
}

export const accept_request_pickup = async (req, res) => {
    RequestPickup.findById({_id: req.body.id, accept_request: false}).exec((err, pickup) => {
        if (err) {
            // console.log("errrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "Error oocured"});
        }
        if (!pickup) {
            return res.status(404).send({error: true, message: "pickup request not found"});
        } else {
            if ( pickup.accept_request === false) {
                pickup.accept_request = true;
                pickup.accepted_by = req.body.user_id;
                pickup.save().then((result) => {
                    return res.status(200).send({error: false, message: "Pickup has been accepted by you succuesfuly"});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to accept pickup' });
                });
            } else {
                return res.json({error: true, status: 401, message: "Pickup has already been picked"});
            }
            
        }
    });
}

export const update_ewaste_to_ready_pickup = (req, res) => {
    Ewaste.findById({_id: req.body.id, user_id: req.body.user_id}).exec((err, waste) => {
        if (err) {
            // console.log("errrrrrrrrrrrr", err);
            return res.json({error: true, status: 401, message: "Error oocured"});
        }
        if (waste.user_id != req.body.user_id) {
            return res.status(404).send({error: true, message: "collection center not found"});
        } 
        if (!waste) {
            return res.status(404).send({error: true, message: "pickup request not found"});
        } 
        else {
            if ( waste.ready_pickup === false) {
                waste.ready_pickup = true;
                waste.save().then((result) => {
                    return res.status(200).send({error: false, code: 200, message: 'success', message: "e-waste ready for pick up"});
                }).catch(err => {
                    // console.log(err.code);
                    res.send({ error: true, message: 'failed to update e-waste' });
                });
            } else {
                return res.json({error: true, status: 401, message: "e-waste already set for pick up"});
            }
            
        }
    });
}

// export const new_sub_cateory = (req, res) => {
//     console.log("reqquests", req.body);
//     if ((!req.body.name) || (!req.body.category_id) || (!req.body.price)) {
//         // console.log("All not filled");
//         return res.status(401).send({error: true, message: "Name and category id are required"});
//     } 
//     let types = new Types({
//         name: req.body.name,
//         price: req.body.price,
//         category_id: req.body.category_id,
//         created_at: Date.now(),
//         updated_at: Date.now()

//     });
//     Types.findOne({ name: req.body.name }).exec((err, doc, next) => {
//         if (err) {
//             return res.status(401).send({error: true, code: 401, message: "An error occcured"});
//         }
//         if (doc) {
//             return res.send({error: true, message: 'type category name already exists.'});
//         }
//         let id = types.category_id;
//         types.save().then(result => {
//             console.log("Type reusult:", result);
//             Category.findById(id).then((docs) => {
//                 if(!docs) {
//                     return res.status(404).send();
//                 }
//                 docs.types.push(result);
//                 docs.save();
//                 return res.json({error: false, code: 201, status: 'success', message: 'type category created successfuly', type: result });

//             }).catch((e) => {
//                 return res.send(e).status(404);
//             })
//             // return res.json({error: false, code: 201, status: 'success', message: 'sub category created successfuly', type: result });
//             // res.status(200).send({mssage: 'Category created successful'});
//         }).catch(err => {
//             console.log(err);
//             return res.send({ error: true, message: 'failed to add data' });
//         });
//     })
// }










