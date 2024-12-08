import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import BlacklistedTokenModel from '../models/blacklistedTokenModel'; // Import the blacklist model
import path from 'path';
import fs from 'fs';

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
    res.status(403).json({ message: 'You are NOT AUTHORIZED because the token is missing' }); // Forbidden if no token
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

  jwt.verify(token, process.env.JWT_SECRET as string, async (err: VerifyErrors | null, user: JwtPayload | any) => {    
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired token
        console.error('Token expiration found within token verification:', err); 
         // Destroy the session before sending the response
        try { 
          await new Promise<void>((resolve, reject) => {   
            // Clear the session
            req.session.destroy((destroyErr) => {
            if (destroyErr) {
              console.error('Error destroying session:', destroyErr);
              return reject(destroyErr); // Reject the promise if there's an error
            }      
            // Clear the session cookie
            console.log("Session destroyed, clearing cookies now...");
            res.clearCookie('connect.sid'); // Ensure the session cookie is cleared   
            console.log("Cookies cleared.");
            resolve(); // Resolve the promise when everything is done      
            }); 
          });
          console.log("Sending response now...");
          res.status(403).json({ message: 'You are NOT AUTHORIZED because the token has expired' }); // Forbidden if invalid token  
          // Done to stop the process from haning
          setImmediate(() => {
            const tsNodePath = path.resolve('./node_modules/.bin/ts-node'); // Ensure the correct path to ts-node
            const scriptPath = path.resolve(process.argv[1]); // Path to the current script            
            setImmediate(() => { // RECOMMENDED FOR PRODUCTION: Tools like PM2 (a popular Node.js process manager) 
              // or Docker offer more efficient and stable ways to manage restarts. // see Debugging-Code-Saver word doc
              const pathToServer = path.resolve(__dirname, '../server.ts');
              fs.utimesSync(pathToServer, new Date(), new Date()); // Update file timestamps
            });
          });
          return;
        } catch (error) {
          console.error('Error destroying session or clearing cookie:', error);
          res.status(500).json({ message: 'Error processing request within token verification' });
          return;
        }      
      }
      console.error('JWT Verification Error:', err.message);
      res.status(403).json({ message: 'You are NOT AUTHORIZED because the token is invalid' }); // Forbidden if invalid token
      return;
    }
    const decodedUser = user as DecodedUser;
    console.log('Decoded User:', user);
    req.user = user; // Attach the decoded user data to the request
    next(); // Continue to the next middleware or route handler 
  });
}

export default authenticateJWT;
