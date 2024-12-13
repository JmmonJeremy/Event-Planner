import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response } from "express";
import EventModel from "../models/eventModel"; // Adjust the import based on your project structure
import { validate } from "../config/validator"; // Adjust the import based on your project structure

// Define validation rules for event
const eventValidationRules = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date format"),
  body("location").notEmpty().withMessage("Location is required"),
  body("userId").isMongoId().withMessage("User ID must be a valid MongoDB ObjectId")
];

// Get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find();
    if (events.length > 0) {
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: "No events found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single event by ID
export const getEventById = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(412).json({ message: "Invalid ID parameter" });
  }
};

// Create a new event
export const createEvent = [
  eventValidationRules(), // Use the validation rules with the request body
  validate, // Middleware to check for validation errors
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(412).json({ errors: errors.array() });
    }

    try {
      const newEvent = new EventModel(req.body);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
];

// Update an existing event
export const updateEvent = [
  eventValidationRules(), // Use the validation rules with the request body
  validate, // Middleware to check for validation errors
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(412).json({ errors: errors.array() });
    }

    try {
      const updatedEvent = await EventModel.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
      if (updatedEvent) {
        res.status(204).json(updatedEvent); // Assuming the backend returns 204 on successful update
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
];

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await EventModel.findByIdAndDelete(req.params.eventId);
    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
