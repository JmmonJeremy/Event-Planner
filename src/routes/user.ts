import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel';

const userRoutes = Router();
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Successfully created the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 _id:
 *                   type: string
 *       400:
 *         description: Bad request if validation fails
 */
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