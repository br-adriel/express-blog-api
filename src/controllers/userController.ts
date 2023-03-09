import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator/src/validation-result';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';
import { authenticate } from '../utils/auth';

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
      .isLength({ min: 1 })
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
      const errors = validationResult(req);
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
                value: req.body.email,
                msg: 'Esse email já está em uso',
                param: 'email',
                location: 'body',
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
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns Retorna um json com um array de usuários
   */
  getUsers(req: Request, res: Response, next: NextFunction) {
    return res.json({ users: [] });
  }

  /**
   * Lista dados de um usuário específico
   *
   * @param {Request} req Requisição do express, espera que o id do usuário esteja nos
   * parâmetros da URL
   *
   * @param {Response} res
   *
   * @param {NextFunction} next
   *
   * @returns Retorna um json com um usuário
   */
  getUser(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.json({});
  }

  /**
   * Atualiza um usuário
   *
   * @param req Requisição do express, espera que o id do usuário a ser editado
   * seja passado nos parâmetros da url e que o body do request tenha os campos
   * email, firstName e lastName com os novos valores
   *
   * @param res
   *
   * @param next
   *
   * @returns Retorna o usuário com os dados atualizados
   */
  updateUser(
    req: Request<
      { id: string },
      {},
      { email: string; firstName: string; lastName: string }
    >,
    res: Response,
    next: NextFunction
  ) {
    return res.json({});
  }

  /**
   * Remove um usuário
   *
   * @param req Requisição do express, espera que o id do usuário a ser excluído
   * seja passado nos parâmetros da URL
   *
   * @param res
   *
   * @param next
   *
   * @returns Retorna o código 200
   */
  removeUser(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.sendStatus(200);
  }

  /**
   * Habilita e deabilita os privilégios de um usuário para escrever posts
   *
   * @param req Requisição do express, espera que o id do usuário o qual os
   * privilégios devem ser modificados seja passado nos parâmetros da URL
   *
   * @param res
   *
   * @param next
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
   * @param req Requisição do express, espera que o id do usuário o qual os
   * privilégios devem ser modificados seja passado nos parâmetros da URL
   *
   * @param res
   *
   * @param next
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
   * @param req Requisição do express, espera que o email e o password sejam
   * passados no body
   *
   * @param res
   *
   * @param next
   *
   * @returns Retorna json com o token de autenticação
   */
  login(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    return res.json({ token: '' });
  }
}

export default UserController;
