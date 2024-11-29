import { Router, Request, Response, NextFunction } from 'express';
import * as users from '../controllers/user';

const userRoutes = Router();

userRoutes.get('/', users.findAll);
userRoutes.get('/:id', (req: Request, res: Response, next: NextFunction) => users.findOne(req, res) as unknown as void);
userRoutes.post('/', (req: Request, res: Response, next: NextFunction) => users.create(req, res) as unknown as void);
userRoutes.put('/:id', (req: Request, res: Response, next: NextFunction) => users.update(req, res) as unknown as void);
userRoutes.delete('/:id', (req: Request, res: Response, next: NextFunction) => users.deleteUser(req, res) as unknown as void);

export default userRoutes;