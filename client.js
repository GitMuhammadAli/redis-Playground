// client.js
const Redis = require("ioredis");

const client = new Redis({
  host: "127.0.0.1",
  port: 6380, // Redis Stack server exposed port
  // password: "..." // only if you set one
});

module.exports = client;
