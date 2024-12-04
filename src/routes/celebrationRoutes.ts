import { Router } from 'express';

const celebrationRoutes = Router();

// START Extra CRUD Operation Routes ######################################################################################/
/*** EXTRA types of POST ROUTES ********************************************************************************************/
// #1 extra "Post" ROUTE to create multiple CELEBRATIONS at once
celebrationRoutes.post('/celebrations/createWithArray', (req, res) => {
    res.send('Create multiple celebrations');
});
// END Extra CRUD Operation Routes ########################################################################################/

// START Basic CRUD Operation Routes ######################################################################################/
/*** MAIN 2 types of GET METHODS ******************************************************************************************/
// #1 main "Get" ROUTE for getting all CELEBRATIONS for a User
celebrationRoutes.get('/celebrations/user/:userId', (req, res) => {
    res.send(`Get celebrations for user ${req.params.userId}`);
});

// #2 main "Get" ROUTE for getting 1 CELEBRATION by celebrationId
celebrationRoutes.get('/celebrations/:celebrationId', (req, res) => {
    res.send(`Get celebration with ID ${req.params.celebrationId}`);
});

/*** MAIN 3 alter data ROUTES ********************************************************************************************/
// #1 the "Post" ROUTE for a new CELEBRATION
celebrationRoutes.post('/celebrations', (req, res) => {
    res.send('Create a new celebration');
});

// #2 the "Put" ROUTE for updating a CELEBRATION selected by celebrationId
celebrationRoutes.put('/celebrations/:celebrationId', (req, res) => {
    res.send(`Update celebration with ID ${req.params.celebrationId}`);
});

// #3 the "Delete" ROUTE for removing a CELEBRATION selected by celebrationId
celebrationRoutes.delete('/celebrations/:celebrationId', (req, res) => {
    res.send(`Delete celebration with ID ${req.params.celebrationId}`);
});
// END Basic CRUD Operation Routes ########################################################################################/

export default celebrationRoutes;
