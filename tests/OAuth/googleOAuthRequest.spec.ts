import request from "supertest";
import express from "express";
import passport from "passport";
import routes from "../../src/routes"; // Ensure this points to the full routes setup
import authRoutes from "../../src/routes/authRoutes";

// Mock the `passport.authenticate` method with debug logging
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options) => {    
    return (req: express.Request, res: express.Response, next: express.NextFunction) => next();
  }),
}));

describe('Google Request -JT', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use("/", routes); // Mount routes here just like in your actual server.ts
  });

  it('should use passport to authenticate with Google', async () => {
    // Make a request to the route
    const response = await request(app).get("/auth/google");

    // Verify that `passport.authenticate` was called with correct arguments
    expect(passport.authenticate).toHaveBeenCalledWith('google', { scope: ['profile', 'email'] });    
  });
});


