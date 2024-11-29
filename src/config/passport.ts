import { Request } from 'express'; // For typing req
import { PassportStatic } from 'passport';
// import { Profile } from 'passport'; // Import Profile from passport package
import { GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GitHubProfile } from 'passport-github2';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel, { IUser } from '../models/userModel'; // Import UserModel
import { comparePassword } from '../middleware/password'; // For password validation

// Each Passport.js strategy constructor (like LocalStrategy, GoogleStrategy, etc.) has a default name associated with it:
// LocalStrategy → 'local' // GoogleStrategy → 'google' // GitHubStrategy → 'github'
// When you call passport.use, you register a strategy with a specific name. By default, the name 
// of the strategy is inferred from the constructor you are using (LocalStrategy = local in this case).
export default function configurePassport(passport: PassportStatic) {
  // Define Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        console.log('LocalStrategy triggered with email:', email);
        try {
          // Find the user by email        
          let user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });          
          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }
          // Check if the password matches
          if (!user.password) {
            return done(null, false, { message: 'Password is required for this account.' });
          }          
          const isPasswordValid = await comparePassword(password, user.password);
          if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
          }       
          // If authentication is successful, pass the user object       
          return done(null, { user });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth environment variables are not set.');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,             
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',      
        passReqToCallback: true, // Allow req to be passed to the verify callback
        failureRedirect: '/dashboard?accessDenied=true', // Redirect with error flag
      },
      async (req: Request, accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: any, user?: any) => void) => {        
        const email = profile.emails && profile.emails[0].value;
        if (!email) {
          return done(new Error('Email not found'), null);
        }  
        // Safely access properties with optional chaining
        const firstName = profile.name?.givenName || '';  // Provide a default value if undefined
        const lastName = profile.name?.familyName || '';  // Provide a default value if undefined
        const image = profile.photos?.[0]?.value || '';  // Provide a default value if undefined
        // User Object
        const newUser: Partial<IUser> = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName,
          lastName,
          image,
          email,    
        };
        try {
          // Check if the user already exists  
          let user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
          if (user) {              
              Object.keys(newUser).forEach((key) => {                
                const userKey = key as keyof IUser;               
                const newValue = newUser[userKey];
                if (user && newValue != null) {                 
                  (user[userKey] as any) = newValue;
                }
              });
            await user.save();                
            done(null, { user, accessToken });
          } else {
            // Create a new user
            user = await UserModel.create(newUser);                   
            done(null, { user, accessToken });
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );
  
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('Google OAuth environment variables are not set.');
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback', // Default callback, to be overridden in the route      
        passReqToCallback: true, // Allow req to be passed to the verify callback
        failureRedirect: '/dashboard?accessDenied=true', // Redirect with error flag
        scope: ['user:email'], // Request email in the OAuth scope
      },      
      async (req: Request, accessToken: string, refreshToken: string, profile: GitHubProfile, done: (err: any, user?: any) => void) => {
        const email = profile.emails?.[0]?.value || profile._json?.email;
        // Split displayName into firstName and lastName based on the first space
        const displayName = profile.displayName || '';
        const [firstName, ...lastNameArray] = displayName.split(' ');
        const lastName = lastNameArray.join(' ');       
        // User Object
        const newUser: Partial<IUser> = {
          githubId: profile.id,
          displayName: profile.displayName,
          firstName: firstName,
          lastName: lastName || '', // Use an empty string if no last name is found
          image: profile.photos && profile.photos[0].value,
          email,
          bio: profile._json.bio,
          location: profile._json.location,
          company: profile._json.company,
          website: profile._json.blog, 
        }    
        try {
          // Check if the user already exists          
          let user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });                 
          if (user) {              
            Object.keys(newUser).forEach((key) => {                
              const userKey = key as keyof IUser;               
              const newValue = newUser[userKey];
              if (user && newValue != null) {                 
                (user[userKey] as any) = newValue;
              }
            });
            await user.save();           
            done(null, { user, accessToken });
          } else {
            // Create a new user
            user = await UserModel.create(newUser);          
            done(null, { user, accessToken });
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser(async (wrappedUser: Express.User, done) => {
    console.log('SerializeUser called with:', wrappedUser);    
    // Save only the user ID and accessToken   
    done(null, { id: wrappedUser.user._id, accessToken: wrappedUser.accessToken });   
  });

  passport.deserializeUser(async (sessionData: any, done) => {  
    try {
      const user = await UserModel.findById(sessionData.id);
      if (!user) {
        return done(new Error("User not found"));
      }    
      done(null, { user, accessToken: sessionData.accessToken });
    } catch (err) {
      console.error('Error in deserializeUser:', err);
      done(err, null);
    }
  });
}