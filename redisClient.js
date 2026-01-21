require("dotenv").config();
const Redis = require("ioredis");

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = Number(process.env.REDIS_PORT || 6379);
const url = process.env.REDIS_URL || `redis://${host}:${port}`;

const redis = new Redis(url);

redis.on("connect", () => console.log(`[redis] connected -> ${url}`));
redis.on("error", (err) => console.error("[redis] error:", err.message));

module.exports = redis;
