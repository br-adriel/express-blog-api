import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorFormatter } from '../lib/express-validator';
import Comment from '../models/Comment';
import Post from '../models/Post';

export default class PostController {
  /**
   * Busca todos os posts
   */
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await Post.find({ isPublished: true })
        .populate('commentsCount')
        .populate('author', '-password -refreshToken -__v')
        .select('-__v -content');
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
    try {
      const post = await Post.findById(req.params.id)
        .populate('commentsCount')
        .populate('author', '-password -refreshToken -__v')
        .select('-__v');

      if (!post) return res.sendStatus(StatusCodes.NOT_FOUND);
      return res.status(StatusCodes.OK).json({ post });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Cria um novo post
   *
   * @param {Request} req Espera os campos title e content no seu body
   */
  createPost = [
    body('title')
      .isLength({ min: 1 })
      .withMessage('Insira um título em sua postagem'),

    body('content')
      .isLength({ min: 1 })
      .withMessage('Adicione conteúdo a sua postagem'),

    async (
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
    ) => {
      const errors = validationResult(req).formatWith(errorFormatter);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.array });
      }

      try {
        const post = new Post({
          title: req.body.title,
          content: req.body.content,
          author: req.user!.id,
        });
        await post.save();
        return res.sendStatus(StatusCodes.CREATED);
      } catch (error) {
        return next(error);
      }
    },
  ];

  /**
   * Atualiza o post com a id correspondente
   *
   * @param {Request} req Espera o campo id, correspondente ao post a ser
   * atualizado, nos parâmetros da url
   */
  updatePost = [
    body('title')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Insira um título em sua postagem'),

    body('content')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Adicione conteúdo a sua postagem'),

    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
      const errors = validationResult(req).formatWith(errorFormatter);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.array });
      }

      try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.sendStatus(StatusCodes.NOT_FOUND);

        if (req.body.title) post.title = req.body.title;
        if (req.body.content) post.content = req.body.content;
        await post.save();

        return res.sendStatus(StatusCodes.OK);
      } catch (error) {
        return next(error);
      }
    },
  ];

  /**
   * Remove o post com a id correspondente
   *
   * @param {Request} req Espera o campo id, correspondente ao post a ser
   * apagado, nos parâmetros da url
   */
  async removePost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await Post.findByIdAndDelete(req.params.id);
      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      return next(error);
    }
  }

  async publishPost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, {
        $set: { isPublished: true },
      });
      if (!post) return res.sendStatus(StatusCodes.NOT_FOUND);
      res.sendStatus(StatusCodes.OK);
    } catch (error) {
      return next(error);
    }
  }
}
