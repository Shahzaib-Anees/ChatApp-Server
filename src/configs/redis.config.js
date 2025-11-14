import Redis from "ioredis";

// Build a proper connection URL
const REDIS_URL =
  process.env.REDIS_URL ||
  `redis://:${process.env.REDIS_PASSWORD || ""}@${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`;

// Main client
const redis = new Redis(REDIS_URL);

// Publisher / Subscriber
const pubClient = new Redis(REDIS_URL);
const subClient = pubClient.duplicate();

export { redis, pubClient, subClient };
