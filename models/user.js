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

module.exports = { createUser, findUserByEmail, findUserById };
