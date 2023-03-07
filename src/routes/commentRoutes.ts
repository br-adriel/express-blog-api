import { Router } from 'express';
import CommentController from '../controllers/commentController';

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.delete('/:id', commentController.removeComment);

export default commentRouter;
