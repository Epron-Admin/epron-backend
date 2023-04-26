import mongoose from 'mongoose';
import bcrypt from 'bcrypt';



const Schema = mongoose.Schema;

let newUser = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    collection_center: [{
        type: Schema.Types.ObjectId,
        ref:'User',
    }],
    country: {
        type: String,
    },
    countryid: {
        type: String,
    },
    stateid: {
        type: String,
    },
    city: {
        type: String,
    },
    cityid: {
        type: String,
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    lga: {
        type: String,
    },
    lat: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true
        // default: 'user'
    },
    collection_center_assigned: {
        type: Boolean,
        default: false
    },
    epron_admin: {
        type: String,
        default: null
    },
    blocked: {
        type: Boolean,
        default: false
    },
    approved_documents: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    verifyToken: {
        type: String
    },
    verifyTokenExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    created_at: {
        type: Date, once: true, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }
});


newUser.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password, 10);
};


newUser.methods.isValid = function(hashedpassword){
    return bcrypt.compareSync(hashedpassword, this.password);
};


// newUser.index({
//     name: 1,
//     email: 1
// });
newUser.index({ name : 'text', email : 'text' });

 // when its a nested array;

// newUser.index({ 'arrayName.fieldname':'text'});

// For wild card with index array
// movieSchema.index({ "$**" : "text" })

// For While card indexing
// newUser.index({'$**': 'text'});



export default mongoose.model('User', newUser);