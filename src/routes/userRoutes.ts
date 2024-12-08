import { Request, Response, Router } from 'express';
import * as userController from '../controllers/userControllers';
import authenticateJWT from '../middleware/authMiddleware';
import { validate, IDValidationRules, userValidationRules } from '../config/validator';

const userRoutes = Router();

// START Extra CRUD Operation Routes ######################################################################################/
/*** EXTRA types of GET ROUTES ********************************************************************************************/
// #1 extra "Get" ROUTE to login USER
userRoutes.get('/user/login', (req, res) => {
  // #swagger.ignore = true
  /* #swagger.summary = "Extra GET Route for OAUTH Login" */   
  res.send('User login');
});

userRoutes.get('/user/logout', (req, res) => {
  // #swagger.ignore = true
  /* #swagger.summary = "Extra GET Route for OAUTH Logout" */  
  res.send('User logout');
});

userRoutes.get('/user/findByGoogleId', (req, res) => {
  // #swagger.ignore = true
  /* #swagger.summary = "Extra GET Route for Google ID" */  
  res.send('Find user by Google ID');
});
// END Extra CRUD Operation Routes ########################################################################################/

// START Basic CRUD Operation Routes ######################################################################################/
/*** MAIN 2 types of GET ROUTES ******************************************************************************************/
// #1 main "Get" ROUTE for getting all USERS
userRoutes.get('/users', userController.findAll);

// #2 main "Get" ROUTE for getting 1 USER by userId
userRoutes.get('/user/:userId', IDValidationRules('userId'), validate, userController.findOne);

/*** MAIN 3 alter data ROUTES ********************************************************************************************/
// #1 the "Post" ROUTE for a new USER
userRoutes.post('/user', authenticateJWT, userValidationRules('create'), validate, userController.create);

// #2 the "Put" ROUTE for updating a USER selected by userId
userRoutes.put('/user/:userId', authenticateJWT, IDValidationRules('userId'), userValidationRules('update'), validate, userController.update);

// The "Delete" ROUTE for removing a USER selected by userId
userRoutes.delete('/user/:userId', authenticateJWT, IDValidationRules('userId'), validate, userController.deleteUser);
// END Basic CRUD Operation Routes ########################################################################################/

export default userRoutes;