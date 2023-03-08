import { NextFunction, Request, Response } from 'express';

class UserController {
  /**
   * Cria um novo usuário
   *
   * @param {Request} req Requisição do express, espera no body as propriedades firstName,
   * lastName, email e password para a criação do usuário
   *
   * @param {Response} res
   *
   * @param {NextFunction} next
   *
   * @returns Retorna um json com os tokens de autenticação
   */
  createUser(
    req: Request<
      {},
      {},
      {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    return res.status(201).json({ token: '' });
  }

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
