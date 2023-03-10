import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator/src/validation-result';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, verify } from 'jsonwebtoken';
import { errorFormatter } from '../lib/express-validator';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import { authenticate, generateAuthToken } from '../utils/auth';

class UserController {
  /**
   * Cria um novo usuário
   */
  createUser = [
    body('firstName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Informe um nome')
      .escape(),

    body('lastName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Informe um sobrenome')
      .escape(),

    body('email')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Informe um email')
      .isEmail()
      .withMessage('O valor não é um email válido'),

    body('password')
      .isStrongPassword()
      .withMessage('A senha não é forte o suficiente')
      .isLength({ min: 8 })
      .withMessage('A senha é curta demais'),

    body('password2')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('As senhas não são iguais'),

    async (
      req: Request<
        {},
        {},
        {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
          password2: string;
        }
      >,
      res: Response,
      next: NextFunction
    ) => {
      const errors = validationResult(req).formatWith(errorFormatter);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            errors: [
              {
                msg: 'Esse email já está em uso',
                param: 'email',
              },
            ],
          });
        }

        const hashedPassword = await hash(req.body.password, 10);
        const newUser = new User({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
        });

        const savedUser = await newUser.save();
        const [token, refreshToken] = await authenticate(
          savedUser.email,
          req.body.password
        );

        return res.status(StatusCodes.CREATED).json({
          token,
          refreshToken,
        });
      } catch (err) {
        return next(err);
      }
    },
  ];

  /**
   * Lista todos os usuários
   *
   * @returns Retorna um json com um array de usuários
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({}).select('-refreshToken -password -__v');
      return res.json({ users });
    } catch (err) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
  }

  /**
   * Lista dados de um usuário específico
   *
   * @param {Request} req Espera que o id do usuário esteja nos parâmetros da URL
   * @returns Retorna um json com um usuário
   */
  async getUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findById(req.params.id).select(
        '-refreshToken -password -__v'
      );
      return res.json({ user });
    } catch (err) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
  }

  /**
   * Atualiza um usuário
   *
   * @param req Espera que o id do usuário a ser editado seja passado nos
   * parâmetros da url e que o body do request tenha os campos firstName
   * e lastName com os novos valores
   * @returns Retorna o usuário com os dados atualizados
   */
  updateUser = [
    body('firstName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Informe um nome')
      .escape(),

    body('lastName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Informe um sobrenome')
      .escape(),

    async (
      req: Request<{ id: string }, {}, { firstName: string; lastName: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const errors = validationResult(req).formatWith(errorFormatter);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        }).select('-refreshToken -password -__v');

        user!.firstName = req.body.firstName;
        user!.lastName = req.body.lastName;

        return res.status(StatusCodes.OK).json({ user });
      } catch (error) {
        return next(error);
      }
    },
  ];

  /**
   * Remove um usuário
   *
   * @param req Espera que o id do usuário a ser excluído seja passado nos parâmetros da URL
   * @returns Retorna o código 200
   */
  removeUser(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.sendStatus(200);
  }

  /**
   * Habilita e deabilita os privilégios de um usuário para escrever posts
   *
   * @param req Espera que o id do usuário o qual os privilégios devem ser
   * modificados seja passado nos parâmetros da URL
   *
   * @returns Retorna o código 200
   */
  toggleUserAuthorPrivileges(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    return res.sendStatus(200);
  }

  /**
   * Habilita e deabilita os privilégios de admin de um usuário
   *
   * @param req Espera que o id do usuário o qual os privilégios devem ser
   * modificados seja passado nos parâmetros da URL
   *
   * @returns Retorna o código 200
   */
  toggleUserAdminrPrivileges(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    return res.sendStatus(200);
  }

  /**
   * Realiza o login do usuário
   *
   * @param req Espera que o email e o password sejam passados no body
   * @returns Retorna json com o token de autenticação
   */
  login = [
    body('email')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Informe um email')
      .isEmail()
      .withMessage('O valor não é um email válido'),

    body('password').isLength({ min: 8 }).withMessage('A senha é curta demais'),

    async (
      req: Request<
        {},
        {},
        {
          email: string;
          password: string;
        }
      >,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();

        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error();

        const [token, refreshToken] = await authenticate(
          req.body.email,
          req.body.password
        );

        return res.status(StatusCodes.OK).json({
          token,
          refreshToken,
        });
      } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          errors: [
            {
              param: 'email',
              msg: 'Credenciais inválidas',
            },
          ],
        });
      }
    },
  ];

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    if (!authToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const [tokenType, token] = authToken.split(' ');

    try {
      const payload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
      if (tokenType !== 'Bearer') throw new Error();

      // verifica que o token existe no banco
      const existingToken = await RefreshToken.findOne({ user: payload.sub });
      if (!existingToken) throw new Error();

      // verifica que o usuario a que o token se refere existe
      const user = await User.findById(payload.sub);
      if (!user) throw new Error();

      // verifica que o token e o usuario estao relacionados
      if (user.refreshToken?.toString() !== existingToken.id) throw new Error();

      const newToken = await generateAuthToken(user.id);
      return res.status(StatusCodes.OK).json({ token: newToken });
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: [{ param: '', msg: 'Token de autenticação inválido' }],
      });
    }
  }
}

export default UserController;
