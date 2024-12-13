import { Request, Response } from 'express';
import GoalModel from '../models/goalsModel';

export const create = async (req: Request, res: Response) => {
    /* #swagger.summary = "Creates a new goal" */
    /* #swagger.description = 'Saves a new goal into the database.' */
    // #swagger.responses[201] = { description: 'SUCCESS, POST created a new goal' }
    // #swagger.responses[400] = { description: 'BAD REQUEST your POST was attempted with forbidden entries' }
    // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the user data' }
    // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to POST the goal' }
    /* #swagger.parameters['body'] = {
          in: "body",
          description: "Request body",
          required: true,
          '@schema': {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "example": "Solar Panel Installation"
              },
              "description": {
                "type": "string",
                "example": "Complete installation of the solar panel system."
              },
              "dueDate": {
                "type": "string",
                "example": "2024-12-31"
              },
              "userId": {
                "type": "string",
                "example": "55532c284e8d64fbf0ea178f"
              }
            },
            "required": ["name", "userId"]
          }
        }
    */
    try {
      const { name, description, dueDate, userId } = req.body;
      const newGoal = new GoalModel({ name, description, dueDate, userId });
      const result = await newGoal.save();
      res.status(201).json({ _id: result._id });
    } catch (err) {
      res.status(500).send({
        message: "Creation error. See full error message: " + err,
      });
    }
  };
  



export const getGoalById = async (req: Request, res: Response) => {
  try {
    const goal = await GoalModel.findById(req.params.goalId);
    if (!goal) {
      res.status(404).json({ message: `Goal not found with ID: ${req.params.goalId}` });
      return;
    }
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error fetching goal" });
  }
};




export const getGoalsByUserId = async (req: Request, res: Response) => {
    /* #swagger.summary = "GET goals by their user's _id" */
    /* #swagger.description = 'The selected goals are displayed.' */
    // #swagger.responses[200] = { description: 'SUCCESS, GET Retrieved the selected goals' }
    // #swagger.responses[404] = { description: 'The attempted GET of the selected goals was Not Found' }
    // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER' }
    // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected goals' }
    try {
      const goals = await GoalModel.find({ userId: req.params.userId });
  
      if (!goals || goals.length === 0) {
        res.status(404).send({
          message: `Goals for user with ID ${req.params.userId} not found! Either that user has no goals, or there is no such user!`,
        });
        return;
      }
  
      res.status(200).json(goals);
    } catch (err) {
      res.status(500).send({
        message: "Finding error. See full error message: " + err,
      });
    }
  };
  



export const update = async (req: Request, res: Response) => {
  try {
    const updatedGoal = await GoalModel.findByIdAndUpdate(req.params.goalId, req.body, { new: true });
    if (!updatedGoal) {
      res.status(404).json({ message: `Goal not found with ID: ${req.params.goalId}` });
      return;
    }
    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: "Error updating goal" });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const deletedGoal = await GoalModel.findByIdAndDelete(req.params.goalId);
    if (!deletedGoal) {
      res.status(404).json({ message: `Goal not found with ID: ${req.params.goalId}` });
      return;
    }
    res.status(200).json(deletedGoal);
  } catch (err) {
    res.status(500).json({ message: "Error deleting goal" });
  }
};
export function createMany(arg0: string, createMany: any) {
  throw new Error('Function not implemented.');
}

