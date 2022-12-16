const { Comment } = require('../db');

const createComment = async (commentInfo) => {
  const newComment = await Comment.create(commentInfo);
  return newComment;
};
const findComment = async () => {};
const findComments = async () => {};
const updateComment = async () => {};
const destroyComment = async () => {};

module.exports = {
  createComment,
  findComment,
  findComments,
  updateComment,
  destroyComment,
};
