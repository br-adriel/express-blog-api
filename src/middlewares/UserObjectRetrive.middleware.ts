import { NextFunction, Request, Response } from 'express';
import { getUserFromRequestToken } from '../utils/auth';

/**
 * Caso a requisição tenha um token, o sistema busca seus dados no sistema e o
 * inclui na propriedade "user" do request
 */
export async function UserObjectRetrieve(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUserFromRequestToken(req);
    if (user) req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
