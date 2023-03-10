import { compareSync } from 'bcrypt';
import { Request } from 'express';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';

/**
 * Autentica o usuário retornando os tokens de autenticação
 */
export async function authenticate(
  email: string,
  password: string
): Promise<string[]> {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Credenciais inválidas');

  const passwordIsCorrect = compareSync(password, user.password);
  if (!passwordIsCorrect) throw new Error('Credenciais inválidas');

  const token = await generateAuthToken(user.id);
  const refreshToken = await generateAuthToken(user.id, true);
  return [token, refreshToken];
}

/**
 * Gera um token JWT de autenticação
 */
export async function generateAuthToken(
  userId: string,
  isRefreshToken = false
): Promise<string> {
  const EXPIRATION = isRefreshToken ? '30 days' : '30m';

  const token = sign({}, process.env.TOKEN_SECRET as string, {
    subject: userId,
    expiresIn: EXPIRATION,
  });

  if (isRefreshToken) {
    const newRefreshToken = new RefreshToken({
      user: userId,
    });
    const savedRefreshToken = await newRefreshToken.save();

    const user = await User.findById(userId);
    if (user!.refreshToken) {
      RefreshToken.findByIdAndDelete(user?.refreshToken);
    }
    await User.findByIdAndUpdate(userId, {
      refreshToken: savedRefreshToken.id,
    });
  }

  return token;
}

/**
 * Busca o usuário referente ao token quando ele é passado no request, e null
 * quando não é passado ou o token é inválido
 */
export async function getUserFromRequestToken(req: Request) {
  const authToken = req.headers.authorization;
  if (!authToken) return null;

  const [tokenType, token] = authToken.split(' ');

  const payload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
  if (tokenType !== 'Bearer') return null;

  const user = (await User.findById(payload.sub)) as Express.User;
  return user;
}
