import { Router } from 'express';

const classRoutes = Router();

classRoutes.post('/classes', (req, res) => {
    res.send('Create a new class');
});

classRoutes.post('/classes/createWithArray', (req, res) => {
    res.send('Create multiple classes');
});

classRoutes.get('/classes/:classId', (req, res) => {
    res.send(`Get class with ID ${req.params.classId}`);
});

classRoutes.get('/classes/user/:userId', (req, res) => {
    res.send(`Get classes for user ${req.params.userId}`);
});

classRoutes.put('/classes/:classId', (req, res) => {
    res.send(`Update class with ID ${req.params.classId}`);
});

classRoutes.delete('/classes/:classId', (req, res) => {
    res.send(`Delete class with ID ${req.params.classId}`);
});

export default classRoutes;
