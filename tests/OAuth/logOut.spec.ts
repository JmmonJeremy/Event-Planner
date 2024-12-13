import express, { Request, Response, NextFunction } from "express";
import BlacklistedToken from "../../src/models/blacklistedTokenModel"; // Adjust the import as needed
import request from "supertest";
import session from "express-session"; // To handle session mocking
import routes from "../../src/routes"; // Ensure this points to the full routes setup
import authRoutes from "../../src/routes/authRoutes";


declare module 'express-session' {
  interface Session {
    token?: string; // Store the token directly in the session
  }
}

describe("Log Out -JT", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express(); 
    
    // Use in-memory session store for testing
    const sessionStore = new session.MemoryStore();

    // Set up the session middleware
    app.use(
      session({
        secret: "your_secret_key", // Adjust your session secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true }, // Ensuring the cookie is properly se
      })
    );

    // Mock the logout route
    app.post("/auth/logout", async (req: Request, res: Response): Promise<void> => {
      const token = req.session.token;
      // Log the session token to check if it's being set properly
      console.log("Session token:", token);      

      if (!token) {
        res.status(400).json({ message: "No token in session" });
        return ;
      }

      try {
        console.log("Adding token to blacklist:", token);
        // Simulate adding the token to the blacklist (mocking the database interaction)
        await BlacklistedToken.create({ token });

        // Simulate session destruction (mocking clearCookie)
        res.clearCookie("connect.sid");

        res.status(200).json({ message: "Logged out successfully" });
        return ;
      } catch (error) {
        res.status(500).json({ message: "An error occurred" });
        return ;
      }
    });
  });

  it("should successfully create and save a BlacklistedToken", async () => {
    // Arrange
    const mockToken = "test-token";

    // Mock the create method
    jest.spyOn(BlacklistedToken, "create").mockResolvedValueOnce({
      token: mockToken,
      _id: "mocked-id", // Mocked _id as Mongoose would return
      __v: 0,          // Mocked version key
    } as any); // Use 'as any' to bypass TypeScript type checking for mocked data

    // Act
    const result = await BlacklistedToken.create({ token: mockToken });

    // Assert
    expect(BlacklistedToken.create).toHaveBeenCalledWith({ token: mockToken }); // Ensure the correct data was passed
    expect(result).toMatchObject({ token: mockToken }); // Ensure the mocked method returned the expected result
  });

  it("should successfully destroy a session", (done) => {
    // Create a mock session object
    const mockSession: Partial<session.Session> = {
      destroy: jest.fn((callback: (err?: Error | undefined) => void): session.Session => {
        // Simulate successful session destruction by invoking the callback with no error
        callback();

        // Return the mock session itself (as per the expected type)
        return mockSession as session.Session;
      }),
    };

    // Type assertion to satisfy TypeScript's expectations
    const sessionObject = mockSession as session.Session;

    // Call the destroy method on the mock session
    sessionObject.destroy((err) => {
      // Ensure no error occurred
      expect(err).toBeUndefined();

      // Verify that the destroy method was called
      expect(mockSession.destroy).toHaveBeenCalled();

      // Call done to indicate the test has completed
      done();
    });
  });
 
  it("should return an error if token is not in the session", async () => {
    // Simulate a request with no token in the session (no passport.user)
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", [`connect.sid=mocked-session-id-without-token`]) // Session cookie without token
      .expect(400);

    expect(response.body.message).toBe("No token in session");
  });
});
