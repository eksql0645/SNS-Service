const User = require('../db/models/user');

const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

const findUserById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
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

module.exports = { createUser, updateUser, findUserByEmail, findUserById };
