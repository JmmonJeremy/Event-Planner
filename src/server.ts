import express, { Express, Request, Response, Router } from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger-output.json'; // Path to generated JSON file
import routes from './routes'; // Route

import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("lots of information!");
});
app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(3000, () => {
  console.log("server is running at http://localhost:3000/");
});
