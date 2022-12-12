import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Types = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type_code: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true,
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('CategoryTypes', Types);