const client = require("./client");

async function init() {
  console.log("DBSIZE (before):", await client.dbsize());

  // -------------------------
  // 0) Your current practice keys
  // -------------------------
  await client.set("bike:1", "Trek Domane SL 7");
  await client.hset("bike:2", "brand", "Specialized", "model", "Roubaix");
  await client.del("bike:3");
  await client.lpush("bike:3", "Giant Defy", "Cannondale Synapse");

  const v1 = await client.get("bike:1");
  const v2 = await client.hgetall("bike:2");
  const v3 = await client.lrange("bike:3", 0, -1);

  console.log("\n--- Bikes ---");
  console.log("bike:1 (string) =>", v1);
  console.log("bike:2 (hash)   =>", v2);
  console.log("bike:3 (list)   =>", v3);

  // -------------------------
  // 1) Queue (FIFO): RPUSH + LPOP
  // Keys: q:jobs
  // -------------------------
  await client.del("q:jobs");

  // Enqueue jobs (producer)
  await client.rpush("q:jobs", "job1", "job2", "job3");

  // Dequeue jobs (worker)
  const jobA = await client.lpop("q:jobs");
  const jobB = await client.lpop("q:jobs");
  const remainingJobs = await client.lrange("q:jobs", 0, -1);

  console.log("\n--- Queue (q:jobs) ---");
  console.log("dequeued =>", jobA);
  console.log("dequeued =>", jobB);
  console.log("remaining queue =>", remainingJobs);

  // -------------------------
  // 2) Feed: LPUSH + LTRIM + LRANGE
  // Keys: feed:activity
  // Keep last 5 for demo (you can change to 20)
  // -------------------------
  await client.del("feed:activity");

  const addEvent = async (event) => {
    await client.lpush("feed:activity", event);
    await client.ltrim("feed:activity", 0, 4); // keep last 5
  };

  await addEvent("login:ali");
  await addEvent("viewed:bike:1");
  await addEvent("add_to_cart:bike:2");
  await addEvent("logout:ali");
  await addEvent("login:ali");
  await addEvent("viewed:bike:3"); // this will push out the oldest (because we keep 5)

  const feed = await client.lrange("feed:activity", 0, -1);

  console.log("\n--- Feed (feed:activity) ---");
  console.log("latest first =>", feed);

  // -------------------------
  // 3) Leaderboard: ZINCRBY + ZREVRANGE
  // Keys: lb:points
  // -------------------------
  await client.del("lb:points");

  await client.zincrby("lb:points", 10, "ali");
  await client.zincrby("lb:points", 5, "usama");
  await client.zincrby("lb:points", 20, "ali");
  await client.zincrby("lb:points", 7, "sara");

  // Top N with scores
  const top = await client.zrevrange("lb:points", 0, 9, "WITHSCORES");
  const aliRank = await client.zrevrank("lb:points", "ali");
  const aliScore = await client.zscore("lb:points", "ali");

  console.log("\n--- Leaderboard (lb:points) ---");
  console.log("top (member,score,...) =>", top);
  console.log("ali rank (0=top) =>", aliRank);
  console.log("ali score =>", aliScore);

  console.log("\nDBSIZE (after):", await client.dbsize());

  await client.quit(); // clean shutdown
}

init().catch(async (err) => {
  console.error(err);
  try {
    await client.quit();
  } catch {}
});
