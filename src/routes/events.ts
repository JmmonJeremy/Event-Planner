import { Router } from 'express';
import { ensureAuth } from '../middleware/auth';
import * as creationGoal from '../controllers/creationGoal';
// import * as validation from '../middleware/creationGoal-validator';

const eventRoutes = Router();

/*** OTHER types of GET ROUTES ***************************************************************************/
    //@desc Search creationGoals by title
    //@route GET /creationGoals/search/:query
// Defined for swagger in comments to correct autogen adding two inputs of path & query    
    // #swagger.start 
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.summary = "GETS all the Public creationGoals that meet search criteria within the goal definition ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
    /* #swagger.description = 'All Public creationGoals within goal definition search criteria are displayed on the creationGoals index page.' */
    /* #swagger.path = '/creationGoals/search/{query}'
    #swagger.method = 'get'
    #swagger.description = 'Search term for goal category of the Public creationGoals.'
    #swagger.produces = ['application/json'] */        
    /* #swagger.parameters['query'] = {
        in: 'query',
        description: 'Search term for creationGoals',
        required:false,        
        type: 'string'
    } */   
    // #swagger.responses[200] = { description: 'SUCCESS, GET returned all Public creationGoals that met the search criteria' }
    // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET the Public creationGoals'}
    // #swagger.responses[404] = { description: 'The attempted GET of all Public creationGoals within the search were Not Found'}
    // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the QUERY PARAMETER'}
    // #swagger.end
// #1 extra "Get" method to search Public creationGoals by a term within their goal section
eventRoutes.get('/search/:query', ensureAuth, creationGoal.getPublicSearchResults);

    // @desc    User creationGoals
    // @route   GET /creationGoals/user/:userId
// #2 extra "Get" method to get all Public creationGoals associated with selected user by their id
eventRoutes.get('/user/:userId', ensureAuth, creationGoal.getUserCreationGoals);
    
    // @desc    Show edit page
    // @route   GET /creationGoals/edit/:id
// #3 extra "Get" method to get a specific creationGoal by _id belonging to the user for editing
eventRoutes.get('/edit/:id', ensureAuth, creationGoal.getUsersCreationGoalById);
    
    // @desc    Show add page
    // @route   GET /creationGoals/add
// #4 extra "Get" method to load the form page for adding a creationGoal
eventRoutes.get('/add', ensureAuth, creationGoal.getAddForm);

/*** MAIN 2 types of GET ROUTES ***************************************************************************/
    // @desc    Show all creationGoals
    // @route   GET /creationGoals 
// #1 maing "Get" method for getting all Public creationGoals  
eventRoutes.get('/', ensureAuth, creationGoal.getAllPublicCreationGaols);

    // @desc    Show single creationGoal
    // @route   GET /creationGoals/:id
// Defined for swagger in comments to correct autogen adding the regex in
    // #swagger.start 
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.summary = "GETS a creationGoals by its _id ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
    /* #swagger.path = '/creationGoals/{id}'
        #swagger.method = 'get'
        #swagger.description = 'The selected creationGoal is displayed on the creationGoals show page.'
        #swagger.produces = ['application/json'] */     
     /* #swagger.parameters['id'] = {
         in: 'path',
         description: 'Unique identifier for the user',
         required: true,
         type: 'string'
     } */
    // #swagger.responses[200] = { description: 'SUCCESS, GET returned the selected creationGoal' }
    // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET this creationGoal'}
    // #swagger.responses[404] = { description: 'The attempted GET of specified creationGoal was Not Found'}
    // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the CREATIONGOAL _id PARAMETER'}
    // Swagger doc comments   
    // #swagger.end
// #2 main "Get" method for getting 1 Public creationGoal by id
eventRoutes.get('/:id([a-fA-F0-9]{24})', ensureAuth, creationGoal.getCreationGoalById);

/*** MAIN 3 alter data ROUTES ***************************************************************************/
    // @desc    Process add form
    // @route   POST /creationGoals
eventRoutes.post('/', ensureAuth, creationGoal.addCreationGoal);

    // @desc    Update creationGoal
    // @route   PUT /creationGoals/:id
eventRoutes.put('/:id', ensureAuth, creationGoal.updateCreationGoal);

    // @desc    Delete creationGoal
    // @route   DELETE /creationGoals/:id
eventRoutes.delete('/:id', ensureAuth, creationGoal.deleteCreationGoal);


export default eventRoutes;
