const { Router } = require('express');
const { nanoid } = require('nanoid');
const { loginRequired } = require('../middlewares/loginRequired');
const { isLogined } = require('../middlewares/isLogined');
const { postService } = require('../services');
const {
  addPostValidator,
  getPostsValidator,
  paramValidator,
  setPostValidator,
  deletePostValidator,
} = require('../middlewares/validator/postValidator');
const weatherAPI = require('../utils/weather');
const errorCodes = require('../utils/errorCodes');
const postRouter = Router();

postRouter.post(
  '/',
  loginRequired,
  addPostValidator(),
  async (req, res, next) => {
    try {
      const { title, content, image, tag } = req.body;
      const userId = req.currentUserId;
      const weather = await weatherAPI();

      const postInfo = {
        id: nanoid(),
        title,
        content,
        image,
        weather,
        postUserId: userId,
        tag,
      };

      const post = await postService.addPost(postInfo);
      if (!post) {
        throw new Error(errorCodes.canNotCreatePost);
      }
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.get('/', getPostsValidator(), async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.query);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

postRouter.get('/:id', isLogined, paramValidator(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.currentUserId;
    const redis = req.app.get('redis');
    const post = await postService.getPost(id, userId, redis);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

postRouter.patch(
  '/:id',
  loginRequired,
  setPostValidator(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.currentUserId;
      const result = await postService.setPost(id, userId, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.delete(
  '/:id',
  loginRequired,
  deletePostValidator(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.currentUserId;
      const { password } = req.body;
      const redis = req.app.get('redis');
      const deleteInfo = { id, userId, password, redis };
      const result = await postService.deletePost(deleteInfo);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.post(
  '/:id/liker',
  loginRequired,
  paramValidator(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.currentUserId;
      const redis = req.app.get('redis');
      const result = await postService.likePost(id, userId, redis);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.delete(
  '/:id/liker',
  loginRequired,
  paramValidator(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.currentUserId;
      const redis = req.app.get('redis');
      const result = await postService.unlikePost(id, userId, redis);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = postRouter;
