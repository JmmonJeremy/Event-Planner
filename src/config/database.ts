import mongoose from 'mongoose'; 
require('dotenv').config(); 

const mongoURI = process.env.MONGO_URI as string; 

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
    });
    console.log('Connected to MongoDB using Mongoose!');

  // In TypeScript, the error in the catch block is of type unknown by default. You can either cast the
  // error to a more specific type (e.g., Error) or define the type of the error in your catch block.
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to connect to MongoDB:', err.message);
    } else {
      console.error('Failed to connect to MongoDB: Unknown error');
    }
    throw err;  // Re-throw the error if necessary
  }
}

export { connectDB };
