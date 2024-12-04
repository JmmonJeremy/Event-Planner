import {  Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRoutes = Router();

// Interface for User object
interface User {
  googleId: string;
  name: string;
  email: string;
}

// Initiate Google OAuth
authRoutes.get('/auth/google', 
  // #swagger.ignore = true
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
authRoutes.get(
  // #swagger.ignore = true
  '/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),  
  (req: Request, res: Response) => {
    // Type assertion to ensure req.user has the expected structure
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }

    // On successful authentication, exchange the Google code for a token
    const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
  }
);

export default authRoutes;