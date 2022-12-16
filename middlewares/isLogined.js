const { loginRequired } = require('./loginRequired');

async function isLogined(req, res, next) {
  if (req.headers['authorization']) {
    loginRequired(req, res, next);
  } else if (!req.headers['authorization']) {
    next();
  }
}
module.exports = { isLogined };
