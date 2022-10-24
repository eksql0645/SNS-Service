const { Tag } = require('../db');

const findOrCreateTag = async (tag) => {
  const result = await Tag.findOrCreate({
    where: { tag },
  });
  return result;
};

module.exports = { findOrCreateTag };
