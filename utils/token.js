const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

module.exports = {
  // access token 발급
  accessToken: (user) => {
    const payload = {
      userId: user.id,
      iat: Math.floor(new Date().getTime() / 1000.0),
    };
    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },
  // refresh token 발급
  refreshToken: () => {
    return jwt.sign({}, secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
};
