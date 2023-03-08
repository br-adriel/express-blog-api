import { Router } from 'express';
import CommentController from '../controllers/commentController';

const commentRoutes = Router();
const commentController = new CommentController();

commentRoutes.delete('/:id', commentController.removeComment);

export default commentRoutes;
