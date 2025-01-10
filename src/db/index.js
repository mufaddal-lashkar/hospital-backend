import mongoose from "mongoose";

const connectDB = async () => {
    const DB_NAME = "Hospital"
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            writeConcern: {
                w: 'majority'  // Ensure this is set correctly
            }
        })
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed", error);
        process.exit(1)
    }
}

export default connectDB