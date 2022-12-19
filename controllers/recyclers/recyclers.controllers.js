import RequestPickup from '../../models/RequestPickup.model.js';
import Ewaste from '../../models/Ewaste.model.js';
import RecyclerWaste from '../../models/RecyclerWaste.model.js'
import User from '../../models/User.model.js'
// import Center from '../../models/CollectionCenter.model.js'
// import express from 'express';


export const fetch_all_pickup_by_location = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

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
    
    RequestPickup.find({}).sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
       
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
       
        return res.json({error: false, status: 201, pagination: results, requests: requestpickup, message: "All request for pickup successful!" });
    });
}


export const fetch_ewaste_by_collection_center = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewaste_logged = await Ewaste.countDocuments({user_id: req.body.user_id}).exec();

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
    Ewaste.find({user_id: req.body.user_id}).sort('-created_at').limit(limit).skip(startIndex).exec((err, ewaste) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed to fetch center ewaste"})
        }
        if (!ewaste) {
            return res.json({error: true, status: 404, message: "Cant not find e-waste"})
        }
        const waste_weight = ewaste.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.weight;
          }, 0);
        return res.json({error: false, status: 201, total_logged_ewaste: total_ewaste_logged, total_weight_logged: waste_weight, pagination: results, ewaste: ewaste, message: "Fetch all logged ewaste successful!" });
    });
}


export const log_weight_from_collection_center_ewaste = async (req, res) => {
    if (
        (!req.body.weight) ||
        (!req.body.collection_centerid) ||
        (!req.body.unit) ||
        (!req.body.recycler_id)
    )
    {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Weight, unit, recycler_id and collection center ID are required"});
    }


    let ton_weight;
    if (req.body.unit === 'kg') {
        ton_weight = 0.00110231 * req.body.weight;
    }
    if (req.body.unit === 'g') {
        ton_weight = 0.0000011023 * req.body.weight;
    }
    const codePin = Math.random().toString(36).slice(2, 7);
    
    // collection cennter id is the user ID signed s collection center
    User.findById({ _id: req.body.collection_centerid}).exec((err, doc) => {
        console.log("User collection center", doc);
        if (err) {
            return res.status(401).send({error: true, code: 401, message: "An error occcured from collection center"});
        }
        if (!doc) {
            return res.send({error: true, code: 404, message: 'Collection center does not exist.'});
        }

        else {

            // const among = doc.recyclers.includes(req.body.recycler_id);

            // if (among === true) {
            //     let ewaste = new RecyclerWaste({
            //         weight: ton_weight,
            //         unit_weight: req.body.weight, 
            //         unit: req.body.unit,
            //         collection_centerid: req.body.collection_centerid,
            //         recycler_id: req.body.recycler_id,
            //         ewaste_code: codePin,
            //         created_at: Date.now(),
            //         updated_at: Date.now()
            
            //     });
            //     ewaste.save().then(result => {
            //         res.json({error: false, code: 201, status: 'success', message: 'weight added successfuly', weight: result });
            //         // res.status(200).send({mssage: 'Category created successful'});
            //     }).catch(err => {
            //         // console.log("Errorrrrrrrrrr", err);
            //         res.send({ error: true, message: 'failed to add data' });
            //     });
            // } else {
            //     return res.send({error: true, code: 404, message: 'Recycler not assigned to collection center.'});
            // }
        }
    })
}

export const fetch_logewaste_weight_by_recycler = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const total_ewaste_logged = await RecyclerWaste.countDocuments({recycler_id: req.params.recycler_id}).exec();

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
    RecyclerWaste.find({recycler_id: req.params.recycler_id}).populate('collection_centerid').sort('-created_at').limit(limit).skip(startIndex).exec((err, ewaste) => {
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