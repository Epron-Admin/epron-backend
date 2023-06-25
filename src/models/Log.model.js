import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let logEquipment = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    sub_category_id: {
        type: Schema.Types.ObjectId,
        ref:'CategoryTypes',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        // required: true
    },
    weight: {
        type: Number,
        // required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    // unit_price: {
    //     type: Number,
    //     // required: true
    // },
    unit_weight: {
        type: Number,
        // required: true
    },
    payment_id: {
        type: String,
    },
    paid: {
        type: Boolean,
        default: false,
        // required: true
    },
    equipment_pin: {
        type: String,
        // required: true,
    },
    pickedup: {
        type: Boolean,
        default: false,
    },
    reference: {
        type: String,
    },
    // pelpay_merchantRef: {
    //     type: String,
    // },
    ready_pickup: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});


// logEquipment.index({
//     user_id: 1,
//     // email: 1
// });

// logEquipment.index({'$**': 'text'});


export default mongoose.model('Log', logEquipment);
// remember to change it to logEquipment on deployment.