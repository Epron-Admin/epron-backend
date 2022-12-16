
import RequestPickup from '../../models/RequestPickup.model.js';
import express from 'express';

import User from '../../models/User.model.js';
import querystring from 'querystring';


let userEmail;


const router = express.Router();


export const request_pickup = (req, res) => {
    if (
        (!req.body.name) ||
        (!req.body.address) ||
        (!req.body.phoneNumber) ||
        (!req.body.lga) ||
        (!req.body.state) ||
        (!req.body.description) ||
        (!req.body.pickup_date)
        ) {
        // console.log("All not filled");
        return res.status(401).send({error: true, message: "Name, address, phone, lga, pickup date, description and state are required"});
    } 
    const code = Math.random().toString(36).slice(2, 7);
    let pickup = new RequestPickup({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        request_code: code,
        // city: req.body.city,
        state: req.body.state,
        lga: req.body.lga,
        description: req.body.description,
        pickup_date: req.body.pickup_date,
        created_at: Date.now(),
        updated_at: Date.now()

    });
    pickup.save()
        .then(data => {
            res.status(201).json({requestdata: data, error: false, message: "Request pickup sent successful!" });
        })
        .catch(err => {
            console.log(err);
            res.status(401).send({error: true, message: "Failed to request pickup"});
    });
}

export const fetch_all_pickup = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments().exec();
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
    RequestPickup.find({}).sort('-created_at').populate("accepted_by").limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "All request for pickup successful!" });
    });
}

export const fetch_all_pickup_based_on_location = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({lga: req.params.location}).exec();

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
    RequestPickup.find({lga: req.params.location}).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "All request for pickup based on loaction successful!" });
    });
}

export const fetch_all_pickup_based_on_location_unaccepted = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({lga: req.params.location, accept_request: false}).exec();

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
    RequestPickup.find({lga: req.params.location, accept_request: false}).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "All request for pickup based on loaction and not accepted successful!" });
    });
}

export const fetch_all_pickup_based_on_location_accepted = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({lga: req.params.location, accept_request: true}).exec();

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
    RequestPickup.find({lga: req.params.location, accept_request: true}).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch all request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "All request for pickup based on loaction and accepted successful!" });
    });
}

export const fetch_all_pickup_based_on_location_anduser = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const total_pickups = await RequestPickup.countDocuments({accepted_by: req.params.id, lga: req.params.location, accept_request: true}).exec();

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
    RequestPickup.find({accepted_by: req.params.id, lga: req.params.location, accept_request: true}).populate("accepted_by").sort('-created_at').limit(limit).skip(startIndex).exec((err, requestpickup) => {
        if (err) {
            console.log(err);
            return res.json({error: true, status: 401, message: "Failed fetch request pickups"})
        }
        return res.json({error: false, status: 201, pagination: results, total: total_pickups, requests: requestpickup, message: "successful!" });
    });
}



















