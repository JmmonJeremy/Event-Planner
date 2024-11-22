import { Router } from 'express';

const goalRoutes = Router();

goalRoutes.post('/goals', (req, res) => {
    res.send('Create a new goal');
});

goalRoutes.post('/goals/createWithArray', (req, res) => {
    res.send('Create multiple goals');
});

goalRoutes.get('/goals/:goalId', (req, res) => {
    res.send(`Get goal with ID ${req.params.goalId}`);
});

goalRoutes.get('/goals/user/:userId', (req, res) => {
    res.send(`Get goals for user ${req.params.userId}`);
});

goalRoutes.put('/goals/:goalId', (req, res) => {
    res.send(`Update goal with ID ${req.params.goalId}`);
});

goalRoutes.delete('/goals/:goalId', (req, res) => {
    res.send(`Delete goal with ID ${req.params.goalId}`);
});

export default goalRoutes;
