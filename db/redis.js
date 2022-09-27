const Redis = require('redis');

module.exports = async (req, res, next) => {
  // 이미 req.app에 redisClient가 있다면 연결 설정 넘기기
  if (req.app.get('redis')) {
    return next();
  }

  const redisClient = Redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  });

  // 연결되면 req.app에 redisClient 담기
  redisClient.on('connect', () => {
    console.log('Redis connected!');
    req.app.set('redis', redisClient);
    next();
  });

  // 에러가 나면 req.app에 담긴 redisClient 제거
  redisClient.on('error', (err) => {
    console.error('Redis Client Error');
    req.app.set('redis', null);
    next(err);
  });

  await redisClient.connect();
};
