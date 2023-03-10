import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function UserMustBeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    if (req.user.isAdmin) return next();
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }
  return res.sendStatus(StatusCodes.UNAUTHORIZED);
}
