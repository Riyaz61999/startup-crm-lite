import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (fallback in case it wasn't called in server.js)
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI specified in environment variables.
 * Exits process with failure code (1) if connection fails.
 * 
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
