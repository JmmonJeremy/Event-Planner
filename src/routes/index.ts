import express, { Router, NextFunction, Request, Response } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import eventRoutes from './eventRoutes';
import goalRoutes from './goals';
import classRoutes from './classRoutes';
import celebrationRoutes from './celebrationRoutes';
import path from 'path';

const routes = Router();

// Routes
routes.get("/", (req: Request, res: Response) => {
  // Log the __dirname to verify the path
  console.log('__dirname:', __dirname);
  const filePath = path.join(__dirname, 'public', 'index.html');
  console.log('Resolved file path:', filePath); // Log the resolved file path
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).send('File not found');
    }
  });
});

routes.use(authRoutes);
routes.use(userRoutes);
routes.use("/events", eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(celebrationRoutes);

export default routes;
