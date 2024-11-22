import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import mongoose from 'mongoose';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB from db.ts')
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}



