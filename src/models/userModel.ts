import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the TypeScript interface for the User
export interface IUser extends Document {
  googleId?: string;
  githubId?: string;
  email: string;
  password?: string; // Optional for OAuth users
  displayName: string;
  firstName: string;
  lastName: string;
  image: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  createdAt: Date;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String },
    githubId: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      collation: { locale: 'en', strength: 2 },
    },
    password: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls to not conflict with unique constraint
    },
    displayName: { type: String, required: true, default: "CreationGoal User" },
    firstName: { type: String, required: true, default: "CreationGoal" },
    lastName: { type: String, required: true, default: "User" },
    image: {
      type: String,
      required: true,
      default: "https://ibb.co/jTH610t",
    },
    bio: { type: String },
    location: { type: String },
    company: { type: String },
    website: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'users' } // Explicitly set the collection name
);

// Create the model
const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// Export the model
export default UserModel;
