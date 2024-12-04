import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import eventRoutes from './events';
import goalRoutes from './goals';
import classRoutes from './classes';
import celebrationRoutes from './celebrations';

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(celebrationRoutes);

export default routes;
