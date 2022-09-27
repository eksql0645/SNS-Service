const userModel = require('../models/user');
const errorCodes = require('../utils/errorCodes');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const createToken = require('../utils/token');

/**
 * 회원가입
 * @author JKS <eksql0645@gmail.com>
 * @function addUser
 * @param {Object} userInfo user 생성 시 필요한 정보
 * @param {String} userInfo.email 이메일
 * @param {String} userInfo.password 비밀번호
 * @param {String} userInfo.nick 닉네임
 * @returns {Object} 생성된 user 객체에서 비밀번호를 제외한 정보
 */
const addUser = async (userInfo) => {
  const { email, password } = userInfo;

  // 이메일로 중복 회원 확인
  let user = await userModel.findUserByEmail(email);
  if (user) {
    throw new Error(errorCodes.alreadySignUpEmail);
  }

  // 비밀번호 해쉬화
  const hashedPassword = await bcrypt.hash(password, 10);
  userInfo.password = hashedPassword;
  userInfo.id = nanoid();

  user = await userModel.createUser(userInfo);

  user.password = null;

  return user;
};

/**
 * 로그인
 * @author JKS <eksql0645@gmail.com>
 * @function getToken
 * @param {Object} userInfo 로그인 정보
 * @param {String} userInfo.email 이메일
 * @param {String} userInfo.password 비밀번호
 * @returns {Object} 로그인 시 생성되는 token
 */
const getToken = async (userInfo, redis) => {
  const { email, password } = userInfo;

  // 이메일로 회원 확인
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }

  // 비밀번호 일치 확인
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new Error(errorCodes.notCorrectPassword);
  }

  const userId = user.id;
  // 토큰 생성
  const accessToken = createToken.accessToken(userId);
  const refreshToken = createToken.refreshToken();

  // refreshToken Redis에 캐싱
  await redis.HSET('refreshToken', user.id, refreshToken);

  const token = {
    accessToken,
    refreshToken,
  };

  return token;
};

/**
 * 회원 조회
 * @author JKS <eksql0645@gmail.com>
 * @function getUser
 * @param {String} userId user id
 * @returns {Object} user id에 해당하는 유저 객체
 */
const getUser = async (userId) => {
  // 회원 확인
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }
  user.password = null;
  return user;
};

/**
 * 회원 수정
 * @author JKS <eksql0645@gmail.com>
 * @function setUser
 * @param {Object} updateInfo 업데이트 정보
 * @param {String} email 수정할 email
 * @param {String} nick 수정할 닉네임
 * @param {String} password 수정할 password
 * @param {String} currentPassword 현재 password
 * @param {String} userId user id
 * @returns {Object} 수정된 user 객체
 */
const setUser = async (updateInfo) => {
  const { currentPassword, password, userId } = updateInfo;

  // 회원 확인
  let user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }

  // 현재 비밀번호 일치 확인
  const hashedPassword = user.password;
  const isMatched = await bcrypt.compare(currentPassword, hashedPassword);
  if (!isMatched) {
    throw new Error(errorCodes.notCorrectPassword);
  }

  // 비밀번호 수정하는 경우 해쉬화
  if (password) {
    const newHashedPassword = await bcrypt.hash(password, 10);
    updateInfo.password = newHashedPassword;
  }

  const isUpdated = await userModel.updateUser(updateInfo);

  if (!isUpdated) {
    throw new Error(errorCodes.serverError);
  }
  if (!isUpdated[0]) {
    throw new Error(errorCodes.notUpdate);
  }

  user = await userModel.findUserById(userId);
  user.password = null;
  return user;
};

/**
 * 회원 삭제
 * @author JKS <eksql0645@gmail.com>
 * @function deleteUser
 * @param {String} userId user id
 * @param {String} currentPassword 현재 password
 * @returns {Object} 삭제 확인 메세지
 */
const deleteUser = async (userId, redis, currentPassword) => {
  // 회원 확인
  let user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }

  // 현재 비밀번호 일치 확인
  const hashedPassword = user.password;
  const isMatched = await bcrypt.compare(currentPassword, hashedPassword);
  if (!isMatched) {
    throw new Error(errorCodes.notCorrectPassword);
  }

  // 삭제 유저 레디스에 저장
  await redis.json.set(`deletedUser: ${user.id}`, '$', user.dataValues);

  // 30일 경과하면 삭제
  await redis.expire(`deletedUser: ${user.id}`, 1296000);

  const isdeleted = await userModel.destroyUser(userId);

  if (!isdeleted) {
    throw new Error(errorCodes.serverError);
  }

  const result = { message: '탈퇴되었습니다.' };

  return result;
};

module.exports = { addUser, getToken, getUser, setUser, deleteUser };
