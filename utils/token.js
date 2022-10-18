const jwt = require('jsonwebtoken');
const moment = require('moment');
const errorCodes = require('./errorCodes');
const secret = process.env.JWT_SECRET_KEY;

module.exports = {
  // access token 발급
  accessToken: (userId) => {
    const payload = {
      userId,
      iat: moment().valueOf(),
    };
    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },
  // access token 검증
  accessTokenVerify: (token) => {
    const accessDecoded = jwt.verify(token, secret);
    return accessDecoded;
  },
  // refresh token 발급
  refreshToken: () => {
    return jwt.sign({ iat: moment().valueOf() }, secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  // refresh token 검증
  refreshTokenVarify: async (redis, token, userId) => {
    const refreshToken = await redis.HGET('refreshToken', userId);
    if (token === refreshToken) {
      const refreshDecoded = jwt.verify(token, secret);
      return refreshDecoded;
    } else {
      throw new Error(errorCodes.notMatchToken);
    }
  },
};
