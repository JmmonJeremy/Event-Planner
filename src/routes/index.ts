import express, { Router, NextFunction, Request, Response } from "express";
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import eventRoutes from './events';
import goalRoutes from './goals';
import classRoutes from './classRoutes';
import celebrationRoutes from './celebrationRoutes';

const routes = Router();

// Routes
routes.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API! Documentation available at /api-docs");
});

routes.use(authRoutes);
routes.use(userRoutes);
routes.use("/events", eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(celebrationRoutes);

export default routes;
