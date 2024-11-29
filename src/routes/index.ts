import { Router } from 'express';
import userRoutes from './user';
import eventRoutes from './events';
import goalRoutes from './goals';
import classRoutes from './classes';
import celebrationRoutes from './celebrations';

const routes = Router();

routes.use(userRoutes);
routes.use(eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(celebrationRoutes);

export default routes;
