const { userModel } = require('../models');
const errorCodes = require('../utils/errorCodes');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const createToken = require('../utils/token');
const nodemailer = require('../utils/nodemailer');

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
const addUser = async (redis, userInfo) => {
  const { email, password } = userInfo;

  /**  복구 기능 미완성으로 주석처리
  // 기존에 가입한 이력이 있는지 확인
  const deletedUser = await redis.json.get(`deletedUser: ${email}`);
  if (deletedUser) {
    throw new Error(errorCodes.FindDeletedUser);
  }
  */

  // 임시 인증 상태 확인
  const isAuthCompleted = await redis
    .multi()
    .get(`tempAuthStatus: ${email}`)
    .exec();

  if (!isAuthCompleted[0]) {
    throw new Error(errorCodes.unAuthUser);
  }

  // 비밀번호 해쉬화
  const hashedPassword = await bcrypt.hash(password, 10);
  userInfo.password = hashedPassword;
  userInfo.id = nanoid();

  // 유저 생성
  const user = await userModel.createUser(userInfo);

  // 인증 완료 상태 저장
  await redis
    .multi()
    .HSET('authComplete', email, 1)
    .del(`tempAuthStatus: ${email}`)
    .exec();

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

  // 인증된 회원인지 확인
  let user = await redis.HGET('authComplete', email);
  if (!user) {
    throw new Error(errorCodes.unAuthUser);
  }

  // 이메일로 회원 확인
  user = await userModel.findUserByEmail(email);
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
const setUser = async (redis, updateInfo) => {
  const { email, currentPassword, password, userId } = updateInfo;

  // 회원 확인
  let user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error(errorCodes.canNotFindUser);
  }

  // 기존 이메일
  const preEmail = user.email;

  // 새 이메일 인증상태 확인
  if (email) {
    const isAuthCompleted = await redis
      .multi()
      .get(`tempAuthStatus: ${email}`)
      .exec();

    if (!isAuthCompleted[0]) {
      throw new Error(errorCodes.unAuthUser);
    }
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

  if (email) {
    await redis
      .multi()
      .HDEL('authComplete', preEmail) // 기존 이메일 상태 데이터 삭제
      .HSET('authComplete', email, 1) // 새 이메일 인증 완료 상태 저장
      .del(`tempAuthStatus: ${email}`) // 임시 데이터 삭제
      .exec();
  }

  return { message: '수정되었습니다.' };
};

/**
 * 회원 탈퇴
 * @author JKS <eksql0645@gmail.com>
 * @function deleteUser
 * @param {String} userId user id
 * @param {String} currentPassword 현재 password
 * @returns {Object} 탈퇴 확인 메세지
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

  const isdeleted = await userModel.destroyUser(userId);

  if (!isdeleted) {
    throw new Error(errorCodes.serverError);
  }

  let result = await redis
    .multi()
    .HDEL('authComplete', user.email) // 레디스에 저장된 인증정보 삭제
    .HDEL('refreshToken', user.id) // refreshToken 삭제
    .set(`deletedUser: ${user.email}`, user) // 탈퇴 유저 레디스에 저장
    .expire(`deletedUser: ${user.email}`, 1296000) // 30일 경과하면 삭제
    .exec();

  result = { message: '탈퇴되었습니다.' };

  return result;
};

// 임시 비밀번호 전송
const sendTempPasswordMail = async (redis, email) => {
  // 인증된 이메일로 중복 회원 확인
  const exsitedEmail = await redis.HGET('authComplete', email);
  if (exsitedEmail) {
    throw new Error(errorCodes.alreadySignUpEmail);
  }

  // 임시 비밀번호 생성
  const tempPass = Math.random().toString(36).slice(2);

  const data = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'SNS 서비스에서 임시비밀번호를 알려드립니다.',
    html: `<h1>SNS 서비스에서 새로운 비밀번호를 알려드립니다.</h1> 
    <h2> 임시 비밀번호: ${tempPass} </h2>
    <h3>임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>
    `,
  };

  // 비밀번호 암호화
  const hashedTempPassword = await bcrypt.hash(tempPass, 10);

  // 해당 이메일 유저의 비밀번호 수정
  const updateInfo = { email, password: hashedTempPassword };

  let result = await userModel.updateUserPassword(updateInfo);

  if (!result[0]) {
    throw new Error(errorCodes.notUpdate);
  }

  // 임시 비밀번호 발급 메일 전송
  result = await nodemailer.send(data);

  return result;
};

/** 
// 탈퇴 회원 확인
const checkDeletedUser = async (redis, email) => {
  const deletedUser = await redis.json.get(`deletedUser: ${email}`);
  if (!deletedUser) {
    throw new Error(errorCodes.canNotFindDeletedUser);
  }
  return { message: `${deletedUser.email}은 복구 가능한 계정입니다.` };
};


// 회원 복구
const reCreateUser = async (redis, email, password) => {
  // 탈퇴 회원 데이터 가져오기
  const deletedUser = await redis.json.get(`deletedUser: ${email}`);
  if (!deletedUser) {
    throw new Error(errorCodes.canNotFindDeletedUser);
  }

  // 비밀번호 일치 확인
  const isMatched = await bcrypt.compare(password, deletedUser.password);
  if (!isMatched) {
    throw new Error(errorCodes.notCorrectPassword);
  }

  // 인증 데이터 및 기존 데이터 다시 생성
  const restoredUser = await userModel.createUser(deletedUser);

  restoredUser.password = null;

  return deletedUser;
};
*/
module.exports = {
  addUser,
  getToken,
  getUser,
  setUser,
  deleteUser,
  sendTempPasswordMail,
  // checkDeletedUser,
  // reCreateUser,
};
