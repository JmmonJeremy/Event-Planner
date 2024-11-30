import mongoose, { Schema, Document } from 'mongoose';

interface IGoal extends Document {
  name: string;
  description: string;
  dueDate: Date;
  userId: mongoose.Types.ObjectId; // User reference
  status: string; // Optional status field (pending, in-progress, completed)
}

const goalSchema = new Schema<IGoal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value: Date) {
          return value > new Date(); // Ensure dueDate is in the future
        },
        message: 'Due date must be in the future',
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending', // Default to 'pending'
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Optional: Indexing for userId to improve performance
goalSchema.index({ userId: 1 });

const GoalModel = mongoose.model<IGoal>('Goal', goalSchema);

export default GoalModel;
