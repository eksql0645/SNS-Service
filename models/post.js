const { Post, Tag } = require('../db');
const { Op, Sequelize } = require('sequelize');

const createPost = async (postInfo) => {
  const post = await Post.create(postInfo);
  return post;
};

const findPosts = async (offset, limit, query) => {
  const posts = await Post.findAll({
    limit: limit,
    offset: offset,
    include: [
      {
        model: Tag,
        attributes: ['id', 'tag'],
        as: 'tag',
        where: { tag: { [Op.in]: query.tag } },
        through: {
          attributes: [],
        },
      },
    ],
    having: Sequelize.literal(`COUNT(DISTINCT tag.tag) = ${query.tag.length}`),
    group: ['id'],
    subQuery: false,
    attributes: [
      'id',
      'title',
      'content',
      'writer',
      'image',
      'weather',
      'like',
      'hits',
      'postUserId',
      'createdAt',
    ],
    order: query.ordering,
    where: query.seaching,
  });
  return posts;
};

const findPost = async (id) => {
  const post = await Post.findOne({ where: { id } });
  return post;
};

module.exports = { createPost, findPosts, findPost };
