import { Router } from 'express';
import PostController from '../controllers/postController';

const postRouter = Router();
const postController = new PostController();

postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);

postRouter.get('/:id', postController.getPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.removePost);

export default postRouter;
