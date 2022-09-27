const jwt = require('jsonwebtoken');
const moment = require('moment');
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
      const jwtDecoded = jwt.verify(token, secret);
      return {
        isDecoded: true,
        jwtDecoded,
      };
    } catch (err) {
      return {
        isDecoded: false,
        message: err.message,
      };
    }
  },
  // refresh token 발급
  refreshToken: () => {
    return jwt.sign({}, secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshTokenVarify: async (redis, token, userId) => {
    try {
      const refreshToken = await redis.HGET('refreshToken', userId);
      if (token === refreshToken) {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      } else {
        console.error();
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
