import express from 'express';
import { PostController } from '../controller/PostController';

const postRouter = express.Router();
const postController = new PostController();

// Rotas de posts
postRouter.post('/', postController.createPost);
postRouter.patch('/:id', postController.updatePost);

export default postRouter;