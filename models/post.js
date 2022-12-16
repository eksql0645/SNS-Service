const { Post, Tag } = require('../db');

const createPost = async (postInfo) => {
  const post = await Post.create(postInfo);
  return post;
};

const findPosts = async (limit, offset, query) => {
  const posts = await Post.findAll({
    limit: limit,
    offset: offset,
    include: [
      {
        model: Tag,
        attributes: ['id', 'tag'],
        where: query.tagWhere,
        through: {
          attributes: [],
        },
      },
    ],

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
    having: query.tagHaving,
    group: query.group,
    subQuery: false,
    order: query.ordering,
    where: query.seaching || null,
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

const findWriter = async (post) => {
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

const findLiker = async (id, userId, redis) => {
  const liker = await redis.SISMEMBER(`liker: post${id}`, userId);
  return liker;
};

const findLikers = async (id, redis) => {
  const likers = await redis.SMEMBERS(`liker: post${id}`);
  return likers;
};

const createLiker = async (id, userId, redis) => {
  const result = await redis.SADD(`liker: post${id}`, userId);
  return result;
};

const deleteLiker = async (id, userId, redis) => {
  const result = await redis.SREM(`liker: post${id}`, userId);
  return result;
};

module.exports = {
  createPost,
  findPosts,
  findPost,
  updatePost,
  destroyPost,
  findWriter,
  incrementValue,
  decrementValue,
  findLikers,
  findLiker,
  createLiker,
  deleteLiker,
};
