const { Comment } = require('../db');

const createComment = async (commentInfo) => {
  const newComment = await Comment.create(commentInfo);
  return newComment;
};

const findComment = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  return comment;
};

const updateComment = async (commentInfo) => {
  const reuslt = await Comment.update(
    { comment: commentInfo.comment },
    { where: { id: commentInfo.commentId } }
  );
  return reuslt;
};
const destroyComment = async () => {};

module.exports = {
  createComment,
  findComment,
  updateComment,
  destroyComment,
};
