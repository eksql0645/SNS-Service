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
  accessTokenVerify: (token) => {
    // access token 검증
    try {
      const accessDecoded = jwt.verify(token, secret);
      return accessDecoded;
    } catch (err) {
      return err;
    }
  },
  // refresh token 발급
  refreshToken: () => {
    return jwt.sign({ iat: moment().valueOf() }, secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshTokenVarify: async (redis, token, userId) => {
    try {
      const refreshToken = await redis.HGET('refreshToken', userId);
      if (token === refreshToken) {
        try {
          const refreshDecoded = jwt.verify(token, secret);
          return refreshDecoded;
        } catch (err) {
          return err;
        }
      } else {
        throw new Error(errorCodes.notMatchToken);
      }
    } catch (err) {
      return err;
    }
  },
};
