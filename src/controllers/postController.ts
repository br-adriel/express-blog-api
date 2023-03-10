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
   * @param {Request} req Espera o campo 'id' nos parâmetros da url
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
   * @param {Request} req Espera os campos title e content no seu body
   */
  async createPost(
    req: Request<
      {},
      {},
      {
        title: string;
        content: string;
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
   * @param {Request} req Espera o campo id, correspondente ao post a ser
   * atualizado, nos parâmetros da url
   */
  updatePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.json({});
  }

  /**
   * Remove o post com a id correspondente
   *
   * @param {Request} req Espera o campo id, correspondente ao post a ser
   * apagado, nos parâmetros da url
   */
  removePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return res.sendStatus(200);
  }
}
