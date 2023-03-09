import { Router } from 'express';
import CommentController from '../controllers/commentController';
import UserMustBeAuthenticated from '../middlewares/UserMustBeAuthenticated.middleware';

const commentRoutes = Router();
const commentController = new CommentController();

commentRoutes.delete(
  '/:id',
  UserMustBeAuthenticated,
  commentController.removeComment
);

export default commentRoutes;
