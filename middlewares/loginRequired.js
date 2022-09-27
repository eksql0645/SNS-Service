const errorCodes = require('../utils/errorCodes');
const { accessTokenVerify } = require('../utils/token');
const checkExpiredTime = require('../utils/expiredTime');

async function loginRequired(req, res, next) {
  //req.headers['authorization']가 있다면 토큰을 할당
  const userToken = req.headers['authorization']?.split(' ')[1];

  // 토큰이 undefinded이거나 null일 경우
  if (!userToken || userToken === 'null') {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    res.status(403).json(errorCodes.forbiddenApproach);
    return;
  }

  // 정상적인 token인지 확인
  try {
    const result = accessTokenVerify(userToken);
    console.log(result);

    // 만료 확인
    const gap = checkExpiredTime(result);
    const expiredTime = 60;

    // 만료된 경우
    if (gap > expiredTime) {
      throw new Error(errorCodes.tokenExpiredError);
    }

    // req.currentUserId를 통해 유저의 id에 접근 가능하게 됨
    req.currentUserId = result.userId;

    next();
  } catch (err) {
    next(err);
  }
}
module.exports = { loginRequired };
