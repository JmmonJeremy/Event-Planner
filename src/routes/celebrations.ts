import { Router } from 'express';

const celebrationRoutes = Router();

celebrationRoutes.post('/holidays', (req, res) => {
    res.send('Create a new holiday');
});

celebrationRoutes.post('/holidays/createWithArray', (req, res) => {
    res.send('Create multiple holidays');
});

celebrationRoutes.get('/holidays/:holidayId', (req, res) => {
    res.send(`Get holiday with ID ${req.params.holidayId}`);
});

celebrationRoutes.get('/holidays/user/:userId', (req, res) => {
    res.send(`Get holidays for user ${req.params.userId}`);
});

celebrationRoutes.put('/holidays/:holidayId', (req, res) => {
    res.send(`Update holiday with ID ${req.params.holidayId}`);
});

celebrationRoutes.delete('/holidays/:holidayId', (req, res) => {
    res.send(`Delete holiday with ID ${req.params.holidayId}`);
});

export default celebrationRoutes;
