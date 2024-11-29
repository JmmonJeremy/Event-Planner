import express, { Router, Request, Response, NextFunction } from 'express';
import { ensureAuth } from '../middleware/auth';
import CreationGoal from '../models/CreationGoal';
import { getAllUsersCreationGoals } from '../controllers/dashboard';

const dashboardRoutes = Router();

//  @desc   Dashboard
//  @route  GET /dashboard
dashboardRoutes.get('/', ensureAuth, getAllUsersCreationGoals);

export default dashboardRoutes;