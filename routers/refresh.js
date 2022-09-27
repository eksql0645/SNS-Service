const { Router } = require('express');
const refreshRouter = Router();
const { refreshService } = require('../services');

refreshRouter.post('/', async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['refresh'] && req.headers['refresh'];
    const redis = req.app.get('redis');
    const token = await refreshService.checkExpiredToken(
      userToken,
      refreshToken,
      redis
    );
    res.status(201).json(token);
  } catch (err) {
    next(err);
  }
});

module.exports = refreshRouter;
