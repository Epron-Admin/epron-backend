import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        // console.log("connect", process.env);
        const conn = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

// module.exports = connectDB;
export default connectDB;