import { Request, Response, Router } from 'express';
import GoalModel from '../models/goalsModel'; // Path to your goal model

const goalRoutes = Router();

// POST /goals - Create a new goal
goalRoutes.post('/goals', async (req: Request, res: Response) => {
  try {
    const { name, description, dueDate } = req.body;

    // Create a new goal
    const newGoal = new GoalModel({
      name,
      description,
      dueDate,
      userId: req.body.userId, // Assuming userId is passed in the request body
    });

    // Save the goal to the database
    await newGoal.save();

    // Return a success message
    res.status(201).json({
      message: "Goal created successfully",
      goal: newGoal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(400).json({ message: 'Bad Request' });
  }
});

/*goalRoutes.post('/goals/createWithArray', async (req: Request, res: Response) => {
    try {
      const goalsArray = req.body; // Expecting an array of goal objects
  

      // Create multiple goals using insertMany
      const newGoals = await GoalModel.insertMany(goalsArray);
  
      // Return success response
      res.status(201).json({
        message: "Goals created successfully",
        goals: newGoals
      });
    } catch (error) {
      console.error('Error creating goals:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  */

// GET /goals/:goalId - Get a specific goal by ID
goalRoutes.get('/goals/:goalId', async (req: Request, res: Response) => {
    try {
      const goal = await GoalModel.findById(req.params.goalId);
      res.json(goal);  // If goal is null, this will return null
    } catch (error) {
      console.error('Error fetching goal:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// GET /goals/user/:userId - Get all goals for a specific user
goalRoutes.get('/goals/user/:userId', async (req: Request, res: Response) => {
    try {
      const goals = await GoalModel.find({ userId: req.params.userId });
      res.json(goals);  // If no goals, it returns an empty array
    } catch (error) {
      console.error('Error fetching goals for user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// PUT /goals/:goalId - Update a specific goal by ID
goalRoutes.put('/goals/:goalId', async (req: Request, res: Response) => {
    try {
      const { name, description, dueDate } = req.body;
      const updatedGoal = await GoalModel.findByIdAndUpdate(
        req.params.goalId,
        { name, description, dueDate },
        { new: true } // Return the updated goal
      );
  
      res.json(updatedGoal);  // If goal doesn't exist, this will return null
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// DELETE /goals/:goalId - Delete a specific goal by ID
goalRoutes.delete('/goals/:goalId', async (req: Request, res: Response) => {
    try {
      const deletedGoal = await GoalModel.findByIdAndDelete(req.params.goalId);
      res.json(deletedGoal);  // If goal doesn't exist, this will return null
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

export default goalRoutes;
