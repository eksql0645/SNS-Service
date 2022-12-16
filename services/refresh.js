const errorCodes = require('../utils/errorCodes');
const {
  accessToken,
  refreshTokenVerify,
  accessTokenVerify,
} = require('../utils/token');
const checkExpiredTime = require('../utils/expiredTime');

/**
 * 만료 토큰 확인 후 재발급하는 함수
 * @author JKS <eksql0645@gmail.com>
 * @function checkExpiredToken
 * @param {String} userToken 클라이언트의 accessToken
 * @param {String} refreshToken 클라이언트의 refreshToken
 * @param redis refreshToken이 캐싱된 redis
 * @returns {Object} 재발급한 accessToken과 기존 refreshToken
 */
async function checkExpiredToken(userToken, refreshToken, redis) {
  // token 만료 확인
  const accessTokenResult = accessTokenVerify(userToken);
  const accessGap = checkExpiredTime(accessTokenResult);
  const accessExpiredTime = 60;

  const refreshTokenresult = await refreshTokenVerify(
    redis,
    refreshToken,
    accessTokenResult.userId
  );
  const refreshGap = checkExpiredTime(refreshTokenresult);
  const refreshExpriedTime = 10080;

  if (accessGap > accessExpiredTime) {
    // accessToken 만료 && refresh token 만료된 경우 재로그인
    if (refreshGap > refreshExpriedTime) {
      throw new Error(errorCodes.requiredReLogin);
    }
    // accessToken만 만료된 경우, accessToken 재발급 후 프론트로 응답
    const newAccessToken = accessToken(accessTokenResult.userId);
    const tokens = {
      accessToken: newAccessToken,
      refreshToken,
    };

    return tokens;
  }
  throw new Error(errorCodes.availableToken);
}

module.exports = { checkExpiredToken };
