import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import BlacklistedTokenModel from '../models/blacklistedTokenModel'; // Import the blacklist model

interface DecodedUser extends JwtPayload {
  googleId: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

// Middleware to authenticate JWT
async function authenticateJWT(req: Request, res: Response, next: NextFunction):Promise<void> {
  const authHeader = req.headers['authorization']; // Retrieve the Authorization header
  console.log('Authorization Header:', authHeader);

  // Extract the token from the Authorization header
  const token = authHeader?.split(' ')[1];
  console.log('Extracted Token:', token);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  if (!token) {
    res.sendStatus(403); // Forbidden if no token
    return;
  }

  try {
    // Check if the token exists in the blacklist
    const blacklisted = await BlacklistedTokenModel.findOne({ token });

    if (blacklisted) {
      res.status(401).json({ message: 'You are NOT AUTHORIZED because the token is no longer valid due to logging out' });
      return;
    }
  } catch (err) {
    console.error('Error checking blacklist:', err);
    res.status(500).json({ message: 'Error checking blacklist' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: JwtPayload | any) => {    
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired token
        console.error('Token expired:', err);      
        // Clear the session
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error clearing session' });
          }      
          // Clear the session cookie
          res.clearCookie('connect.sid'); // Ensure the session cookie is cleared      
        });
      }
      console.error('JWT Verification Error:', err.message);
      res.sendStatus(403); // Forbidden if invalid token
      return;
    }

    const decodedUser = user as DecodedUser;
    console.log('Decoded User:', user);
    req.user = user; // Attach the decoded user data to the request
    next(); // Continue to the next middleware or route handler
  });
}

export default authenticateJWT;
