import { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';
import { logOut } from '../controllers/auth';

const authRoutes = Router();


// Custom route for handling authentication failureRedirect
authRoutes.get('/error/401', (req, res) => {
  /* #swagger.summary = "GETS the 401 page for denial of ---(OAUTH AUTHORIZATION DENIAL PAGE)---" */ 
  /* #swagger.description = 'Special page created for UNAUTHORIZED error events to redirect users to.' */ 
  // Render the error page on authentication failure

res.status(401).render('error/401');
});

// START **************************** EMAIL & PASSWORD SIGN IN *********************************** START//
authRoutes.post(
  '/login',
  /* #swagger.summary = "Signs a user in ---(AUTH DOORWAY FOR PASSWORD SIGN IN)---" */ 
  /* #swagger.description = 'Special route created for posting the sign-in of new users through a password sign-in.' */ 
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update',
      required: true,
      '@schema': {
        "type": "object",
        "properties": {         
          "email": {
            "type": "string",
            "example": "email@email.com"
          },
          "password": {
            "type": "string",
            "format": "password",
            "example": "password123"
          },
          "repeatPassword": {
            "type": "string",
            "example": "password123"
          }              
        },
        "required": ["email"]
      }
    }
  */
  (req: Request, res: Response, next: NextFunction) => {
    console.log('Email Sign-in Request body:', req.body);
    // Destructure email and password from the request body
    const { email, password } = req.body as { email?: string; password?: string };
    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).send('Missing credentials'); //Don't return, just send the response to avoid TypeScript error
      return; // Stop execution after sending the response
    }
    next(); // Pass control to the next middleware
  },
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error('Error during authentication:', err);
        return next(err);
      }
      if (!user) {
        // Redirect or render login page with an error message
        return res.status(401).redirect('/?error=Invalid credentials');
      }
      // Log in the user
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          console.error('Error during login:', loginErr);
          return next(loginErr);
        }
        // Redirect to the desired page after successful login
        return res.status(200).redirect('/dashboard');
      });
    })(req, res, next); // Ensure you're passing the request, response, and next to passport's authenticate
  }
);
// END **************************** EMAIL & PASSWORD SIGN IN *********************************** END//

// START ******************************** GOOGLE OAUTH *********************************** START//
// @desc    Auth with Google
// @route   GET /auth/google - from "Authenticate Requests" section

authRoutes.get(
  // #swagger.ignore = true
  // don't send to swagger docs it is not funtional by itself
  '/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // added 'email'

// @desc    Google auth callback
// @route   GET /auth/google/callback
authRoutes.get(
  // #swagger.ignore = true
  // don't send to swagger docs it is not funtional by itself
  '/google/callback',
    (req, res, next) => {
      // Get authorization code for use to fetch access token with backend tool if you want
      const authorizationCode = req.query.code;
      // Uncomment code below if using backend tool so the code isn't used, making it usable in the tool
      // console.log("Google Authorization Code:", authorizationCode); 
      // req.query.code = 'invalidated_code';   
      if (authorizationCode) {   
        console.log("Google (controller/auth)- Authorization Code:", authorizationCode);     
      } else {
        console.log("No authorization code found.");
      }
      next();
      passport.authenticate('google', 
        (err: any, user: any, info: any) => {          
          if (err) {
            console.error('Error during authentication:', err);
            return next(err);
          }
          if (!user) {
            // Redirect or render login page with an error message
            return res.redirect('/?error=Invalid credentials');
          }
          // !!! Log in the user (Code required for OAuth to work in production)
          req.logIn(user, (loginErr: any) => {
            if (loginErr) {
              console.error('Error during login:', loginErr);
              return next(loginErr);
            }
            // console.log('Google Request body:', req.body);   // this is empty here
            // console.log('User successfully logged in:', user);
            // Redirect to the desired page after successful login
            return res.status(200).redirect('/dashboard');
          });
        })(req, res, next);
      });
//     { failureRedirect: '/' });
//     res.status(200).redirect('/dashboard');
//   }
// );
// END ********************************** GOOGLE OAUTH *********************************** END//

// START ******************************** GITHUB OAUTH *********************************** START//
// @desc    Auth with GitHub
// @route   GET /auth/github - from "Authenticate Requests" section
authRoutes.get(
  // #swagger.ignore = true
  // don't send to swagger docs it is not funtional by itself
  '/github', passport.authenticate('github', { scope: ['user:email'] }));

// @desc    GitHub auth callback
// @route   GET /auth/github/callback
authRoutes.get(
  // #swagger.ignore = true 
  '/github/callback',
    (req, res, next) => {          
      // Get authorization code for use to fetch access token with backend tool if you want
      const authorizationCode = req.query.code;
      // Uncomment code below if using backend tool so the code isn't used, making it usable in the tool
      // console.log("GitHub Authorization Code:", authorizationCode); 
      // req.query.code = 'invalidated_code';   
      if (authorizationCode) {   
        console.log("GitHub (controller/auth)- Authorization Code:", authorizationCode);     
      } else {
        console.log("No authorization code found.");
      }
      next();
      passport.authenticate('github',  
        (err: any, user: any, info: any) => {         
          if (err) {
            console.error('Error during authentication:', err);
            return next(err);
          }
          if (!user) {
            // Redirect or render login page with an error message
            return res.redirect('/?error=Invalid credentials');
          }
        // !!! Log in the user (Code required for OAuth to work in production)
        req.logIn(user, (loginErr: any) => {
          if (loginErr) {
            console.error('Error during login:', loginErr);
            return next(loginErr);
          }       
          // Redirect to the desired page after successful login
          return res.status(200).redirect('/dashboard');
        });
      })(req, res, next);
    });
// END ******************************** GITHUB OAUTH *********************************** END//

// @desc    Logout user
// @route   /auth/logout
authRoutes.get('/logout', logOut);

export default authRoutes;
