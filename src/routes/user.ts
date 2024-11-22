import { Router } from 'express';

const userRoutes = Router();

userRoutes.post('/user', (req, res) => {
    res.send('Create a user');
});

userRoutes.put('/user/:userId', (req, res) => {
    res.send(`Update user with ID ${req.params.userId}`);
});

userRoutes.get('/user/login', (req, res) => {
    res.send('User login');
});

userRoutes.get('/user/logout', (req, res) => {
    res.send('User logout');
});

userRoutes.get('/user/findByGoogleId', (req, res) => {
    res.send('Find user by Google ID');
});

userRoutes.get('/user/:userId', (req, res) => {
    res.send(`Get user with ID ${req.params.userId}`);
});

userRoutes.delete('/user/:userId', (req, res) => {
    res.send(`Delete user with ID ${req.params.userId}`);
});

export default userRoutes;
