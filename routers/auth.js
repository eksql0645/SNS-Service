const { Router } = require('express');
const { isLogined } = require('../middlewares/isLogined');
const { authService } = require('../services');
const authRouter = Router();

// 메일 전송
authRouter.post('/mail', async (req, res, next) => {
  try {
    const { email } = req.body;
    const redis = req.app.get('redis');

    const result = await authService.sendAuthMail(redis, email);

    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
});

// 인증
authRouter.post('/:email', isLogined, async (req, res, next) => {
  try {
    const redis = req.app.get('redis');
    const { authNumber } = req.body;
    const { email } = req.params;
    const userId = req.currentUserId;
    const authInfo = { userId, redis, email, authNumber };
    const result = await authService.checkAuthNumber(authInfo);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});
module.exports = authRouter;
