import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from 'swagger-jsdoc'; 
import dotenv from "dotenv";
import { connectDB } from "./mongodb/database"; 
import routes from "./routes"; 
dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());

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
  apis: ['./src/routes/*.ts'], // Path to your route files (with Swagger annotations)
};

// Initialize swagger-jsdoc
const swaggerDocument = swaggerJsDoc(swaggerOptions);

// Connect to MongoDB
connectDB()
  .then(() => {
    app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to the API! Documentation available at /api-docs");
    });

   
    app.use("/api", routes);

    // Swagger UI documentation route
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database. Server not started:", err);
  });

// Global error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});
