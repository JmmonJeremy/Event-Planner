import { Request, Response, Router } from 'express';
import ClassModel from '../models/classModel';

const classRoutes = Router();

classRoutes.post('/classes', async (req: Request, res: Response) => {
        /* #swagger.parameters['reqBody'] = {
      in: "body",
      description: "request body",
      type: "object",
      required: true
} */
    const newClass = new ClassModel(req.body);
    const result = await newClass.save();
    res.status(201).json({_id: result._id})
});

classRoutes.post('/classes/createWithArray', async (req: Request, res: Response) => {
    const result = await ClassModel.insertMany((req.body as Array<Object>));
    res.status(201).json(result);
});

classRoutes.get('/classes/:classId', async (req: Request, res: Response) => {
    const foundClass = await ClassModel.findById(req.params.classId);
    res.status(200).json(foundClass);
});

classRoutes.get('/classes/user/:userId', async (req: Request, res: Response) => {
    const foundClass = await ClassModel.findOne({"userId":req.params.userId});
    res.status(200).json(foundClass);
});

classRoutes.put('/classes/:classId', async (req: Request, res: Response) => {
        /* #swagger.parameters['reqBody'] = {
      in: "body",
      description: "request body",
      type: "object",
      required: true
} */
    const result = await ClassModel.updateOne({_id:req.params.classId}, req.body);
    res.status(204).json(result);
});

classRoutes.delete('/classes/:classId', async (req: Request, res: Response) => {
    const result = await ClassModel.deleteOne({_id:req.params.classId});
    res.status(200).json(result);
});

export default classRoutes;
