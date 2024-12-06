import { Router } from 'express';
import * as celebrationController from '../controllers/celebrationControllers';
import authenticateJWT from '../middleware/authMiddleware';

const celebrationRoutes = Router();

// START Extra CRUD Operation Routes ######################################################################################/
/*** EXTRA types of POST ROUTES ********************************************************************************************/
// #1 extra "Post" ROUTE to create multiple CELEBRATIONS at once
celebrationRoutes.post('/celebrations/createWithArray', (req, res) => {
    // #swagger.ignore = true
    /* #swagger.summary = "Extra POST Route for creating multiple celebrations at once" */ 
    res.send('Create multiple celebrations');
});
// END Extra CRUD Operation Routes ########################################################################################/

// START Basic CRUD Operation Routes ######################################################################################/
/*** MAIN 2 types of GET ROUTES ******************************************************************************************/
// #1 main "Get" ROUTE for getting all CELEBRATIONS for a User
celebrationRoutes.get('/celebrations/user/:userId', celebrationController.getAllUserCrelebrations);

// #2 main "Get" ROUTE for getting 1 CELEBRATION by celebrationId
celebrationRoutes.get('/celebrations/:celebrationId', celebrationController.getUsersPrivateCelebrationById);

/*** MAIN 3 alter data ROUTES ********************************************************************************************/
// #1 the "Post" ROUTE for a new CELEBRATION
celebrationRoutes.post('/celebrations', celebrationController.addCelebration);

// #2 the "Put" ROUTE for updating a CELEBRATION selected by celebrationId
celebrationRoutes.put('/celebrations/:celebrationId', celebrationController.updateCelebration);

// #3 the "Delete" ROUTE for removing a CELEBRATION selected by celebrationId
celebrationRoutes.delete('/celebrations/:celebrationId', celebrationController.deleteCelebration);
// END Basic CRUD Operation Routes ########################################################################################/ 

export default celebrationRoutes;
