import { Router } from 'express';

const eventRoutes = Router();

eventRoutes.get('/events/', (req, res) => {
    res.send('Get all events');
});

eventRoutes.get('/events/:eventId', (req, res) => {
    res.send(`Get event with ID ${req.params.eventId}`);
});

eventRoutes.get('/events/:dateRange', (req, res) => {
    res.send(`Get events in range ${req.params.dateRange}`);
});

eventRoutes.post('/events/', (req, res) => {
    res.send('Create a new event');
});

eventRoutes.delete('/events/:eventId', (req, res) => {
    res.send(`Delete event with ID ${req.params.eventId}`);
});

export default eventRoutes;
