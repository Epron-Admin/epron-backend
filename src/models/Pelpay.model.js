import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let pelpay = new Schema({
    access_token: {
        type: String,
        required: true
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


export default mongoose.model('Pelpay', pelpay);
// remember to change it to logEquipment on deployment.