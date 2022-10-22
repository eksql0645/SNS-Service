const { userModel } = require('../models');
const nodemailer = require('../utils/nodemailer');
const errorCodes = require('../utils/errorCodes');

const sendAuthMail = async (redis, email) => {
  // 이메일로 중복 회원 확인
  let user = await userModel.findUserByEmail(email);
  if (user) {
    throw new Error(errorCodes.alreadySignUpEmail);
  }

  // 인증번호 6자리 생성
  const authNumber = Math.floor(100000 + Math.random() * 900000);

  // authNumber:email key에 authNumber를 value로 넣는다.
  await redis.set(`authNumber: ${email}`, authNumber);

  // Redis에 저장되었는지 확인
  const existedAuthNumber = await redis.set(`authNumber: ${email}`, authNumber);
  if (!existedAuthNumber) {
    throw new Error(errorCodes.failedSaveAuthNumber);
  }

  // 인증번호 30분 캐싱
  await redis.expire(`authNumber: ${email}`, 1800);

  const data = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'SNS 서비스를 인증해주세요.',
    html: `인증번호 [${authNumber}]를 입력하세요.`,
  };

  const result = await nodemailer.send(data);

  return result;
};

const checkAuthNumber = async (redis, email, authNumber) => {
  // 인증번호 가져오기
  const existedAuthNumber = await redis.get(`authNumber: ${email}`);

  // 저장된 인증번호가 없다면 시간 초과되어 삭제된 것.
  if (!existedAuthNumber) {
    throw new Error(errorCodes.timeOver);
  }

  // 인증번호가 있다면 일치 여부 확인
  if (existedAuthNumber !== authNumber) {
    throw new Error(errorCodes.failedAuth);
  }

  // 해당 이메일과 인증완료 상태 저장 (인증완료: 1)
  await redis.HSET('authComplete', email, 1);

  const result = await redis.HGET('authComplete', email);

  if (!result) {
    throw new Error(errorCodes.failedSaveAuthStatus);
  }

  // Redis에 저장된 인증번호 삭제
  await redis.del(`authNumber: ${email}`);

  return result;
};

module.exports = { sendAuthMail, checkAuthNumber };
