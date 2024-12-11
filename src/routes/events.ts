import { Request, Response, Router } from 'express';
import EventModel from '../models/eventModel';
import mongoose from 'mongoose';
import { validate, IDValidationRules } from '../config/validator';
import { body } from 'express-validator';

const eventRoutes = Router();

// Validation rules specific to events
const eventValidationRules = () => [
  body('name').isString().notEmpty().withMessage('Name is required and must be a string.'),
  body('description')
    .isString()
    .notEmpty()
    .withMessage('Description is required and must be a string.'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date string.')
    .toDate(),
  body('location')
    .isString()
    .notEmpty()
    .withMessage('Location is required and must be a string.'),
  body('userId')
    .matches(/^[a-fA-F0-9]{24}$/)
    .withMessage('UserId must be a valid MongoDB ObjectId.')
];

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
eventRoutes.get(
  '/:eventId',
  [...IDValidationRules('eventId'), validate],
  async (req: Request, res: Response) => {
    const eventId = req.params.eventId;

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
  }
);

// POST /events - Create a new event
eventRoutes.post(
  '/',
  [...eventValidationRules(), validate],
  async (req: Request, res: Response) => {
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
  }
);

// DELETE /events/:eventId - Delete a specific event by ID
eventRoutes.delete(
  '/:eventId',
  [...IDValidationRules('eventId'), validate],
  async (req: Request, res: Response) => {
    const eventId = req.params.eventId;

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
  }
);

// PUT /events/:eventId - Update an event by ID
eventRoutes.put(
  '/:eventId',
  [...IDValidationRules('eventId'), ...eventValidationRules(), validate],
  async (req: Request, res: Response) => {
    const eventId = req.params.eventId;

    try {
      const updatedEvent = await EventModel.findByIdAndUpdate(eventId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedEvent) {
        res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: 'Event updated successfully', event: updatedEvent }); // Return the updated event
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(400).json({ message: 'Bad Request' });
    }
  }
);

export default eventRoutes;
