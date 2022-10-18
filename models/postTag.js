const db = require('../db');
const PostTag = db.sequelize.models.PostTag;

const createPostTag = async (tagId, postId) => {
  return await PostTag.create({ postId, tagId });
};

module.exports = { createPostTag };
