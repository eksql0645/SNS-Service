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

module.exports = { sendAuthMail };
