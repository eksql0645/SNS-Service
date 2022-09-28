const { Tag } = require('../db');

const createTag = async (tag) => {
  const newTag = await Tag.create(tag);
  return newTag;
};

const findTag = async (tag) => {
  const result = await Tag.findOne({ where: { tag } });

  return result;
};

module.exports = { createTag, findTag };
