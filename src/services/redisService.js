const db = require('../config/db');

async function set(key, data, ttl = 3600) {
  try {
    const redis = db.getRedis();
    await redis.set(key, data, 'EX', ttl);
  } catch (error) {
    console.error('Redis set error:', error);
    // Don't throw - treat cache errors as non-fatal
  }
}

async function get(key) {
  try {
    const redis = db.getRedis();
    return await redis.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function deleteByPattern(pattern) {
  try {
    const redis = db.getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Redis delete pattern error:', error);
  }
}

module.exports = {
  set,
  get,
  deleteByPattern
};