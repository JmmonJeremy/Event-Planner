import mongoose, { Schema, Document, Model } from 'mongoose';

interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  userId: mongoose.Types.ObjectId; // User reference
}

// Static methods for the Event model
interface IEventModel extends Model<IEvent> {
  getEventById(eventId: string): Promise<IEvent | null>;
  deleteEventById(eventId: string): Promise<IEvent | null>;
  updateEventById(eventId: string, updateData: Partial<IEvent>): Promise<IEvent | null>;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
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

// Static method to get an event by ID
eventSchema.statics.getEventById = async function (eventId: string) {
  return this.findById(eventId);
};

// Static method to delete an event by ID
eventSchema.statics.deleteEventById = async function (eventId: string) {
  return this.findByIdAndDelete(eventId);
};

// Static method to update an event by ID
eventSchema.statics.updateEventById = async function (
  eventId: string,
  updateData: Partial<IEvent>
) {
  return this.findByIdAndUpdate(eventId, updateData, { new: true }); // { new: true } returns the updated document
};

// Optional: Indexing for userId to improve performance
eventSchema.index({ userId: 1 });

const EventModel = mongoose.model<IEvent, IEventModel>('Event', eventSchema);

export default EventModel;
