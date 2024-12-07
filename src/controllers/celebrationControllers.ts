import { Request, Response, NextFunction } from 'express';
import CelebrationModel from '../models/celebrationModel';
import { IUser } from '../models/userModel';
import mongoose from 'mongoose';

// START Extra CRUD Operation Methods ######################################################################################/
/*** EXTRA types of POST METHODS ********************************************************************************************/
// #1 extra "Post" METHOD to create multiple CELEBRATIONS at once

// END Extra CRUD Operation Methods ########################################################################################/

// START Basic CRUD Operation Methods ######################################################################################/
/*** MAIN 2 types of GET METHODS ******************************************************************************************/
// #1 main "Get" METHOD for getting all CELEBRATIONS for a User
export const getUsersCrelebrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
  /* #swagger.summary = "GETS all Private celebrations associated with a selected user _id" */ 
  /* #swagger.description = 'All Private celebrations associated with a selected user are displayed.' */
  // #swagger.responses[200] = { description: 'SUCCESS, GET returned all celebrations associated with the user' } 
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET the celebrations' }
  // #swagger.responses[404] = { description: 'The selected user associated with celebrations was NOT FOUND' }
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the USER _id PARAMETER' }
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET all celebrations associated with the user' }
  /* #swagger.parameters['userId'] = { 
      in: 'path',
      description: 'The MongoDB ObjectId for the associated USER under the \"user\" label.',     
  } */
  try {
    console.log("PARAMS Object:", req.params);
    const userId = req.params.userId;
    // Ensure userId is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const celebrations = await CelebrationModel.find({ user: userId })    
      .populate<{ user: IUser }>('user') // Populate the user field - Tells TypeScript that `user` is populated as an `IUser`
      .lean(); // Convert to plain JavaScript object    
    // Get the user from the first celebration (assuming user is populated correctly)
    const user = celebrations[0]?.user as IUser;  // Cast to IUser for type safety
    if (!user) {
      // BACKEND Failure OUTPUT   
      res.status(404).send({ 
        message: 'No celebrations found! Either the userId was incorrect, there are no celebrations yet, or there was an error retrieving them.'
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
    console.error(err);
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: errorMessage,
    }); 
    // // FRONTEND Failure OUTPUT     
    // res.status(500).render('error/500');
  };
};
// #2 main "Get" METHOD for getting 1 CELEBRATION by celebrationId for a User
export const getUsersCelebrationById = async (req: Request, res: Response): Promise<void> => {  
  /* #swagger.summary = "GETS the celebration belonging to a user by _id" */   
  /* #swagger.description = 'The celebration is displayed.' */      
  // #swagger.responses[200] = { description: 'SUCCESS, GET returned the selected celebration belonging to the user' }
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET this celebration' }
  // #swagger.responses[404] = { description: 'The selected celebration was NOT FOUND' }
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the CELBRATION _id PARAMETER' }
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected celebration' }
  /* #swagger.parameters['celebrationId'] = { 
      in: 'path',
      description: 'The MongoDB ObjectId for CELEBRATION under the \"_id\" label.',     
  } */
  const celebrationId: string = req.params.celebrationId; // put here so it applies to both try & catch
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
    // if (!req.user || celebration.user.toString() !== req.user) { //add when OAuth exists
    //   // BACKEND Failure OUTPUT 
    //   res.status(401).send({
    //     message: `You are NOT AUTHORIZED to get the celebration with celebrationId=${celebrationId}. You need AUTHORIZATION!`,
    //   });
    //   return;
    //   // // FRONTEND Failure OUTPUT 
    //   // res.status(401).redirect('/celebrations')
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
      // // FRONTEND Failure OUTPUT      
      // res.status(500).render('error/500');
      // return;
    }
  };
};

/*** MAIN 3 alter data METHODS ********************************************************************************************/
// #1 the "Post" METHOD for a new CELEBRATION
export const addCelebration = async (req: Request, res: Response): Promise<void> => {  
  /* #swagger.summary = "POSTS the data entered to create a new celebration ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
  /* #swagger.description = 'The request body for a new celebration is added to the database.'  */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      required: true,
      default: 'Bearer '
  } */
  // #swagger.responses[201] = { description: 'SUCCESS, POST added a new celebration to the database' }
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to POST the new celebration' }
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the celebration data' }
  // #swagger.responses[400] = { description: 'There was a BAD REQUEST ERROR while trying to POST the form page for adding a celebration' }
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to POST the request body for adding a celebration' }
  try {
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Fields to fill out.',                  
            required: true,
            '@schema': {
              "type": "object",
              "properties": {       
                "person": {
                  "type": "string",
                  "example": "New added person"
                },
                "occasion": {
                  "type": "string",
                  "example": "New added occasion"
                },
                "plan": {
                  "type": "string",
                  "example": "New added plan"
                },
                "user": {
                  "type": "string",
                  "example": "New added user (mongoose ObjectId for user labeled _id)"
                },             
                "date": {
                  "type": "string",
                  "format": "date",
                  "example": "2024-12-24"
                },
                "location": {
                  "type": "string",
                  "example": "New added location"
                },
                "othersInvolved": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "example": ["Bob", "Shrily", "George"],
                },
                "visibility": {
                  "type": "string",
                  "enum": ['Private', 'Public'],
                  "example": "Public"
                }           
              },
              "required": "person"
            }
          }
        }
      */ 
    // Ensures the new record created is associated with the authenticated user 
    // by adding their ID to the user field in the request body.  
    // req.body.user = (req.user as IUser).id // wait until logging in creates a user & OAuth added    
    const celebration = await CelebrationModel.create(req.body) 
    // BACKEND Success OUTPUT 
    res.status(201).json( celebration ); 
    // // FRONTEND Success OUTPUT  
    // res.status(201).redirect('/dashboard?created=true')
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      // BACKEND Failure OUTPUT 
      res.status(500).json({ message: err.message });
      // // FRONTEND Failure OUTPUT       
      // res.status(500).render('error/500');
    } else {
      console.error('An unknown error occurred while creating a celebration');
      // BACKEND Failure OUTPUT 
      res.status(400).json({ message: 'An unknown error occurred while creating a celebration' });
      // // FRONTEND Failure OUTPUT       
      // res.status(400).render('error/500');
    }
  };
};

// #2 the "Put" METHOD for updating a CELEBRATION selected by celebrationId
export const updateCelebration = async (req: Request, res: Response): Promise<void> => {  
  /* #swagger.summary = "UPDATES a celebration that has been selected by id with the request body ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
  /* #swagger.description = 'The updated request body for the celebration changes the database. */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      required: true,
      default: 'Bearer '
  } */
  // #swagger.responses[204] = { description: 'SUCCESS, PUT updated the selected celebration in the database' }
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to PUT the update for the selected celebration'}
  // #swagger.responses[404] = { description: 'The attempted PUT of the specified celebration for updating was Not Found'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the celebration data'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to PUT the update for the selected celebration'}
   /* #swagger.parameters['celebrationId'] = { 
      in: 'path',
      description: 'The MongoDB ObjectId for CELEBRATION under the \"_id\" label.',     
  } */
  const celebrationId: string = req.params.celebrationId; // put here so it applies to both try & catch
  try {    
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Fields to update',           
            '@schema': {
              "type": "object",
              "properties": {         
                "person": {
                  "type": "string",
                  "example": "Updated person"
                },
                "occasion": {
                  "type": "string",
                  "example": "Updated occasion"
                },
                "plan": {
                  "type": "string",
                  "example": "Updated plan"
                },                                     
                "date": {
                  "type": "string",
                  "format": "date",
                  "example": "2024-12-31"
                },
                "location": {
                  "type": "string",
                  "example": "Updated location"
                },
                "othersInvolved": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "example": ["Velma", "Shaggy", "Scooby"],
                },
                "visibility": {
                  "type": "string",
                  "enum": ['Private', 'Public'],
                  "example": "Private"
                }           
              },
              "required": ["person"]
            }
          }
        }
      */ 
    // Ensures the new record created is associated with the authenticated user     
    // const userId = (req.user as IUser).id; // wait until logging in creates a user & OAuth added     
    let celebration = await CelebrationModel.findById(celebrationId).lean();
    const userId = await celebration?.user._id?.toString();
    // console.log(`userId = ${userId}`);
    const celebrations = await CelebrationModel.find({ user: userId }).populate('user').lean(); // use userId after OAuth is added
    if (!celebration) {
      // BACKEND Failure OUTPUT 
      res.status(404).send({
        message: `Cannot update celebration with celebrationId=${celebrationId}. This celebrationId was not found!`,
      });
      return;
      // // FRONTEND Failure OUTPUT 
      // res.status(404).render('error/404');
      // return;
    }
    // //  checks if the logged-in user's id does not match the user associated with the celebration    
    // if (celebration.user.toString() !== userId) { //add when OAuth exists
    //   res.status(401).redirect('/error/401')
    // } 
    else {
      celebration = await CelebrationModel.findOneAndUpdate({ _id: celebrationId }, req.body, {
        new: true,
        runValidators: true,
      }) 
      // BACKEND Success OUTPUT 
      res.status(204).send({ message: 'User was updated successfully.' });
      return;  
      // // FRONTEND Success OUTPUT  
      // // Changed this from res.redirect to stop errors in swagger doc & .rest routes
      // const updated = 'true'; 
      // res.status(200).render('dashboard', {      
      //   name: `${(req.user as IUser).name}`,      
      //   celebrations,     
      //   updated, // Pass this to the Handlebars template        
      // });
    }
  } catch (err) {
    console.error(err);
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: `Error updating user with creationId=${celebrationId}. Error states: ${err}`,
    });
    return;
    // FRONTEND Failure OUTPUT    
    res.status(500).render('error/500');
    return;
  }
};

// #3 the "Delete" METHOD for removing a CELEBRATION selected by celebrationId
export const deleteCelebration = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.summary = "DELETES a celebration by its _id ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */ 
  /* #swagger.description = 'After deletion it returns a success code.' */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      required: true,
      default: 'Bearer '
  } */
  // #swagger.responses[200] = { description: 'SUCCESS, the celebration was DELETED' }
  // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to DELETE this celebration'}
  // #swagger.responses[404] = { description: 'The selected celebration for DELETION was NOT FOUND'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the CELEBRATION _id PARAMETER'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to DELETE the celebration'}
   /* #swagger.parameters['celebrationId'] = { 
      in: 'path',
      description: 'The MongoDB ObjectId for CELEBRATION under the \"_id\" label.',     
  } */
  const celebrationId: string = req.params.celebrationId; // put here so it applies to both try & catch
  try {
    // const userId = (req.user as IUser).id; // wait until logging in creates a user & OAuth added    
    let celebration = await CelebrationModel.findById(celebrationId).lean();
    const userId = await celebration?.user._id?.toString();
    // console.log(`userId = ${userId}`);
    const celebrations = await CelebrationModel.find({ user: userId }).populate('user').lean(); // use userId after OAuth is added
    if (!celebration) {
      // BACKEND Failure OUTPUT 
      res.status(404).send({
        message: `Cannot delete celebration with celebrationId=${celebrationId}. This celebrationId was not found!`,
      });
      return;
      // // FRONTEND Failure OUTPUT
      // res.status(404).render('error/404');
      // return;
    }
    // //  checks if the logged-in user's id does not match the user associated with the celebration  
    // if (celebration.user.toString() !== userId) { //add when OAuth exists
    //   res.status(401).render('/error/401')
    // } 
    else {
      await CelebrationModel.deleteOne({ _id: celebrationId })
      // BACKEND Success OUTPUT 
      res.status(200).send({
        message: 'Celebration was deleted successfully!',
      });
      return;     
      // // FRONTEND Success OUTPUT 
      // // Changed this from res.redirect to stop errors in swagger doc & .rest routes
      // const deleted = 'true'; 
      // res.status(200).render('dashboard', {      
      //   name: `${(req.user as IUser).name}`,      
      //   celebrations,     
      //   deleted, // Pass this to the Handlebars template        
      // });
    }
  } catch(err) {
    console.error(err)
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: 'Deletion error. Could not delete celebration with celebrationId=' + celebrationId,
    });
    return;
    // // FRONTEND Failure OUTPUT 
    // res.status(500).render('error/500');
    // return;
  }
};
// END Basic CRUD Operation Methods ########################################################################################/ 