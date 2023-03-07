import { Router } from 'express';
import CommentController from '../controllers/commentController';
import PostController from '../controllers/postController';

const postRouter = Router();
const postController = new PostController();
const commentController = new CommentController();

postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);

postRouter.get('/:id', postController.getPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.removePost);

postRouter.get('/:postId/comments', commentController.getCommentsFromPost);
postRouter.post('/:postId/comments', commentController.createComment);

export default postRouter;
