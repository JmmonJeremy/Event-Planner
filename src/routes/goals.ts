import { Router } from 'express';
import * as GoalController from '../controllers/goalController';
import { validate, IDValidationRules} from '../config/validator';

const goalRoutes = Router();

// Route to create a new goal
goalRoutes.post('/goals', IDValidationRules('goalId'), validate, GoalController.create);

// Route to create multiple goals
goalRoutes.post('/goals/createWithArray', GoalController.createMany);  // Optional, if you want this feature

// Route to get a specific goal by its ID
goalRoutes.get('/goals/:goalId', IDValidationRules('goalId'), validate, GoalController.getGoalById);

// Route to get all goals for a user by userId
goalRoutes.get('/goals/user/:userId', IDValidationRules('userId'), validate, GoalController.getGoalsByUserId);

// Route to update a goal by ID
goalRoutes.put('/goals/:goalId', IDValidationRules('goalId'), validate, GoalController.update);

// Route to delete a goal by ID
goalRoutes.delete('/goals/:goalId', IDValidationRules('goalId'), validate, GoalController.deleteGoal);

export default goalRoutes;
