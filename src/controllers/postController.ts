import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Post from '../models/Post';

export default class PostController {
  /**
   * Busca todos os posts
   */
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await Post.find({}).populate(
        'author',
        '-password -refreshToken -__v'
      );
      return res.status(StatusCodes.OK).json({ posts });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Busca o post específicado pelo id
   *
   * @param {Request} req Requisição do express, espera o campo 'id' nos parâmetros da url
   * @param {Response} res
   * @param {NextFunction} next
   * @returns Resposta com objeto json representando o post solicitado
   */
  async getPost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    return res.json({});
  }

  /**
   * Cria um novo post
   *
   * @param {Request} req Requisição do express, espera os campos title, content e author no seu body
   * @param {Response} res
   * @param {NextFunction} next
   * @returns Resposta 201 informando que o post foi criado
   */
  async createPost(
    req: Request<
      {},
      {},
      {
        title: string;
        content: string;
        author: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    return res.sendStatus(201);
  }

  /**
   * Atualiza o post com a id correspondente
   *
   * @param {Request} req Requisição do express, espera o campo id, correspondente ao post a ser atualizado, nos parâmetros da url
   * @param res
   * @param next
   * @returns Retorna um json com o post atualizado
   */
  updatePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.json({});
  }

  /**
   * Remove o post com a id correspondente
   *
   * @param {Request} req Requisição do express, espera o campo id, correspondente ao post a ser apagado, nos parâmetros da url
   * @param res
   * @param next
   * @returns
   */
  removePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.sendStatus(200);
  }
}
