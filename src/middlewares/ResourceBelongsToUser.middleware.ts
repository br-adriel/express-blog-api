import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';

/**
 * Garante que o usuário que está solicitando o acesso a um objeto 'User' tem
 * permissão para acessá-lo (se é dono dele ou admin)
 *
 * @param req
 * @param res
 * @param next
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
