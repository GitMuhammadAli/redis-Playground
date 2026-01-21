const client = require("./redisClient");

async function init() {
  console.log("DBSIZE:", await client.dbsize());

  await client.set("bike:1", "Trek Domane SL 7");
  await client.hset("bike:2", "brand", "Specialized", "model", "Roubaix");
  await client.lpush("bike:3", "Giant Defy", "Cannondale Synapse");


  await client.get("bike:1");  await client.hgetall("bike:2");
  await client.lrange("bike:3", 0, -1);
  // Scan for keys containing 'bicycle'
  let cursor = "0";
  const matches = [];
  do {
    const [nextCursor, keys] = await client.scan(
      cursor,
      "MATCH",
      "*bicycle*",
      "COUNT",
      100
    );
    cursor = nextCursor;
    matches.push(...keys);
  } while (cursor !== "0" && matches.length < 50);

  console.log("BICYCLE KEYS (first 50):", matches);

  if (matches.length === 0) {
    console.log(
      "No keys matched '*bicycle*'. Let's print a sample of keys instead."
    );

    cursor = "0";
    const sample = [];
    do {
      const [nextCursor, keys] = await client.scan(cursor, "COUNT", 50);
      cursor = nextCursor;
      sample.push(...keys);
    } while (cursor !== "0" && sample.length < 50);

    console.log("SAMPLE KEYS (first 50):", sample);
    client.disconnect();
    return;
  }

  // Pick the first matching key and inspect it
  const key = matches[0];
  const type = await client.type(key);
  console.log("USING KEY:", key);
  console.log("TYPE:", type);

  if (type === "string") {
    console.log(await client.get(key));
  } else if (type === "hash") {
    console.log(await client.hgetall(key));
  } else if (type === "list") {
    console.log(await client.lrange(key, 0, 50));
  } else if (type === "set") {
    console.log(await client.smembers(key));
  } else if (type === "zset") {
    console.log(await client.zrange(key, 0, 50, "WITHSCORES"));
  } else {
    console.log(`Key type "${type}" detected. Use the matching Redis command.`);
  }

  client.disconnect();
}

init().catch((e) => {
  console.error(e);
  client.disconnect();
});
