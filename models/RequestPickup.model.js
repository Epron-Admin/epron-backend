import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let requestPickup = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        required: true
    },
    lga: {
        type: String,
        required: true
    },
    // stateid: {
    //     type: String,
    //     required: true
    // },
    // city: {
    //     type: String,
    //     required: true
    // },
    // cityid: {
    //     type: String,
    //     required: true
    // },
    completed: {
        type: Boolean,
        default: false
    },
    accept_request: {
        type: Boolean,
        default: false,
        required: true
    },
    accepted_by: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    request_code: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pickup_date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('RequestPickup', requestPickup);