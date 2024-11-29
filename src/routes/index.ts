import { Router } from 'express';
import { ensureGuest } from '../middleware/auth';
import home from '../controllers/index';
import authRoutes from './auth';
import userRoutes from './user';
import eventRoutes from './events';
import goalRoutes from './goals';
import classRoutes from './classes';
import holidayRoutes from './holidays';

const routes = Router();

// The auth BASE/HOME/PAGE
//  @desc   Login/Landing page
//  @route  GET /
routes.get('/', ensureGuest, home.grantAccess);

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(eventRoutes);
routes.use(goalRoutes);
routes.use(classRoutes);
routes.use(holidayRoutes);

export default routes;
