const { Router } = require('express');
const userRouter = Router();
const { userService } = require('../services');
const {
  signupValidator,
  loginValidator,
  setUserValidator,
  deleteUserValidator,
} = require('../middlewares/validator/userValidator');
const { loginRequired } = require('../middlewares/loginRequired');

userRouter.post('/signup', signupValidator(), async (req, res, next) => {
  try {
    const { email, password, nick } = req.body;
    const redis = req.app.get('redis');
    const userInfo = { email, password, nick };
    const user = await userService.addUser(redis, userInfo);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.post('/login', loginValidator(), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const redis = req.app.get('redis');

    const userInfo = { email, password };
    const token = await userService.getToken(userInfo, redis);
    res.status(201).json(token);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.patch(
  '/',
  loginRequired,
  setUserValidator(),
  async (req, res, next) => {
    try {
      const { email, nick, password, currentPassword } = req.body;
      const userId = req.currentUserId;
      const updateInfo = { email, nick, password, currentPassword, userId };
      const user = await userService.setUser(updateInfo);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

userRouter.delete(
  '/',
  loginRequired,
  deleteUserValidator(),
  async (req, res, next) => {
    try {
      const { currentPassword } = req.body;
      const redis = req.app.get('redis');
      const userId = req.currentUserId;
      const result = await userService.deleteUser(
        userId,
        redis,
        currentPassword
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = userRouter;
