import request from 'supertest';  // For making HTTP requests in tests
import express from 'express';    // For creating Express app in tests
import path from 'path';          // For handling file paths
import routes from '../../src/routes';  // Adjust the import based on your file structure

describe('GET Home -JT', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.static(path.join(__dirname, '../../src/public'))); // Serve static files from the 'public' directory
    app.use(routes);  // Register the routes
  });

  it('should return the index.html file', async () => {
    const response = await request(app).get('/'); // Make a GET request to '/'
  
    // Log the response for debugging
    console.log(response.status);
    console.log(response.text);  
  
    // Check if the response is the expected HTML file
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
  });
});
