import express from 'express';
import { UserController } from '../controller/UserController';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/age-range', userController.getUsersByAgeRange);
userRouter.delete('/cleanup-inactive', userController.cleanupInactiveUsers);
userRouter.post('/verify', userController.verify); 

userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUser);

userRouter.get('/', userController.getAllUsers);

export default userRouter;