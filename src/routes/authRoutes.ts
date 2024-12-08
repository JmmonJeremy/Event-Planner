import {  Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import BlacklistedTokenModel from '../models/blacklistedTokenModel'; // Import the blacklist model

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

    // Store the token in the session store
    (req.session as { token?: string }).token = token;

    // Respond with the token or a confirmation
    res.json({ token });
  }
);

authRoutes.post('/auth/logout', async (req: Request, res: Response): Promise<void> => {
  const token = (req.session as { token?: string }).token; // Get the token from the session
  if (token) {
    try {
      // Add the token to the blacklist
      const blacklistedToken = new BlacklistedTokenModel({ token });
      await blacklistedToken.save();
      console.log('Token blacklisted:', token);
    } catch (err) {
      console.error('Error blacklisting token:', err);
      res.status(500).json({ message: 'Error blacklisting token' });
      return;
    }
  }
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error destroying session' });
    } 
    res.clearCookie('connect.sid'); // Clear the session cookie    
    res.status(200).json({ message: 'Successfully logged out' });
  });
});

export default authRoutes;