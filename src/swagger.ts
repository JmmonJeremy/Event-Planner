import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

const swaggerInstance = swaggerAutogen();

// Check if NODE_ENV is correctly set
console.log('Environment:', process.env.NODE_ENV);

// Check the environment and set the host and scheme accordingly
const isProduction = process.env.NODE_ENV === 'production';
console.log('Is Production:', isProduction); // Check if it's true or false

const doc = {
  info: {
      title: 'API Documentation',
      description: 'Calendar API',
  },
  host: isProduction
  ? 'event-planner-nkma.onrender.com'
  : 'localhost:3000',
  basePath: '/',
  schemes: isProduction ? ['https'] : ['http'],
  securityDefinitions: {
    GoogleOAuth2: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: isProduction
      // missing /auth/google was the difference between it working and not working
      ? 'https://team-members-passport-oauth-version.onrender.com/auth/google'
      : 'http://localhost:3000/auth/google',
      description: 'Use Google OAuth2 to authenticate <b>Exchange the hidden GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for JWT_Token.</b>',
      // client_id: process.env.GOOGLE_CLIENT_ID, // Inject client_id dynamically
    },
  } 
};

const outputFile = '../swagger-output.json';
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
const endpointsFiles = ['./src/routes/index.ts'];

// Generate the swagger documentation and handle the promise
swaggerInstance(outputFile, endpointsFiles, doc)
.then(() => {
    console.log('Swagger file generated successfully:', outputFile);
  })
  .catch((err: Error) => {
    console.error('Error generating swagger file:', err.message);
  });
