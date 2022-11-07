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

// 게시글 생성
postRouter.post(
  '/',
  loginRequired,
  addPostValidator(),
  async (req, res, next) => {
    try {
      const { title, content, tag, url } = req.body;
      const userId = req.currentUserId;
      const weather = await weatherAPI();
      const postInfo = {
        id: nanoid(),
        title,
        content,
        image: url,
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

// 게시글 전체 조회
postRouter.get('/', getPostsValidator(), async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.query);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// 게시글 조회
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

// 게시글 수정
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

// 게시글 삭제
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

// 게시글 좋아요
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

// 게시글 좋아요 취소
postRouter.delete(
  '/:id/liker',
  loginRequired,
  paramValidator(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.currentUserId;
      const result = await postService.unlikePost(id, userId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// 번역
postRouter.get('/:id/translation', async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postService.translatePost(id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = postRouter;
