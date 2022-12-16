const { postModel, commentModel } = require('../models');
const errorCodes = require('../utils/errorCodes');

/**
 * 댓글 생성
 * @author JKS <eksql0645@gmail.com>
 * @function addComment
 * @param {Object} commentInfo comment 생성 시 필요한 정보
 * @param {String} commentInfo.postId 게시글 id
 * @param {String} commentInfo.comment 댓글 내용
 * @returns {Object} 생성된 comment 객체
 */
const addComment = async (commentInfo) => {
  const { postId } = commentInfo;
  const post = await postModel.findPost(postId);

  if (!post) {
    throw new Error(errorCodes.canNotFindPost);
  }

  // 해당 게시글에 대한 댓글 확인
  const commentInPost = await post.getComments({ raw: true });

  // 댓글이 없다면 group은 1, 있다면 마지막 댓글 group+1
  if (commentInPost.length === 0) {
    commentInfo.group = 1;
  } else {
    commentInfo.group = commentInPost[commentInPost.length - 1].group + 1;
  }

  const newComment = await commentModel.createComment(commentInfo);

  return newComment;
};

/**
 * 대댓글 생성
 * @author JKS <eksql0645@gmail.com>
 * @function addReply
 * @param {Object} replyInfo reply 생성 시 필요한 정보
 * @param {String} replyInfo.postId 게시글 id
 * @param {String} replyInfo.commentId 댓글 id
 * @param {String} replyInfo.comment 대댓글 내용
 * @returns {Object} 생성된 reply 객체
 */
const addReply = async (replyInfo) => {
  const { postId, commentId } = replyInfo;

  const post = await postModel.findPost(postId);

  if (!post) {
    throw new Error(errorCodes.canNotFindPost);
  }
  if (post.id !== postId) {
    throw new Error(errorCodes.notMatchedPost);
  }

  const parentComment = await commentModel.findComment(commentId);

  if (!parentComment) {
    throw new Error(errorCodes.canNotFindComment);
  }

  replyInfo.group = parentComment.group;
  replyInfo.parentId = commentId;
  console.log(replyInfo);
  const reply = await commentModel.createComment(replyInfo);

  return reply;
};
const getComments = async () => {};
const setComment = async () => {};
const deleteComment = async () => {};

module.exports = {
  addComment,
  addReply,
  getComments,
  setComment,
  deleteComment,
};
