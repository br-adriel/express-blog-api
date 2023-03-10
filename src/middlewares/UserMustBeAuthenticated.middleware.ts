import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserFromRequestToken } from '../utils/auth';

/**
 * Garante que o usuário está logado
 */
export default async function UserMustBeAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUserFromRequestToken(req);
    if (user) return next();
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  } catch (err) {
    return next(err);
  }
}
