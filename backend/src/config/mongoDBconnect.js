import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({path: './.env'});
 
const connectDB = async () => {
  const localURI = "mongodb://localhost:27017/ln";
  const atlasURI = "mongodb+srv://comradesAdmin:wAbl4MwCTKAhfdNP@cluster0.5ztrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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
connectDB()

export default connectDB;
