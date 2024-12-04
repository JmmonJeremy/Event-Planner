import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  googleId?: string; // Making googleId optional
  name: string;
  email: string;
  password?: string;
}

const userSchema: Schema = new Schema({
  googleId: { type: String, unique: true, sparse: true }, // Optional and indexed for unique values
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, unique: true, sparse: true }, // Optional and indexed for unique values
},
{ timestamps: true } // Correct placement of the timestamps option
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
