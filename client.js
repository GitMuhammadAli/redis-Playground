const redis = require("./redisClient");

(async () => {
  const pong = await redis.ping();
  console.log("PING:", pong);

  await redis.quit();
})();
