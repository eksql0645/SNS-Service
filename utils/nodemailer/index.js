const nodemailer = require('nodemailer');
const errorCodes = require('../errorCodes');
// const moment = require('moment');

const send = async (data) => {
  // const zero = moment();
  const transport = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // const start = moment();

  // 메일 정상 접속 확인
  const verify = await transport.verify();
  if (!verify) {
    throw new Error(errorCodes.notGetReadyMailServer);
  }
  console.log('메일 서버에서 메세지를 받을 준비가 되었습니다.');
  // const server = moment();

  // 이메일 전송
  const sendMail = await transport.sendMail(data);
  if (!sendMail) {
    throw new Error(errorCodes.failedSendEmail);
  }
  // const complete = moment();

  // console.log('start - zero', start.diff(zero));
  // console.log('complete - server', complete.diff(server));
  // console.log('server - start', server.diff(start));
  // console.log('complete - start', complete.diff(start));
  return sendMail.response;
};
module.exports = { send };
