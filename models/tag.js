const { Tag } = require('../db');

const findOrCreateTag = async (tag, userId) => {
  const result = await Tag.findOrCreate({
    where: { tag },
    defaults: { tagUserId: userId },
  });
  return result;
};

module.exports = { findOrCreateTag };
