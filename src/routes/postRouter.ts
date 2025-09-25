import express from 'express';
import { PostController } from '../controller/PostController';

const postRouter = express.Router();
const postController = new PostController();

postRouter.get('/', postController.getAllPosts);
postRouter.get('/author/:authorId', postController.getPostsByAuthor);
postRouter.get('/:id', postController.getPostById);
postRouter.post('/', postController.createPost);
postRouter.patch('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);

export default postRouter;