import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json"; // Path to generated JSON file
import routes from "./routes"; // Import combined routes
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API! Documentation available at /api-docs");
});

// Example route
app.get("/api/example", (req: Request, res: Response) => {
  res.send("This is an example route!");
});

// API Routes
app.use("/api", routes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
