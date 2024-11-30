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
      // BACKEND OUTPUT   
      res.status(404).send({ 
        message: 'No users found! There are either no users yet, or their was an error retrieving them.'
      }); 
      return;
    } else {
      res.status(200).send(data); // Send the newly ordered data  
      }
  } catch(err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).send({
      message: errorMessage,
    });  
  }
}

// #2 main "Get" method for getting 1 USER by id

/*** MAIN 3 alter data METHODS ********************************************************************************************/
// #1 the "Post" METHOD for a new USER
export const create = async (req: Request, res: Response) => { 
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      name: savedUser.name,
      email: savedUser.email,
      _id: savedUser._id,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};
// END Basic CRUD Operation Methods #######################################################################################/