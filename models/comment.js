const { Comment } = require('../db');

const createComment = async (commentInfo) => {
  const newComment = await Comment.create(commentInfo);
  return newComment;
};

const findComment = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  return comment;
};

const updateComment = async (updateInfo) => {
  const reuslt = await Comment.update(
    { comment: updateInfo.comment },
    { where: { id: updateInfo.commentId } }
  );
  return reuslt;
};

const destroyComment = async (commentId) => {
  const result = await Comment.destroy({ where: { id: commentId } });
  return result;
};

module.exports = {
  createComment,
  findComment,
  updateComment,
  destroyComment,
};
