import mongoose, { ConnectOptions } from "mongoose";

const connectDb = () => {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/authentification-ts";

    const options : ConnectOptions = {
        
    }

    try {
        mongoose.connect(MONGODB_URI,options);
        console.log('Connect succeeded');
    } catch (error) {
        console.log('Could not connect '+error)
    }
}

export default connectDb;

