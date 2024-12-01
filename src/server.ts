import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database"; 
import routes from "./routes"; 
import { SwaggerOptions } from 'swagger-ui-express';
import swaggerDocument from "../swagger-output.json"; // Path to the generated Swagger JSON file

dotenv.config();

const app: Express = express();

const options: { swaggerOptions: SwaggerOptions } = {
  swaggerOptions: {
    operationsSorter: (a: any, b: any) => {
      const customGroupOrder = ['users', 'events', 'celebrations', 'classes', 'goals'];
      // Represent the URL paths of two API operations being compared.
      const pathA = a.get('path');
      const pathB = b.get('path');
      // Represent the HTTP methods (GET, POST, etc.) for these operations.
      const methodA = a.get('method');
      const methodB = b.get('method');
    
      // Extract the first segment after the '/' (ie, users, events, celebrations, classes, goals)
      const groupA = pathA.split('/')[1]?.toLowerCase() || ''; // Default to '' if no segment
      const groupB = pathB.split('/')[1]?.toLowerCase() || ''; // Default to '' if no segment    
    
      // Custom group ordering
      const orderA = customGroupOrder.indexOf(groupA);
      const orderB = customGroupOrder.indexOf(groupB);

      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Sort by method order (GET, POST, PUT, DELETE)
      const methodOrder = ['get', 'post', 'put', 'delete'];
      // indexOf() finds the index of the method in methodOrde & Operations with the same HTTP method will remain in their original relative order
      return methodOrder.indexOf(methodA) - methodOrder.indexOf(methodB);
    } 
  },
};

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
app.use(cors()); // Enable CORS for external access
app.use(express.json());


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
    app.use("/", routes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

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
