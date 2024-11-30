import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel';

export const create = async (req: Request, res: Response) => { 
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
};