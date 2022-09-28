const { Post } = require('../db');

const createPost = async (postInfo) => {
  const post = await Post.create(postInfo);
  return post;
};
module.exports = { createPost };
