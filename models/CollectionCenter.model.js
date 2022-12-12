import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let CollectionCenter = new Schema({
    user_id: {
        type: String,
        required: true
    },
    recyclers: [{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});



export default mongoose.model('CollectionCenter', CollectionCenter);