import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel';

const userRoutes = Router();
userRoutes.post('/user', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      name: savedUser.name,
      email: savedUser.email,
      _id: savedUser._id,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
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