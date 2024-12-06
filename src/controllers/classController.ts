import { Request, Response } from "express";
import ClassModel from "../models/classModel";

export const create = async (req: Request, res: Response) => {
  /* #swagger.summary = "Creates a class" */
  /* #swagger.description = 'Saves a new class into the database.' */
  // #swagger.responses[201] = { description: 'SUCCESS, POST created a new class' }
  // #swagger.responses[400] = { description: 'BAD REQUEST your POST was attempted with forbidden entries'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the user data'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to POST the selected class'}
  /* #swagger.parameters['body'] = {
      in: "body",
      description: "request body",
      required: true,
        '@schema': {
        "type": "object",
        "properties": { 
        "name": {
            "type": "string",
            "example": "Web Services"
        },      
        "teacher": {
            "type": "string",
            "example": "Mr. FakeTeacher"
        },
        "userId": {
            "type": "string",
            "example": "55532c284e8d64fbf0ea178f"
        },
        "startTime": {
            "type": "date",
            "example": "1970-01-01T09:00"
        },
        "length": {
            "type": "number",
            "example": 90
        },            
        "days": {
            "type": "array",
            "example": [1,3,5]
        }
        },
        "required": "userId"
    }
} */
  try {
    const newClass = new ClassModel(req.body);
    const result = await newClass.save();
    res.status(201).json({ _id: result._id });
  } catch (err) {
    res.status(500).send({
      message: "Creation error. See full error message: " + err,
    });
  }
};

export const createMany = async (req: Request, res: Response) => {
  /* #swagger.summary = "Creates multiple classes" */
  /* #swagger.description = 'Saves new classes into the database.' */
  // #swagger.responses[201] = { description: 'SUCCESS, POST created new classes' }
  // #swagger.responses[400] = { description: 'BAD REQUEST your POST was attempted with forbidden entries'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the user data'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to POST the selected classes'}
  /* #swagger.parameters['reqBody'] = {
      in: "body",
      description: "request body",
      type: "array",
      required: true
} */
  try {
    const result = await ClassModel.insertMany(req.body as Array<Object>);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({
      message: "Creation error. See full error message: " + err,
    });
  }
};

export const findOne = async (req: Request, res: Response) => {
  /* #swagger.summary = "GETS a class by its _id" */
  /* #swagger.description = 'The selected class is displayed.' */
  // #swagger.responses[200] = { description: 'SUCCESS, GET Retrieved the selected class' }
  // #swagger.responses[404] = { description: 'The attempted GET of the selected class was Not Found'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected class'}
  try {
    const foundClass = await ClassModel.findById(req.params.classId);
    if (!foundClass)
      res
        .status(404)
        .send({
          message: `Class with class ID ${req.params.classId} not found!`,
        });
    res.status(200).json(foundClass);
  } catch (err) {
    res.status(500).send({
      message: "Finding error. See full error message: " + err,
    });
  }
};

export const findByUserId = async (req: Request, res: Response) => {
  /* #swagger.summary = "GETS classes by their user's _id" */
  /* #swagger.description = 'The selected classes are displayed.' */
  // #swagger.responses[200] = { description: 'SUCCESS, GET Retrieved the selected classes' }
  // #swagger.responses[404] = { description: 'The attempted GET of the selected classes was Not Found'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to GET the selected classes'}
  try {
    const foundClasses = await ClassModel.find({ userId: req.params.userId });
    if (!foundClasses)
      res
        .status(404)
        .send({
          message: `Classes for user with ID ${req.params.userId} not found! Either that user has no classes, or there is no such user!`,
        });
    res.status(200).json(foundClasses);
  } catch (err) {
    res.status(500).send({
      message: "Finding error. See full error message: " + err,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  /* #swagger.summary = "UPDATES a class that has been selected by _id with any new data entered" */
  /* #swagger.description = 'The changed data for the user updates the database' */
  // #swagger.responses[204] = { description: 'SUCCESS (with no content returned), PUT updated the selected class in the database' }
  // #swagger.responses[400] = { description: 'BAD REQUEST your PUT was attempted with forbidden entries'}
  // #swagger.responses[404] = { description: 'The attempted PUT of the specified class for updating was Not Found'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the class data'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to PUT the data change'}
  /* #swagger.parameters['reqBody'] = {
      in: "body",
      description: "request body",
      required: true,
        '@schema': {
        "type": "object",
        "properties": { 
        "name": {
            "type": "string",
            "example": "Web Services"
        },      
        "teacher": {
            "type": "string",
            "example": "Mr. FakeTeacher"
        },
        "userId": {
            "type": "string",
            "example": "55532c284e8d64fbf0ea178f"
        },
        "startTime": {
            "type": "date",
            "example": "1970-01-01T09:00"
        },
        "length": {
            "type": "number",
            "example": 90
        },            
        "days": {
            "type": "array",
            "example": [1,3,5]
        }
        },
        "required": "userId"
    }
} */
  if (!req.body) {
    res.status(400).send({
      message: "Data to update can not be empty!",
    });
    return;
  }
  try {
    const result = await ClassModel.updateOne(
      { _id: req.params.classId },
      req.body
    );
    res.status(204).json(result);
  } catch (err) {
    res.status(500).send({
      message: "Update error. See full error message: " + err,
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  /* #swagger.summary = "DELETES a class by its _id" */
  /* #swagger.description = 'With deletion it's permanently removed from the database.' */
  // #swagger.responses[200] = { description: 'SUCCESS, the class was DELETED' }
  // #swagger.responses[404] = { description: 'The selected class for DELETION was NOT FOUND'}
  // #swagger.responses[412] = { description: 'The PRECONDITION FAILED in the validation of the _id PARAMETER'}
  // #swagger.responses[500] = { description: 'There was an INTERNAL SERVER ERROR while trying to DELETE the class'}
  try {
    const result = await ClassModel.deleteOne({ _id: req.params.classId });
    if (!result) {
      res.status(404).send({
        message: `Cannot delete user with classId=${req.params.classId}. This classId was not found!`,
      });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({
      message: "Deletion error. See full error message: " + err,
    });
  }
};
