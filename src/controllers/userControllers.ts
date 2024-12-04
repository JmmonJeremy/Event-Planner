import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel';

// START Extra CRUD Operation Methods #####################################################################################/
/*** EXTRA types of GET METHODS *******************************************************************************************/
// #1 extra "Get" METHOD to login USER

// END Extra CRUD Operation Methods #######################################################################################/

// START Basic CRUD Operation Methods #####################################################################################/
/*** MAIN 2 types of GET METHODS ******************************************************************************************/
// #1 main "Get" METHOD for getting all USERS
export const findAll = async (req: Request, res: Response): Promise<void> => {
/* #swagger.summary = "GETS all the users" */   
/* #swagger.description = 'All users are displayed.' */    
// #swagger.responses[200] = { description: 'SUCCESS, GET retrieved all users' }   
// #swagger.responses[404] = { description: 'The attempted GET of all users was Not Found'}
// #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET all users'}
  try {
    console.log(UserModel)
    const data = await UserModel.find({}).sort({ lastName: 1 });
    if (!data || data.length === 0) {
      // BACKEND Failure OUTPUT   
      res.status(404).send({ 
        message: 'No users found! There are either no users yet, or their was an error retrieving them.'
      }); 
      return;
    } else {
      // BACKEND Success OUTPUT 
      res.status(200).send(data); // Send the newly ordered data  
      }
  } catch(err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: errorMessage,
    });  
  }
}

// #2 main "Get" method for getting 1 USER by userId
export const findOne = async (req: Request, res: Response): Promise<void> => {
/* #swagger.summary = "GETS a user by their _id" */ 
/* #swagger.description = 'The selected user is displayed.' */ 
// #swagger.responses[200] = { description: 'SUCCESS, GET Retrieved the selected user' }
// #swagger.responses[404] = { description: 'The attempted GET of the selected user was Not Found'}
// #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER'}
// #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected user'}    
const userId: string = req.params.userId;
console.log(userId);
  try {
    // Find user by ID
    const user = await UserModel.findById(userId).lean();

    // If user not found, send a 404 response and return
    if (!user) {
      // BACKEND Failure OUTPUT 
      res.status(404).send({ message: `User with userId ${userId} not found!` });
      return;
    }
    // BACKEND Success OUTPUT 
    // If user found, send user data   
    res.status(200).send(user); // Send user data as response
    return;
  } catch (err) {
    // Handle errors
    console.error(err);
    if (err instanceof Error) {
      // BACKEND Failure OUTPUT 
      res.status(500).send({
        message: `Error retrieving user with userId: ${userId}. ${err.message}`,
      });
      return;
    }
  }
};

/*** MAIN 3 alter data METHODS ********************************************************************************************/
// #1 the "Post" METHOD for a new USER
export const create = async (req: Request, res: Response) => { 
/* #swagger.summary = "POSTS input to create a new user" */ 
/* #swagger.description = 'The entered user information is added to the database.' */ 
/* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
// #swagger.responses[201] = { description: 'SUCCESS, POST created a new user' }
// #swagger.responses[400] = { description: 'BAD REQUEST your POST was attempted with forbidden entries'}
// #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the user data'}
// #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to POST the selected user'}  
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // BACKEND Success OUTPUT 
    res.status(201).json({
      name: savedUser.name,
      email: savedUser.email,
      _id: savedUser._id,
    });
  } catch (error) {
    if (error instanceof Error) {
      // BACKEND Failure OUTPUT 
      res.status(500).json({ message: error.message });
    } else {
      // BACKEND Failure OUTPUT 
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

// #2 the "Put" METHOD for updating a USER selected by userId
export const update = async (req: Request, res: Response): Promise<void> => {
/* #swagger.summary = "UPDATES a user that has been selected by _id with any new data entered" */   
/* #swagger.description = 'The changed data for the user updates the database' */
/* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */      
// #swagger.responses[204] = { description: 'SUCCESS (with no content returned), PUT updated the selected user in the database' }
// #swagger.responses[400] = { description: 'BAD REQUEST your PUT was attempted with forbidden entries'}
// #swagger.responses[404] = { description: 'The attempted PUT of the specified user for updating was Not Found'}
// #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the user data'}
// #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to PUT the data change'}  
  if (!req.body) {
    // BACKEND Failure OUTPUT 
    res.status(400).send({
      message: 'Data to update can not be empty!',
    });
    return;
  }
  /* #swagger.parameters['userId'] = {
         in: 'path',
         description: 'Unique identifier for the user',
         required: true,
         type: 'string'
     } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update',
        required: true,
         '@schema': {
          "type": "object",
          "properties": { 
            "name": {
              "type": "string",
              "example": "Updated Name"
            },      
            "email": {
              "type": "string",
              "example": "Updated@email"
            },
            "password": {
              "type": "string",
              "example": "password123"
            }            
          },
          "required": "email"
        }
      }
    }
  */
  const userId: string = req.params.userId;
  try {
    const data = await UserModel.findOneAndUpdate(
      { _id: userId }, 
      req.body, 
      { new: true, useFindAndModify: false }
    );
   if (!data) {
    // BACKEND Failure OUTPUT 
      res.status(404).send({
        message: `Cannot update user with userId=${userId}. This userId was not found!`,
      });
      return;
    } else {
      // BACKEND Success OUTPUT 
      res.status(204).send({ message: 'User was updated successfully.' });
      return;
    } 
  } catch (err) {
    console.error(err);
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: `Error updating user with userId=${userId}`,
    });
    return;
  }
};

// The "Delete" METHOD for removing a USER selected by userId
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
/* #swagger.summary = "DELETES a user by its _id" */ 
/* #swagger.description = 'With deletion it's permanently removed from the database.' */
/* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'JWT token with Bearer prefix',       
      type: 'string',
      default: 'Bearer '
  } */
// #swagger.responses[200] = { description: 'SUCCESS, the user was DELETED' }   
// #swagger.responses[404] = { description: 'The selected user for DELETION was NOT FOUND'}
// #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER'}
// #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to DELETE the user'} 
  const userId: string = req.params.userId; 
  try {
    const data = await UserModel.findOneAndDelete({ _id: userId }) 
    if (!data) {
      // BACKEND Failure OUTPUT 
      res.status(404).send({
        message: `Cannot delete user with userId=${userId}. This userId was not found!`,
      });
      return;
    } else {
      // BACKEND Success OUTPUT 
      res.send({
        message: 'User was deleted successfully!',
      });
      return;
      } 
  } catch(err) {
    // BACKEND Failure OUTPUT 
    res.status(500).send({
      message: 'Deletion error. Could not delete user with userId=' + userId,
    });
  }
};
// END Basic CRUD Operation Methods #######################################################################################/