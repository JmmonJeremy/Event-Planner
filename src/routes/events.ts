import { Request, Response, Router } from 'express';
import EventModel from '../models/eventModel';
import mongoose from 'mongoose';

const eventRoutes = Router();

// GET /events - Get all events
eventRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find(); // Retrieve all events from the database
    res.json(events); // Return the events
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /events/:eventId - Get a specific event by ID
eventRoutes.get('/:eventId', async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  // Validate if the provided eventId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const event = await EventModel.findById(eventId); // Find event by ID
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    }
    res.json(event); // Return the event
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /events - Create a new event
eventRoutes.post('/', async (req: Request, res: Response) => {
  const { name, description, date, location, userId } = req.body;

  try {
    const newEvent = new EventModel({
      name,
      description,
      date,
      location,
      userId,
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// DELETE /events/:eventId - Delete a specific event by ID
eventRoutes.delete('/:eventId', async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  // Validate if the provided eventId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const deletedEvent = await EventModel.findByIdAndDelete(eventId); // Find and delete the event
    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully', event: deletedEvent }); // Return the deleted event
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default eventRoutes;
