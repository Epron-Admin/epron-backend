import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let RecyclerWaste = new Schema({
    weight: {
        type: Number,
        required: true
    },
    unit_weight: {
        type: Number,
        required: true    
    },
    recycler_id: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true    
    },
    unit: {
        type: String,
        required: true    
    },
    ewaste_code: {
        type: String,
        required: true
    },
    collection_centerid: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('RecyclerWaste', RecyclerWaste);