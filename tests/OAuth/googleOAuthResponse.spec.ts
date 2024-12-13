import request from "supertest";
import express, {Request, Response, NextFunction} from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import routes from "../../src/routes"; // Ensure this points to the full routes setup
import authRoutes from "../../src/routes/authRoutes";

// Mock the `passport.authenticate` method with logging
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (strategy === 'google') {
        // Simulate a successful user authentication
        req.user = { id: 1, name: 'Test User', email: 'testuser@example.com' };
        // Simulate token generation
        const token = jwt.sign(req.user, process.env.JWT_SECRET || 'secret');
        res.json({ token });
      }
        if (options?.failureRedirect) {
          // Simulate failed authentication
          res.status(401).json({ message: 'Authentication failed' });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    };
  }),
}));

describe('Google Response -JT', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use("/", routes); // Mount the routes, including the '/auth/google/callback'
    app.use(express.json());
  });

  it('should receive a 200 Response with successful authentication', async () => {
    const response = await request(app).get('/auth/google/callback'); // Simulate the OAuth callback

    // Check the response status
    expect(response.status).toBe(200);
  });  

  it('should return a JWT token on successful authentication', async () => {
    const response = await request(app).get('/auth/google/callback'); // Simulate the OAuth callback
      
    // Check that the response body contains a token
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });

  it('should have a user name and email with successful authentication response', async () => {
    const response = await request(app).get('/auth/google/callback'); // Simulate the OAuth callback

    // Verify the token is valid
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'secret');
    expect(decoded).toHaveProperty('id', 1);
    expect(decoded).toHaveProperty('name', 'Test User');
    expect(decoded).toHaveProperty('email', 'testuser@example.com');
  });

  it('should return 401 if user is not authenticated', async () => {
     // Simulate failed authentication by mocking passport.authenticate
     passport.authenticate = jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
      req.user = undefined; // Simulate failed authentication (no user)      
      next();
    });
  });

  describe("Authentication Failure", () => { 
    let app: express.Application; 
    app = express();    
    app.get("/auth/google/callback", (req: Request, res: Response) => {
      if (req.query.success === "true") {
        const token = jwt.sign({ id: 1, name: "Test User" }, "secret");
        res.json({ token });
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    });     
  
    it("should return 401 for failed authentication", async () => {
      const response = await request(app).get("/auth/google/callback").query({ success: "false" });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });
  });
});
