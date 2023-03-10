import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorFormatter } from '../lib/express-validator';
import Comment from '../models/Comment';
import Post from '../models/Post';

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
   * @param {Request} req Espera o campo content no body, e o postId nos
   * parâmetros da url
   */
  createComment = [
    body('content')
      .isLength({ min: 1, max: 280 })
      .withMessage('O comentário precisa ter de 1 a 280 caracteres'),

    async (
      req: Request<{ postId: string }, {}, { content: string }>,
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
        const post = await Post.findById(req.params.postId);
        if (!post)
          return res.status(StatusCodes.NOT_FOUND).json({
            errors: [
              {
                param: 'postId',
                msg: 'Post não encontrado',
              },
            ],
          });

        const comment = new Comment({
          author: req.user,
          content: req.body.content,
          post: req.params.postId,
        });
        await comment.save();
        return res.sendStatus(StatusCodes.CREATED);
      } catch (error) {
        return next(error);
      }
    },
  ];

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
