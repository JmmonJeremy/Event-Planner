import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import EventModel from '../models/eventModel'; // Adjust this path as needed
import { validate, eventValidationRules } from '../config/validator'; // Adjust this path as needed

const eventRoutes = Router();

// POST route to create a new event
eventRoutes.post('/', eventValidationRules('create'), validate, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
  }

  try {
      const newEvent = new EventModel(req.body);
      await newEvent.save(); // Ensure this is correctly saving to the database
      res.status(201).json(newEvent);
  } catch (error) {
      res.status(500).json({ message: 'Error creating event', error });
  }
});


// GET route to return all events
eventRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
});

// GET route to return a specific event by ID
eventRoutes.get('/:eventId', async (req: Request, res: Response) => {
    try {
        const event = await EventModel.findById(req.params.eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
});

// PUT route to update an existing event
eventRoutes.put('/:eventId', eventValidationRules('update'), validate, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
        if (!updatedEvent) {
            res.status(404).json({ message: 'Event not found' });
        }
        res.status(204).send(); // Assuming a 204 No Content status for successful updates
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
});

// DELETE route to remove an event from the database
eventRoutes.delete('/:eventId', async (req: Request, res: Response) => {
    try {
        const deletedEvent = await EventModel.findByIdAndDelete(req.params.eventId);
        if (!deletedEvent) {
            res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
});

export default eventRoutes;
