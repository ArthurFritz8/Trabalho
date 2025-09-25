import express from 'express';
import { UserController } from '../controller/UserController';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/age-range', userController.getUsersByAgeRange);
userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUser);

export default userRouter;