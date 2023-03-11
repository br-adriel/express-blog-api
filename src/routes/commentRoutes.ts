import { Router } from 'express';
import CommentController from '../controllers/commentController';
import { CommentBelongsToUser } from '../middlewares/ResourceBelongsToUser.middleware';
import UserMustBeAuthenticated from '../middlewares/UserMustBeAuthenticated.middleware';

const commentRoutes = Router();
const commentController = new CommentController();

commentRoutes.delete(
  '/:id',
  UserMustBeAuthenticated,
  CommentBelongsToUser,
  commentController.removeComment
);

export default commentRoutes;
