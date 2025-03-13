import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  const localURI = process.env.MONGODB_LOCAL_DB;
  const atlasURI = process.env.MONGODB_ATLAS_DB;

  try {
    // Attempt to connect to local MongoDB first
    const conn = await mongoose.connect(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to Local MongoDB: ${conn.connection.host}`);
  } catch (localError) {
    console.warn(`⚠️ Local MongoDB connection failed: ${localError.message}`);

    try {
      // If local connection fails, connect to MongoDB Atlas
      const conn = await mongoose.connect(atlasURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
    } catch (atlasError) {
      console.error(`❌ MongoDB Atlas connection failed: ${atlasError.message}`);
      process.exit(1); // Exit if both connections fail
    }
  }
};

export default connectDB;
