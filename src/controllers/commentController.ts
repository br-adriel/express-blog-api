import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Comment from '../models/Comment';

export default class CommentController {
  /**
   * Busca todos os comentários de um post
   *
   * @param {Request} req Espera que o id do post esteja nos parâmetros da url
   * com o nome postId
   */
  async getCommentsFromPost(
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comments = await Comment.find({ post: req.params.postId });
      return res.status(StatusCodes.OK).json({ comments });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Cria um novo comentário
   *
   * @param {Request} req Requisição do express, espera os campos content e
   * author no seu body, e o postId nos parâmetros da url
   *
   * @param {Response} res
   *
   * @param {NextFunction} next
   *
   * @returns Resposta 201 com json do comentário criado
   */
  async createComment(
    req: Request<
      { postId: string },
      {},
      {
        content: string;
        author: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    return res.status(201).json({});
  }

  /**
   * Remove o comentário com a id correspondente
   *
   * @param {Request} req Requisição do express, espera o campo id,
   * correspondente ao comentário a ser apagado, nos parâmetros da url
   *
   * @param res
   *
   * @param next
   *
   * @returns
   */
  removeComment(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    return res.sendStatus(200);
  }
}
