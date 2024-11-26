import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from 'swagger-jsdoc'; 
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database"; 
import routes from "./routes"; 
dotenv.config();

const app: Express = express();

// Global Uncaught Exception Handler (This acts as a safety net for errors that occur outside of promise chains 
// and are not caught anywhere in the code.) (Exceptions 1st because they are a more critical type of error)
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  process.exit(1); // Exiting is recommended to avoid an unstable state
});

// Handle unhandled promise rejections (It is a Node.js process-level event. Place after dotenv.config(), 
// but before any other application logic. It should not be placed within the Express middleware stack)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
});

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for external access

// Swagger configuration
const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'This is the API documentation for user management',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
      },
    ],
  },
  // Dynamically choose between .ts (for development) and .js (for production)
  apis: process.env.NODE_ENV === 'production' 
    ? ['./dist/routes/*.js']  // Path to the compiled JavaScript files in production
    : ['./src/routes/*.ts'],  // Path to your route TypeScript files  in development (with Swagger annotations)
};

// Initialize swagger-jsdoc
const swaggerDocument = swaggerJsDoc(swaggerOptions);

// Connect to MongoDB and start the server 
// (wrapped in an async function to simplify structure and improve clarity )
(async () => {
  try {
    await connectDB();
    console.log("Database connected.");

    // Routes
    app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to the API! Documentation available at /api-docs");
    });
    app.use("/api", routes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Global error handler (Placing below routes ensures the error handler is the last middleware in the stack,
    // Placing before app.listen ensures server setup is completed & errors are handled properly.)
    app.use((err: Error, req: Request, res: Response, next: Function) => {
      console.error(err.stack);
      res.status(500).send({ message: "Something went wrong!" });
    });
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Failed to connect to the database. Server not started:", err.message);
      console.error("Error stack trace:", err.stack); // Log the stack trace for debugging
    } else {
      console.error("An unknown error occurred."); // Fallback for non-Error exceptions
    }
    process.exit(1); // Ensure the application exits
  }
})();
