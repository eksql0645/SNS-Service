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

// 회원가입
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

// 로그인
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

// 회원조회
userRouter.get('/', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// 회원수정
userRouter.patch(
  '/',
  loginRequired,
  setUserValidator(),
  async (req, res, next) => {
    try {
      const { email, nick, password, currentPassword } = req.body;
      const userId = req.currentUserId;
      const redis = req.app.get('redis');
      const updateInfo = { email, nick, password, currentPassword, userId };
      const result = await userService.setUser(redis, updateInfo);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// 회원탈퇴
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
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// 임시 비밀번호 생성
userRouter.post('/:email/temp-password', async (req, res, next) => {
  try {
    const { email } = req.params;

    const result = await userService.sendTempPasswordMail(email);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 탈퇴 회원 확인
userRouter.get('/deleted-user', async (req, res, next) => {
  try {
    const { email } = req.body;
    const redis = req.app.get('redis');

    const result = await userService.checkDeletedUser(redis, email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 회원 복구
userRouter.post('/deleted-user/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const { password } = req.body;
    const redis = req.app.get('redis');

    const restoredUser = await userService.reCreateUser(redis, email, password);
    res.status(201).json(restoredUser);
  } catch (err) {
    next(err);
  }
});
module.exports = userRouter;
