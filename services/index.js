const userService = require('./user');
const postService = require('./post');
const commentService = require('./comment');
const refreshService = require('./refresh');
const authService = require('./auth');

module.exports = {
  userService,
  refreshService,
  postService,
  commentService,
  authService,
};
