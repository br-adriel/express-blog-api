import { Router } from 'express';
import CommentController from '../controllers/commentController';
import PostController from '../controllers/postController';

const postRoutes = Router();
const postController = new PostController();
const commentController = new CommentController();

postRoutes.get('/', postController.getPosts);
postRoutes.post('/', postController.createPost);

postRoutes.get('/:id', postController.getPost);
postRoutes.put('/:id', postController.updatePost);
postRoutes.delete('/:id', postController.removePost);

postRoutes.get('/:postId/comments', commentController.getCommentsFromPost);
postRoutes.post('/:postId/comments', commentController.createComment);

export default postRoutes;
