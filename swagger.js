// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'Description of your API',
    },
    host: 'localhost:3000', 
    basePath: '/api',
    schemes: ['http'], 
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts']; 

swaggerAutogen(outputFile, endpointsFiles);
