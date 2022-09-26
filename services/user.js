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
  let user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }

  // 비밀번호 일치 확인
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new Error(errorCodes.notCorrectPassword);
  }

  // 토큰 생성
  const accessToken = createToken.accessToken(user);
  const refreshToken = createToken.refreshToken();

  // refreshToken Redis에 캐싱
  await redis.HSET('refreshToken', user.id, refreshToken);

  const token = {
    accessToken,
    refreshToken,
  };

  return token;
};

module.exports = { addUser, getToken };
