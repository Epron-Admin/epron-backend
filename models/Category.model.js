import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Category = new Schema({
    name: {
        type: String,
        required: true
    },
    category_code: {
        type: String,
        required: true
    },
    // types: {
    //     type: Array,
    // },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('Category', Category);