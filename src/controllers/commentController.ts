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
    req: Request<{ postId: string }, {}, {}, { page?: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pageNumber = Number.isInteger(Number(req.query.page))
        ? Number(req.query.page)
        : 1;
      if (pageNumber < 1) return res.sendStatus(StatusCodes.BAD_REQUEST);

      const comments = await Comment.find({ post: req.params.postId })
        .populate('author', '-__v -password -refreshToken')
        .select('-__v -post')
        .skip((pageNumber - 1) * 10)
        .limit(10);

      const totalComments = await Comment.find({
        post: req.params.postId,
      }).count();
      const totalPages = Math.ceil(totalComments / 10);

      if (pageNumber > totalPages)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

      const result: any = {
        comments,
        page: pageNumber,
      };

      if (pageNumber < totalPages) {
        result.next = `/posts/${req.params.postId}/comments?page=${
          pageNumber + 1
        }`;
      }
      if (pageNumber > 1) {
        result.prev = `/posts/${req.params.postId}/comments?page=${
          pageNumber - 1
        }`;
      }
      return res.status(StatusCodes.OK).json(result);
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
   */
  async removeComment(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      return next(error);
    }
  }
}
