import { Router } from 'express';
import CommentController from '../controllers/commentController';
import PostController from '../controllers/postController';
import { PostBelongsToUser } from '../middlewares/ResourceBelongsToUser.middleware';
import UserMustBeAuthenticated from '../middlewares/UserMustBeAuthenticated.middleware';

const postRoutes = Router();
const postController = new PostController();
const commentController = new CommentController();

postRoutes.get('/', postController.getPosts);
postRoutes.post('/', UserMustBeAuthenticated, postController.createPost);

postRoutes.get('/:id', postController.getPost);
postRoutes.patch(
  '/:id',
  UserMustBeAuthenticated,
  PostBelongsToUser,
  postController.updatePost
);
postRoutes.delete(
  '/:id',
  UserMustBeAuthenticated,
  PostBelongsToUser,
  postController.removePost
);

postRoutes.patch('/:id/publish', PostBelongsToUser, postController.publishPost);

postRoutes.get('/:postId/comments', commentController.getCommentsFromPost);
postRoutes.post(
  '/:postId/comments',
  UserMustBeAuthenticated,
  commentController.createComment
);

export default postRoutes;
