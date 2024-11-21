import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("lots of information!");
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000/");
});
