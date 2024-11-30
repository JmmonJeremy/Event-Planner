import { Router } from 'express';

const celebrationRoutes = Router();

celebrationRoutes.post('/celebrations', (req, res) => {
    res.send('Create a new celebration');
});

celebrationRoutes.post('/celebrations/createWithArray', (req, res) => {
    res.send('Create multiple celebrations');
});

celebrationRoutes.get('/celebrations/:celebrationId', (req, res) => {
    res.send(`Get celebration with ID ${req.params.celebrationId}`);
});

celebrationRoutes.get('/celebrations/user/:userId', (req, res) => {
    res.send(`Get celebrations for user ${req.params.userId}`);
});

celebrationRoutes.put('/celebrations/:celebrationId', (req, res) => {
    res.send(`Update celebration with ID ${req.params.celebrationId}`);
});

celebrationRoutes.delete('/celebrations/:celebrationId', (req, res) => {
    res.send(`Delete celebration with ID ${req.params.celebrationId}`);
});

export default celebrationRoutes;
