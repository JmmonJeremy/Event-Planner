import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import eventRoutes from './eventRoutes';
import goalRoutes from './goals';
import classRoutes from './classRoutes';
import celebrationRoutes from './celebrationRoutes';

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use("/events", eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(celebrationRoutes);

export default routes;
