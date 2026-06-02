import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.log("Redis Error", err);
});

await redis.connect();

export default redis;