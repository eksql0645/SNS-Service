const moment = require('moment');

module.exports = function checkExpiredTime(result) {
  const issuedTime = moment(result.exp);
  const currentTime = moment();
  const gap = currentTime.diff(issuedTime, 'minutes');
  return gap;
};
