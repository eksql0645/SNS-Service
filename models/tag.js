const { Tag } = require('../db');

const createTag = async (tagList) => {
  await Promise.all(
    tagList.map(async (tag) => {
      return await Tag.create(tag);
    })
  );
  return;
};

const findTag = async (tag) => {
  const result = await Tag.findOne({ where: { tag } });

  return result;
};

module.exports = { createTag, findTag };
