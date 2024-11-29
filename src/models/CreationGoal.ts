import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './userModel';

// Define the interface for the CreationGoal document
export interface ICreationGoal extends Document {
  creationNumber: number;
  creationDate: Date;
  goal: string;
  motivator: string;
  desire: string;
  belief: string;
  knowledge: string;
  plan: string;
  action: string;
  victory: string;
  status: 'Public' | 'Private';
  user: IUser; // User reference
}

// Create the CreationGoal Schema
const CreationGoalSchema: Schema<ICreationGoal> = new Schema(
  {
        creationNumber: { 
          type: Number
        },
        creationDate: { 
          type: Date, 
          default: Date.now 
        },  
        goal: {
          type: String,
          required: true
        },
        motivator: {
          type: String,
          required: true
        },
        desire: {
          type: String,
          required: true
        },
        belief: {
          type: String,
          required: true
        },
        knowledge: {
          type: String,
          required: true
        },        
        plan: {
          type: String,
          required: true
        },   
        action: {
          type: String,
          required: true
        },
        victory: {
          type: String,
          required: true
        },
        status: {
          type: String,
          default: 'Private',
          enum: ['Public', 'Private']
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }             
      },
      { timestamps: true }
    );

  // Pre-save hook to set creationNumber and ensure creationDate is in the correct format
  CreationGoalSchema.pre<ICreationGoal>('save', async function (next) {
    try {
      let potentialNumber: number;

      // Ensure user is provided
      if (!this.user) {
        return next(new Error('User is required for creationGoal.'));
      }

      // Get all creationNumbers for the user and sort them
      const existingCreationNumbers = await mongoose
        .model<ICreationGoal>('CreationGoal')
        .find({ user: this.user })
        .sort({ creationNumber: 1 })
        .select('creationNumber');

      // If the user has no creationGoals, the starting number is 1
      if (existingCreationNumbers.length === 0) {
        potentialNumber = 1;
      } else {
        // Find the smallest gap in the creation numbers
        let number = 1;
        for (let i = 0; i < existingCreationNumbers.length; i++) {
          if (existingCreationNumbers[i].creationNumber !== number) {
            break;
          }
          number++;
        }
        potentialNumber = number; // The next available number
      }
  
      // Now check if the calculated potentialNumber exists for this user
      let exists = await mongoose
      .model<ICreationGoal>('CreationGoal')
      .findOne({ creationNumber: potentialNumber, user: this.user });
      while (exists) {
        potentialNumber++; // Increment until a unique number is found
        exists = await mongoose
        .model<ICreationGoal>('CreationGoal')
        .findOne({ creationNumber: potentialNumber, user: this.user });
      }

      // Assign the unique number to this.creationNumber
      this.creationNumber = potentialNumber;      
  
      // Handle the creationDate similarly
      if (this.creationDate && typeof this.creationDate === 'string') {
        const parsedDate = new Date(this.creationDate);
  
        if (!isNaN(parsedDate.getTime())) {
          this.creationDate = parsedDate;
        } else {
          this.creationDate = new Date();
        }
      } else if (!this.creationDate) {
        this.creationDate = new Date();
      }
  
      next(); // Proceed with saving the document
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);  // Error is an instance of the Error class
      } else {
        next(new Error('An unexpected error occurred'));
      }
    }
  });

// Define and export the CreationGoal model
const CreationGoal: Model<ICreationGoal> = mongoose.model<ICreationGoal>('CreationGoal', CreationGoalSchema);

export default CreationGoal;