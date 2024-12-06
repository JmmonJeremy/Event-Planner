import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

interface ICelebration extends Document {
  person: string;
  occasion: string;
  plan: string;
  user: IUser | mongoose.Types.ObjectId; // User can either be populated (IUser) or just an ObjectId
  date: Date;
  location: string;
  othersInvolved: Array<string>;
  visibility: string;
}

const celebrationSchema: Schema = new Schema({
  person: { type: String, required: true },
  occasion: { type: String, required: true },
  plan: {type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
  date: { type: Date, required: true },
  location: {type: String, required: true },
  othersInvolved: { type: Array<String>, required: true },
  visibility: { type: String, enum: ['Private', 'Public'], default: 'Public', required: true },
},
{ timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.model<ICelebration>('Celebration', celebrationSchema);