/**
 * Redis Practice - Comprehensive Data Structures & Queue Patterns
 * Uses: ioredis client on port 6380 (Redis Stack)
 * 
 * Covers:
 * 1. Strings (GET, SET, INCR, DECR, MSET, MGET)
 * 2. Hashes (HSET, HGET, HGETALL, HINCRBY, HDEL)
 * 3. Lists/Queues (LPUSH, RPUSH, LPOP, RPOP, LRANGE, LTRIM, LLEN)
 * 4. Sets (SADD, SMEMBERS, SISMEMBER, SINTER, SUNION)
 * 5. Sorted Sets (ZADD, ZINCRBY, ZRANGE, ZREVRANGE, ZRANK)
 * 6. Queue Patterns (FIFO, LIFO, Capped Lists)
 */

const client = require("./client");

async function init() {
  // =========================================================================
  // CONNECTION INFO
  // =========================================================================
  console.log("=".repeat(60));
  console.log("REDIS CONNECTION INFO");
  console.log("=".repeat(60));
  console.log("CONNECTED:", {
    host: client.options.host,
    port: client.options.port,
    db: client.options.db || 0,
  });
  console.log("DBSIZE (before):", await client.dbsize());

  // =========================================================================
  // 1. STRINGS - Basic key-value operations
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("1. STRINGS");
  console.log("=".repeat(60));

  // SET & GET
  await client.set("user:1:name", "Usama");
  await client.set("user:1:email", "usama@example.com");
  console.log("SET user:1:name => Usama");
  console.log("GET user:1:name =>", await client.get("user:1:name"));
  console.log("TYPE user:1:name =>", await client.type("user:1:name"));

  // SET with expiration (EX = seconds)
  await client.set("session:abc123", "user:1", "EX", 3600);
  console.log("\nSET session:abc123 with 1hr TTL");
  console.log("TTL session:abc123 =>", await client.ttl("session:abc123"), "seconds");

  // SETNX - Set only if Not eXists
  const setNxResult = await client.setnx("user:1:name", "NewName");
  console.log("SETNX user:1:name (already exists) =>", setNxResult); // 0 = not set

  // MSET & MGET - Multiple keys at once
  await client.mset("counter:visits", "0", "counter:clicks", "0", "counter:signups", "0");
  const counters = await client.mget("counter:visits", "counter:clicks", "counter:signups");
  console.log("\nMGET counters =>", counters);

  // INCR, DECR, INCRBY, DECRBY
  await client.incr("counter:visits");
  await client.incr("counter:visits");
  await client.incrby("counter:clicks", 5);
  await client.decrby("counter:clicks", 2);
  console.log("After INCR/INCRBY:");
  console.log("  counter:visits =>", await client.get("counter:visits"));
  console.log("  counter:clicks =>", await client.get("counter:clicks"));

  // APPEND
  await client.set("greeting", "Hello");
  await client.append("greeting", " World!");
  console.log("APPEND greeting =>", await client.get("greeting"));

  // =========================================================================
  // 2. HASHES - Field-value pairs under a single key
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("2. HASHES");
  console.log("=".repeat(60));

  // HSET - Set hash fields (ioredis supports object syntax)
  await client.hset("product:1001", {
    name: "MacBook Pro",
    price: "2499",
    stock: "50",
    category: "electronics"
  });
  console.log("HSET product:1001 => MacBook Pro");
  console.log("TYPE product:1001 =>", await client.type("product:1001"));

  // HGET - Get single field
  console.log("HGET product:1001 name =>", await client.hget("product:1001", "name"));

  // HGETALL - Get all fields
  console.log("HGETALL product:1001 =>", await client.hgetall("product:1001"));

  // HMGET - Get multiple fields
  const productInfo = await client.hmget("product:1001", "name", "price");
  console.log("HMGET [name, price] =>", productInfo);

  // HINCRBY - Increment numeric field
  await client.hincrby("product:1001", "stock", -5);
  console.log("HINCRBY stock -5 =>", await client.hget("product:1001", "stock"));

  // HINCRBYFLOAT
  await client.hincrbyfloat("product:1001", "price", 100.50);
  console.log("HINCRBYFLOAT price +100.50 =>", await client.hget("product:1001", "price"));

  // HEXISTS
  console.log("HEXISTS product:1001 name =>", await client.hexists("product:1001", "name"));
  console.log("HEXISTS product:1001 color =>", await client.hexists("product:1001", "color"));

  // HKEYS & HVALS
  console.log("HKEYS product:1001 =>", await client.hkeys("product:1001"));
  console.log("HVALS product:1001 =>", await client.hvals("product:1001"));

  // HDEL - Delete field
  await client.hdel("product:1001", "category");
  console.log("After HDEL category:", await client.hgetall("product:1001"));

  // =========================================================================
  // 3. LISTS - Ordered collections (queues/stacks)
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("3. LISTS");
  console.log("=".repeat(60));

  await client.del("tasks");

  // LPUSH - Push to left (head)
  await client.lpush("tasks", "task3", "task2", "task1");
  console.log("LPUSH tasks [task3, task2, task1]");
  console.log("TYPE tasks =>", await client.type("tasks"));
  console.log("LRANGE tasks 0 -1 =>", await client.lrange("tasks", 0, -1));

  // RPUSH - Push to right (tail)
  await client.rpush("tasks", "task4", "task5");
  console.log("RPUSH tasks [task4, task5]");
  console.log("LRANGE tasks 0 -1 =>", await client.lrange("tasks", 0, -1));

  // LLEN - List length
  console.log("LLEN tasks =>", await client.llen("tasks"));

  // LINDEX - Get element at index
  console.log("LINDEX tasks 0 =>", await client.lindex("tasks", 0));
  console.log("LINDEX tasks -1 =>", await client.lindex("tasks", -1));

  // LPOP & RPOP
  const lpopVal = await client.lpop("tasks");
  console.log("LPOP tasks =>", lpopVal);
  const rpopVal = await client.rpop("tasks");
  console.log("RPOP tasks =>", rpopVal);
  console.log("After LPOP & RPOP:", await client.lrange("tasks", 0, -1));

  // LSET - Set element at index
  await client.lset("tasks", 0, "task2-updated");
  console.log("LSET tasks 0 =>", await client.lrange("tasks", 0, -1));

  // LINSERT - Insert before/after
  await client.linsert("tasks", "BEFORE", "task3", "task2.5");
  console.log("LINSERT BEFORE task3:", await client.lrange("tasks", 0, -1));

  // LREM - Remove elements by value
  await client.lpush("tasks", "task3", "task3");
  console.log("Before LREM:", await client.lrange("tasks", 0, -1));
  await client.lrem("tasks", 2, "task3");
  console.log("LREM 2 'task3':", await client.lrange("tasks", 0, -1));

  // =========================================================================
  // 4. QUEUE PATTERNS
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("4. QUEUE PATTERNS");
  console.log("=".repeat(60));

  // --- PATTERN A: FIFO Queue (First In, First Out) ---
  console.log("\n--- FIFO Queue (RPUSH + LPOP) ---");
  await client.del("queue:jobs");

  await client.rpush("queue:jobs", "job:email:1", "job:email:2", "job:email:3");
  console.log("TYPE queue:jobs =>", await client.type("queue:jobs"));
  console.log("Queue after RPUSH:", await client.lrange("queue:jobs", 0, -1));

  let job;
  job = await client.lpop("queue:jobs");
  console.log("Processing:", job);
  job = await client.lpop("queue:jobs");
  console.log("Processing:", job);
  console.log("Remaining:", await client.lrange("queue:jobs", 0, -1));

  // --- PATTERN B: LIFO Stack (Last In, First Out) ---
  console.log("\n--- LIFO Stack (LPUSH + LPOP) ---");
  await client.del("stack:undo");

  await client.lpush("stack:undo", "action:delete");
  await client.lpush("stack:undo", "action:edit");
  await client.lpush("stack:undo", "action:create");
  console.log("Stack:", await client.lrange("stack:undo", 0, -1));

  const undoAction = await client.lpop("stack:undo");
  console.log("Undo:", undoAction);
  console.log("Remaining stack:", await client.lrange("stack:undo", 0, -1));

  // --- PATTERN C: Capped List / Activity Feed ---
  console.log("\n--- Capped List / Activity Feed (LPUSH + LTRIM) ---");
  await client.del("feed:user:1");

  const addActivity = async (activity) => {
    await client.lpush("feed:user:1", activity);
    await client.ltrim("feed:user:1", 0, 4); // Keep only last 5
  };

  await addActivity("Logged in");
  await addActivity("Viewed product:1001");
  await addActivity("Added to cart");
  await addActivity("Checked out");
  await addActivity("Payment processed");
  await addActivity("Order confirmed");
  await addActivity("Shipping started");

  console.log("TYPE feed:user:1 =>", await client.type("feed:user:1"));
  console.log("Latest 5 activities:", await client.lrange("feed:user:1", 0, -1));
  console.log("Feed length:", await client.llen("feed:user:1"));

  // --- PATTERN D: Reliable Queue (LMOVE) ---
  console.log("\n--- Reliable Queue (LMOVE for safe processing) ---");
  await client.del("queue:pending", "queue:processing");

  await client.rpush("queue:pending", "msg:1", "msg:2", "msg:3");
  console.log("Pending:", await client.lrange("queue:pending", 0, -1));

  // Move to processing queue (atomically)
  const processing = await client.lmove("queue:pending", "queue:processing", "LEFT", "RIGHT");
  console.log("Now processing:", processing);
  console.log("Pending:", await client.lrange("queue:pending", 0, -1));
  console.log("Processing:", await client.lrange("queue:processing", 0, -1));

  // After successful processing, remove from processing queue
  await client.lrem("queue:processing", 1, processing);
  console.log("After completion:", await client.lrange("queue:processing", 0, -1));

  // =========================================================================
  // 5. SETS - Unordered unique collections
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("5. SETS");
  console.log("=".repeat(60));

  await client.del("tags:post:1", "tags:post:2");

  // SADD - Add members
  await client.sadd("tags:post:1", "redis", "database", "nosql", "tutorial");
  await client.sadd("tags:post:2", "redis", "caching", "performance");
  console.log("TYPE tags:post:1 =>", await client.type("tags:post:1"));
  console.log("tags:post:1 =>", await client.smembers("tags:post:1"));
  console.log("tags:post:2 =>", await client.smembers("tags:post:2"));

  // SISMEMBER - Check membership
  console.log("Is 'redis' in post:1?", await client.sismember("tags:post:1", "redis"));
  console.log("Is 'python' in post:1?", await client.sismember("tags:post:1", "python"));

  // SCARD - Set cardinality
  console.log("SCARD tags:post:1 =>", await client.scard("tags:post:1"));

  // SINTER - Intersection
  console.log("Common tags:", await client.sinter("tags:post:1", "tags:post:2"));

  // SUNION - Union
  console.log("All tags:", await client.sunion("tags:post:1", "tags:post:2"));

  // SDIFF - Difference
  console.log("Only in post:1:", await client.sdiff("tags:post:1", "tags:post:2"));

  // SRANDMEMBER & SPOP
  console.log("Random tag:", await client.srandmember("tags:post:1"));
  const removed = await client.spop("tags:post:1");
  console.log("SPOP removed:", removed);

  // =========================================================================
  // 6. SORTED SETS - Ordered by score (leaderboards)
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("6. SORTED SETS (Leaderboards)");
  console.log("=".repeat(60));

  await client.del("leaderboard:game");

  // ZADD - Add members with scores
  await client.zadd("leaderboard:game",
    100, "player:ali",
    250, "player:usama",
    180, "player:sara",
    320, "player:ahmed",
    95, "player:fatima"
  );
  console.log("TYPE leaderboard:game =>", await client.type("leaderboard:game"));

  // ZRANGE - Get by rank (low to high)
  console.log("Bottom 3:", await client.zrange("leaderboard:game", 0, 2));

  // ZREVRANGE - Get by rank (high to low) with scores
  console.log("Top 3 with scores:", await client.zrevrange("leaderboard:game", 0, 2, "WITHSCORES"));

  // ZSCORE - Get score of member
  console.log("Usama's score:", await client.zscore("leaderboard:game", "player:usama"));

  // ZRANK & ZREVRANK
  console.log("Usama's rank (0=lowest):", await client.zrank("leaderboard:game", "player:usama"));
  console.log("Usama's rank (0=highest):", await client.zrevrank("leaderboard:game", "player:usama"));

  // ZINCRBY - Increment score
  await client.zincrby("leaderboard:game", 100, "player:usama");
  console.log("After ZINCRBY +100 for usama:");
  console.log("New top 3:", await client.zrevrange("leaderboard:game", 0, 2, "WITHSCORES"));

  // ZRANGEBYSCORE - Get by score range
  console.log("Players with 100-200 points:", await client.zrangebyscore("leaderboard:game", 100, 200));

  // ZCOUNT - Count in score range
  console.log("Count 100-200:", await client.zcount("leaderboard:game", 100, 200));

  // ZCARD - Total members
  console.log("Total players:", await client.zcard("leaderboard:game"));

  // =========================================================================
  // 7. SCAN - Iterate keys safely (production-friendly)
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("7. SCAN - Safe Key Iteration");
  console.log("=".repeat(60));

  // Scan for all keys starting with "leaderboard:"
  let cursor = "0";
  const matches = [];
  do {
    const [nextCursor, keys] = await client.scan(cursor, "MATCH", "leaderboard:*", "COUNT", 100);
    cursor = nextCursor;
    matches.push(...keys);
  } while (cursor !== "0");
  console.log("Keys matching 'leaderboard:*':", matches);

  // Scan for all keys (sample)
  cursor = "0";
  const sample = [];
  const [nextCursor, keys] = await client.scan(cursor, "COUNT", 20);
  sample.push(...keys);
  console.log("Sample of 20 keys:", sample);

  // =========================================================================
  // 8. KEY MANAGEMENT
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("8. KEY MANAGEMENT");
  console.log("=".repeat(60));

  // EXISTS
  console.log("EXISTS user:1:name =>", await client.exists("user:1:name"));
  console.log("EXISTS nonexistent =>", await client.exists("nonexistent"));

  // RENAME
  await client.set("temp:key", "value");
  await client.rename("temp:key", "new:key");
  console.log("After RENAME:", await client.get("new:key"));

  // EXPIRE & PERSIST
  await client.expire("new:key", 60);
  console.log("TTL new:key =>", await client.ttl("new:key"));
  await client.persist("new:key");
  console.log("TTL after PERSIST =>", await client.ttl("new:key"));

  // DEL multiple
  const delCount = await client.del("new:key", "greeting", "session:abc123");
  console.log("DEL 3 keys =>", delCount, "deleted");

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log("DBSIZE (after):", await client.dbsize());

  await client.quit();
  console.log("\nRedis connection closed.");
}

init().catch(async (err) => {
  console.error(err);
  try {
    await client.quit();
  } catch {}
});