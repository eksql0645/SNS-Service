const { User, Post, Comment } = require('../db');

const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

const findUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    include: [{ model: Post }, { model: Comment }],
  });
  return user;
};

const createUser = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

const updateUser = async (userInfo) => {
  const { email, nick, password, userId } = userInfo;
  const user = await User.update(
    { email, password, nick },
    { where: { id: userId } }
  );
  return user;
};

const destroyUser = async (userId) => {
  const result = await User.destroy({
    where: { id: userId },
  });
  return result;
};

const updateUserPassword = async (updateInfo) => {
  const { email, password } = updateInfo;
  const user = await User.update({ password }, { where: { email } });
  return user;
};

module.exports = {
  createUser,
  updateUser,
  destroyUser,
  updateUserPassword,
  findUserByEmail,
  findUserById,
};
