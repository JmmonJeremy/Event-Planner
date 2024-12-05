import { Request, Response, NextFunction } from 'express';
import CelebrationModel from '../models/celebrationModel';
import { IUser } from '../models/userModel';

// START Extra CRUD Operation Methods ######################################################################################/
/*** EXTRA types of POST METHODS ********************************************************************************************/
// #1 extra "Post" METHOD to create multiple CELEBRATIONS at once

// END Extra CRUD Operation Methods ########################################################################################/

// START Basic CRUD Operation Methods ######################################################################################/
/*** MAIN 2 types of GET METHODS ******************************************************************************************/
// #1 main "Get" METHOD for getting all CELEBRATIONS for a User
export const getUserCrelebrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.summary = "GETS all Private celebrations associated with a selected user _id ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */ 
  /* #swagger.description = 'All Private celebrations associated with a selected user are displayed.' */
  // #swagger.responses[200] = { description: 'SUCCESS, GET returned all celebrations associated with the user' } 
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET the celebrations' }
  // #swagger.responses[404] = { description: 'The selected user associated with celebrations was NOT FOUND' }
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the USER _id PARAMETER' }
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET all celebrations associated with the user' }
  /* #swagger.parameters['userId'] = { 
      in: 'path',
      description: 'The MongoDB ObjectId under the _id label.',     
  } */
  try {
    console.log("PARAMS Object:", req.params);
    const celebrations = await CelebrationModel.find({ user: req.params.userId })
      .populate<{ user: IUser }>('user') // Populate the user field - Tells TypeScript that `user` is populated as an `IUser`
      .lean(); // Convert to plain JavaScript object
    // Get the user from the first celebration (assuming user is populated correctly)
    const user = celebrations[0].user as IUser;  // Cast to IUser for type safety
    if (!user) {
      // BACKEND Failure OUTPUT   
      res.status(404).send({ 
        message: 'No creations found! There are either no creations yet, or their was an error retrieving them.'
      }); 
      return;
      // // FRONTEND Failure OUTPUT 
      // res.status(404).render('error/404'); // Handle user not found
      // return;
    } else {
      // BACKEND Success OUTPUT 
      res.status(200).send(celebrations); 
      // // FRONTEND Success OUTPUT
      // res.status(200).render('celebrations/index', {
      //   back: "/celebrations",
      //   heading: `by ${user.name}`, // Now TypeScript knows user has `name`
      //   celebrations,
      // });
      }  
  } catch(err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: errorMessage,
    }); 
    // FRONTEND Failure OUTPUT  
    // console.error(err);
    // res.status(500).render('error/500');
  };
};
// #2 main "Get" METHOD for getting 1 CELEBRATION by celebrationId for a User
export const getUsersCelebrationById = async (req: Request, res: Response): Promise<void> => { 
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.summary = "GETS the celebration belonging to a user by _id ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
  /* #swagger.description = 'The celebration is displayed.' */      
  // #swagger.responses[200] = { description: 'SUCCESS, GET returned the selected celebration belonging to the user' }
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET this celebration}
  // #swagger.responses[404] = { description: 'The selected celebration was NOT FOUND' }
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the CELBRATION _id PARAMETER'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected celebration'}
  const celebrationId: string = req.params.userId; // put here so it applies to both try & catch
  try {  
    const celebration = await CelebrationModel.findOne({ _id: celebrationId })
    .populate<{ user: IUser }>('user') // Populate the user field - Tells TypeScript that `user` is populated as an `IUser`
    .lean() // Convert to plain JavaScript object
    if (!celebration) {
      // BACKEND Failure OUTPUT 
      res.status(404).send({ message: `Creation with creationId ${celebrationId} not found!` });
      return;
      // // FRONTEND Failure OUTPUT
      // res.status(404).render('error/404');
      // return;
    }
    // //  checks if the logged-in user is undefined or if user's id does not match the user associated with the celebration
    // if (!req.user || celebration.user.toString() !== req.user.id) { //add when OAuth exists
    //   res.redirect('/celebrations') // add unauthorized error
    // } 
    else {
      // BACKEND Success OUTPUT   
      res.status(200).send(celebration); // Send user data as response
      return;
      // // FRONTEND Success OUTPUT
      // res.status(200).render('celebrations/edit', {
      //   celebration,
      // })
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    if (err instanceof Error) {
      // BACKEND Failure OUTPUT 
      res.status(500).send({
        message: `Error retrieving celebration with celebrationId: ${celebrationId}. ${err.message}`,
      });
      return;
      // FRONTEND Failure OUTPUT
      console.error(err)
      res.status(500).render('error/500');
      return;
    }
  };
};

/*** MAIN 3 alter data METHODS ********************************************************************************************/
// #1 the "Post" METHOD for a new CELEBRATION

// #2 the "Put" METHOD for updating a CELEBRATION selected by celebrationId

// #3 the "Delete" METHOD for removing a CELEBRATION selected by celebrationId

// END Basic CRUD Operation Methods ########################################################################################/ 