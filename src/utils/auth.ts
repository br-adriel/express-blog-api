import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
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
    const newRefreshToken = new RefreshToken({ user: userId });
    const savedRefreshToken = await newRefreshToken.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: { refreshTokens: [savedRefreshToken.id] },
    });
  }

  return token;
}
