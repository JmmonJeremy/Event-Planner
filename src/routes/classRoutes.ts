import { Request, Response, Router } from 'express';
import * as ClassController from '../controllers/classController';
import { validate, IDValidationRules, classValidationRules } from '../config/validator';

const classRoutes = Router();

classRoutes.post('/classes', classValidationRules(), validate, ClassController.create);

classRoutes.post('/classes/createWithArray', ClassController.createMany);

classRoutes.get('/classes/:classId', IDValidationRules('classId'), validate, ClassController.findOne);

classRoutes.get('/classes/user/:userId', IDValidationRules('userID'), validate, ClassController.findByUserId);

classRoutes.put('/classes/:classId', IDValidationRules('classId'), validate, ClassController.update);
classRoutes.delete('/classes/:classId', IDValidationRules('classId'), validate, ClassController.deleteClass);

export default classRoutes;
