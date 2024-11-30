import { Request, Response, Router } from 'express';
import * as userController from '../controllers/userControllers';

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
/*** MAIN 2 types of GET METHODS ******************************************************************************************/
// #1 main "Get" ROUTE for getting all USERS
userRoutes.get('/users', userController.findAll)

// #2 main "Get" ROUTE for getting 1 USER by id
userRoutes.get('/user/:userId', (req, res) => {
  res.send(`Get user with ID ${req.params.userId}`);
});

/*** MAIN 3 alter data ROUTES ********************************************************************************************/
// #1 the "Post" ROUTE for a new USER
userRoutes.post('/user', userController.create);

userRoutes.put('/user/:userId', (req, res) => {
    res.send(`Update user with ID ${req.params.userId}`);
});

userRoutes.delete('/user/:userId', (req, res) => {
  res.send(`Delete user with ID ${req.params.userId}`);
});
// END Basic CRUD Operation Routes ########################################################################################/

export default userRoutes;