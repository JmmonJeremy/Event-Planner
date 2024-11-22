import { Router } from 'express';

const holidayRoutes = Router();

holidayRoutes.post('/holidays', (req, res) => {
    res.send('Create a new holiday');
});

holidayRoutes.post('/holidays/createWithArray', (req, res) => {
    res.send('Create multiple holidays');
});

holidayRoutes.get('/holidays/:holidayId', (req, res) => {
    res.send(`Get holiday with ID ${req.params.holidayId}`);
});

holidayRoutes.get('/holidays/user/:userId', (req, res) => {
    res.send(`Get holidays for user ${req.params.userId}`);
});

holidayRoutes.put('/holidays/:holidayId', (req, res) => {
    res.send(`Update holiday with ID ${req.params.holidayId}`);
});

holidayRoutes.delete('/holidays/:holidayId', (req, res) => {
    res.send(`Delete holiday with ID ${req.params.holidayId}`);
});

export default holidayRoutes;
