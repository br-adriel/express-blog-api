import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';

export default function UserMustBeAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;
  if (!authToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

  const [tokenType, token] = authToken.split(' ');

  try {
    verify(token, process.env.TOKEN_SECRET!);
    if (tokenType !== 'Bearer') throw new Error();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [{ msg: 'Token de autenticação inválido' }],
    });
  }

  return next();
}
