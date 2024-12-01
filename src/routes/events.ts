import { Router, Request, Response } from 'express';
import EventModel from '../models/eventModel'; // Path to your event model

const eventRoutes = Router();

// GET /events - Get all events
eventRoutes.get('/events/', async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find(); // Retrieve all events from the database
    res.json(events); // Return the events
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// // GET /events/:eventId - Get a specific event by ID
// eventRoutes.get('/events/:eventId', async (req: Request, res: Response) => {
//   try {
//     const event = await EventModel.findById(req.params.eventId); // Find event by ID
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }
//     res.json(event); // Return the event
//   } catch (error) {
//     console.error('Error fetching event:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // GET /events/:dateRange - Get events in a specific date range
// eventRoutes.get('/events/:dateRange', async (req: Request, res: Response) => {
//   try {
//     const [startDate, endDate] = req.params.dateRange.split(','); // Assuming dateRange is in format 'startDate,endDate'
//     const events = await EventModel.find({
//       date: { $gte: new Date(startDate), $lte: new Date(endDate) }
//     });
//     res.json(events); // Return events within the date range
//   } catch (error) {
//     console.error('Error fetching events by date range:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// POST /events - Create a new event
eventRoutes.post('/events/', async (req: Request, res: Response) => {
  try {
    const { name, description, date, location } = req.body;

    // Create a new event
    const newEvent = new EventModel({
      name,
      description,
      date,
      location,
      userId: req.body.userId, // Assuming userId is passed in the request body
    });

    // Save the event to the database
    await newEvent.save();

    // Return success message with the event details
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// // DELETE /events/:eventId - Delete a specific event by ID
// eventRoutes.delete('/events/:eventId', async (req: Request, res: Response) => {
//   try {
//     const deletedEvent = await EventModel.findByIdAndDelete(req.params.eventId); // Find and delete the event
//     if (!deletedEvent) {
//       return res.status(404).json({ message: 'Event not found' });
//     }
//     res.json(deletedEvent); // Return the deleted event
//   } catch (error) {
//     console.error('Error deleting event:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


export default eventRoutes;
