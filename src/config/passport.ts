// config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

interface User {
  googleId: string;
  name: string;
  email: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: User | false) => void) => {
      console.log('Google Profile:', profile);    
      const user = {        
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || 'no-email@example.com', // Default value for missing email
      };
      done(null, user);
    }
  )
);

// Serialize user into JWT
passport.serializeUser((user, done: (error: any, token?: string) => void) => {
  try {
  const token = jwt.sign(user, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
  console.log(`User created: ${token}`);
  console.log('Token Created:', token); // Log the created token
  console.log('User Data for Token:', user); // Log user data used for token creation
  done(null, token);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((token: string, done: (error: any, user?: User | null) => void) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as User;
    done(null, user);
    console.log('Token Being Validated:', token); // Log the incoming token
  } catch (err) {
    done(err, null);
  }
});

export default passport;
