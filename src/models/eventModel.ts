import mongoose, { Schema, Document } from 'mongoose';

interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  userId: mongoose.Types.ObjectId; // User reference
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value: Date) {
          return value > new Date(); // Ensure event date is in the future
        },
        message: 'Event date must be in the future',
      },
    },
    location: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Optional: Indexing for userId to improve performance
eventSchema.index({ userId: 1 });

const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;
