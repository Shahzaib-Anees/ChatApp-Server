import { redis } from "../configs/redis.config.js";
const ONLINE_SET = "online_users";
async function markOnline(userId) {
  const key = `online_count:${userId}`;
  const count = await redis.incr(key);
  await redis.expire(key, 60 * 60); // auto-clean if something leaks (1h)
  await redis.sadd(ONLINE_SET, String(userId));
  return count;
}

async function markOffline(userId) {
  const key = `online_count:${userId}`;
  const count = await redis.decr(key);
  if (count <= 0) {
    await redis.del(key);
    await redis.srem(ONLINE_SET, String(userId));
  }
  return count;
}

async function isOnline(userId) {
  return Boolean(await redis.sismember(ONLINE_SET, String(userId)));
}

export { markOnline, markOffline, isOnline };
