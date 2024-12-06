import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

interface DecodedUser extends JwtPayload {
  googleId: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

// Middleware to authenticate JWT
function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
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

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: JwtPayload | any) => {
    if (err) {
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
