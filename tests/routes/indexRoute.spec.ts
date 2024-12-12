import request from 'supertest';  // For making HTTP requests in tests
import express from 'express';    // For creating Express app in tests
import routes from '../../src/routes';  // Adjust the import based on your file structure

describe('GET Home', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(routes);  // Register the routes
  });

  it('should return a welcome message', async () => {
    const response = await request(app).get('/'); // Make a GET request to '/'
    
    // Check if the response status is 200
    expect(response.status).toBe(200);

    // Check if the response body contains the expected message
    expect(response.text).toBe('Welcome to the API! Documentation available at /api-docs');
  });
});
