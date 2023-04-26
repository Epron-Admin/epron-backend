import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let equip = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    sub_category_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sub_category_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        // required: true
    },
    total: {
        type: Number,
        // required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false,
    //     // required: true
    },
    equipment_pin: {
        type: String,
        // required: true,
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('Equip', equip);