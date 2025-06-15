import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully');
  } catch (err: any) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;