import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

/**
 * Garante que o usuário que está solicitando o acesso a um objeto 'User' tem
 * permissão para acessá-lo (se é dono dele ou admin)
 */
export async function UserBelongsToUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    if (req.user.isAdmin) return next();

    try {
      const requestedUser = await User.findById(req.params.id);
      if (!requestedUser) return res.sendStatus(StatusCodes.NOT_FOUND);

      if (req.user!.id !== requestedUser.id)
        return res.sendStatus(StatusCodes.FORBIDDEN);
      return next();
    } catch (error) {
      next(error);
    }
  }
  return res.sendStatus(StatusCodes.UNAUTHORIZED);
}

/**
 * Garante que o usuário que está solicitando o acesso a um objeto 'Post' tem
 * permissão para acessá-lo (se é seu autor ou admin)
 */
export async function PostBelongsToUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    if (req.user.isAdmin) return next();

    try {
      const requestedPost = await Post.findById(req.params.id);
      if (!requestedPost) return res.sendStatus(StatusCodes.NOT_FOUND);

      if (req.user!.id !== requestedPost.author.toString())
        return res.sendStatus(StatusCodes.FORBIDDEN);
      return next();
    } catch (error) {
      next(error);
    }
  }
  return res.sendStatus(StatusCodes.UNAUTHORIZED);
}

/**
 * Garante que o usuário que está solicitando o acesso a um objeto 'Comment' tem
 * permissão para acessá-lo (se é seu autor ou admin)
 */
export async function CommentBelongsToUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    if (req.user.isAdmin) return next();

    try {
      const requestedComment = await Comment.findById(req.params.id);
      if (!requestedComment) return res.sendStatus(StatusCodes.NOT_FOUND);

      if (req.user!.id !== requestedComment.author.toString())
        return res.sendStatus(StatusCodes.FORBIDDEN);
      return next();
    } catch (error) {
      next(error);
    }
  }
  return res.sendStatus(StatusCodes.UNAUTHORIZED);
}
