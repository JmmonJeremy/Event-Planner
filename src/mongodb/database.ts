import mongoose from 'mongoose'; 
require('dotenv').config(); 

const mongoURI = process.env.MONGO_URI as string; 

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
    });

    console.log('Connected to MongoDB using Mongoose!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err; 
  }
}

export { connectDB };
