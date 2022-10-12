const { Post, Tag } = require('../db');

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
        where: query.tagWhere,
        through: {
          attributes: [],
        },
      },
    ],
    having: query.tagHaving,
    group: query.tagGroup,
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
  const post = await Post.findOne({
    where: { id },
  });

  return post;
};

const updatePost = async (id, title, content) => {
  const result = await Post.update({ title, content }, { where: { id } });
  return result;
};

const destroyPost = async (id) => {
  const result = await Post.destroy({ where: { id } });
  return result;
};

const getWriter = async (post) => {
  const writer = await post.getUser({ raw: true });

  return writer;
};

const incrementValue = async (id, value) => {
  const post = await Post.increment(value, { where: { id } });
  return post;
};

const decrementValue = async (id) => {
  const post = await Post.increment({ like: -1 }, { where: { id } });
  return post;
};

const createLiker = async (id, userId, redis) => {
  const postResult = await redis.SADD(`liker: post${id}`, userId);
  const userResult = await redis.SADD(`liker: user${id}`, userId);
  const result = [postResult, userResult];
  return result;
};

const deleteLiker = async (id, userId, redis) => {
  const postResult = await redis.SREM(`liker: post${id}`, userId);
  const userResult = await redis.SREM(`liker: user${id}`, userId);
  const result = [postResult, userResult];
  return result;
};

module.exports = {
  createPost,
  findPosts,
  findPost,
  updatePost,
  destroyPost,
  getWriter,
  incrementValue,
  decrementValue,
  createLiker,
  deleteLiker,
};
