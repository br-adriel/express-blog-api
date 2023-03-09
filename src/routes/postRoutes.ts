import { Router } from 'express';
import CommentController from '../controllers/commentController';
import PostController from '../controllers/postController';
import UserMustBeAuthenticated from '../middlewares/UserMustBeAuthenticated.middleware';

const postRoutes = Router();
const postController = new PostController();
const commentController = new CommentController();

postRoutes.get('/', postController.getPosts);
postRoutes.post('/', UserMustBeAuthenticated, postController.createPost);

postRoutes.get('/:id', postController.getPost);
postRoutes.put('/:id', UserMustBeAuthenticated, postController.updatePost);
postRoutes.delete('/:id', UserMustBeAuthenticated, postController.removePost);

postRoutes.get('/:postId/comments', commentController.getCommentsFromPost);
postRoutes.post(
  '/:postId/comments',
  UserMustBeAuthenticated,
  commentController.createComment
);

export default postRoutes;
