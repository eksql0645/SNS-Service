const { Router } = require('express');
const { nanoid } = require('nanoid');
const { loginRequired } = require('../middlewares/loginRequired');
const { postService } = require('../services');
const { addPostValidator } = require('../middlewares/validator/postValidator');
const weatherAPI = require('../utils/weather');
const errorCodes = require('../utils/errorCodes');
const postRouter = Router();

postRouter.post(
  '/',
  loginRequired,
  addPostValidator(),
  async (req, res, next) => {
    try {
      const { title, content, image, password, tag } = req.body;
      const userId = req.currentUserId;
      const weather = await weatherAPI();

      const postInfo = {
        id: nanoid(),
        title,
        content,
        image,
        weather,
        password,
        postUserId: userId,
        tag,
      };

      const post = await postService.addPost(postInfo);
      if (!post) {
        throw new Error(errorCodes.canNotCreatePost);
      }
      post.password = null;
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.get('/', async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.query);
    res.status(201).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = postRouter;
