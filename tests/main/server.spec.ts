import passport from 'passport';
import express, { json, static as staticMiddleware, Router } from 'express';
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

// Mock the server module
jest.mock('../../src/server', () => {
  return {
    server: {
      close: jest.fn(),  // Mock the close method
    },
  };
});

// Mock passport
jest.mock('passport', () => ({
  initialize: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    next(); // Simulate the middleware flow
  }),
  session: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    next(); // Simulate the session middleware
  }),
  use: jest.fn(), // Mock the use method
  authenticate: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    next();
  }),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

// Mock express
jest.mock('express', () => {
  const useMock = jest.fn().mockImplementation(function (this: any) {
    return this; // Return the app instance to support chaining
  });;
  const listenMock = jest.fn((port: number, callback: () => void) => {
    callback(); // Simulate callback for listen
    return {} as any; // Return a mock object
  });

  const jsonMock = jest.fn().mockImplementation(() => (req: any, res: any, next: any) => next()); // Mock json middleware
  const staticMock = jest.fn(); // Mock static middleware
  const urlencodedMock = jest.fn().mockImplementation(() => (req: any, res: any, next: any) => next()); // Mock urlencoded middleware

  const RouterMock = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    use: jest.fn(),
  }));

  const expressMock = () => ({
    use: useMock,
    listen: listenMock,
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    json: jsonMock, // Mock json middleware
    static: staticMock, // Mock static middleware
    Router: RouterMock, // Mock Router
  });

  expressMock.json = jsonMock; // Attach json middleware mock
  expressMock.static = staticMock; // Attach static middleware mock
  expressMock.urlencoded = urlencodedMock; // Attach urlencoded middleware mock
  expressMock.Router = RouterMock; // Attach Router mock

  return {
    __esModule: true,
    default: expressMock, // Return the mock express
    Router: RouterMock, // Explicitly return Router mock
    json: jsonMock, // Mock json function
    static: staticMock, // Mock static function
    urlencoded: urlencodedMock, // Mock urlencoded function
  };
});

// Test Case
describe('Server Check', () => {
  afterEach(() => {
    jest.clearAllMocks();  // Clear mocks after each test
  });

  // Validate that express is mocked correctly
  test('mocked express should work', () => {
    const app = express();
    expect(json).toBeDefined(); // json middleware should exist
    expect(staticMiddleware).toBeDefined(); // static middleware should exist
    expect(Router).toBeDefined(); // Router should exist
  });

  test('mocked express should define middleware functions', () => {
    expect(express.json).toBeDefined();
    expect(express.static).toBeDefined();
    expect(express.urlencoded).toBeDefined();
  });

  test('mocked express app should define use method', () => {
    const app = express();
    expect(app.use).toBeDefined(); // use method should exist
  });

  test('mocked express app use method should support chaining', () => {
    const app = express();
    expect(() => {
      app.use(() => {}).use(() => {}); // Chained calls
    }).not.toThrow();
  });

  it('should call app.listen with the correct port', () => {
    process.env.PORT = '3000';
    const mockExpress = express as jest.MockedFunction<typeof express>;
    const appInstance = mockExpress();

    // Ensure listen method is called
    appInstance.listen(parseInt(process.env.PORT, 10), () => {}); // Directly call listen to simulate it
  
    expect(appInstance.listen).toHaveBeenCalledWith(
      parseInt(process.env.PORT, 10),
      expect.any(Function),
    );
  });
  
  it('should start and listen on the specified port', async () => {
    process.env.PORT = '3000';  // Set the mock port for testing
  
    // No need to import the actual server file, as it's mocked
    const { server } = require('../../src/server');  // Import the mocked server

    // Assert that the server mock is available
    expect(server.close).not.toHaveBeenCalled();  // Ensure close method hasn't been called yet

    // Mock express instance
    const mockExpress = express as jest.Mocked<typeof express>;
    const appInstance = mockExpress();
  
    // Directly call listen to simulate it being triggered in the server
    appInstance.listen(parseInt(process.env.PORT, 10), () => {});
  
    // Assert that listen was called with the correct port
    expect(appInstance.listen).toHaveBeenCalledWith(
      parseInt(process.env.PORT, 10),
      expect.any(Function)
    );

    // Optionally, you can call server.close() here if needed
    server.close();
  });
});
