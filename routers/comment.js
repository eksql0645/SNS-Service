const { Router } = require('express');
const { loginRequired } = require('../middlewares/loginRequired');
const { commentService } = require('../services');
const commentRouter = Router();

commentRouter.post('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;
    const commentInfo = { postId, comment };
    const newComment = await commentService.addComment(commentInfo);
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
});

commentRouter.get('/', loginRequired, async (req, res, next) => {
  try {
    res.status(201).json();
  } catch (err) {
    next(err);
  }
});

commentRouter.get('/:id', loginRequired, async (req, res, next) => {
  try {
    res.status(201).json();
  } catch (err) {
    next(err);
  }
});

commentRouter.patch('/:id', loginRequired, async (req, res, next) => {
  try {
    res.status(201).json();
  } catch (err) {
    next(err);
  }
});

commentRouter.delete('/:id', loginRequired, async (req, res, next) => {
  try {
    res.status(201).json();
  } catch (err) {
    next(err);
  }
});

module.exports = commentRouter;
