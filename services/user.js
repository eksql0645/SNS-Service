/**
 * @author JKS <eksql0645@gamil.com>
 */

const userModel = require('../models/user');
const errorCodes = require('../utils/errorCodes');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

/**
 * 회원가입
 *@function addUser
 * @param {Object} userInfo user 생성 시 필요한 정보
 * @param {String} userInfo.email 이메일
 * @param {String} userInfo.password 비밀번호
 * @param {String} userInfo.nick 닉네임
 * @returns {Object} 생성된 user 객체
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

  console.log(userInfo);

  user = await userModel.createUser(userInfo);

  return user;
};

module.exports = { addUser };
