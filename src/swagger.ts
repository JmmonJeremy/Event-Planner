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
    ? 'p2-web-services-w4.onrender.com'
    : 'localhost:3000',
    basePath: '/api',
    schemes: isProduction ? ['https'] : ['http'],
};

const outputFile = '../swagger.json';
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
const endpointsFiles = ['./src/routes/index.ts'];

// Generate the swagger documentation and handle the promise
swaggerInstance(outputFile, endpointsFiles)
.then(() => {
    console.log('Swagger file generated successfully:', outputFile);
  })
  .catch((err: Error) => {
    console.error('Error generating swagger file:', err.message);
  });
