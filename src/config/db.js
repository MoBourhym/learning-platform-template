const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

 let mongoClient, redisClient, db;

async function connectMongo() {
  try {
    mongoClient = await MongoClient.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry logic could be implemented here
    throw error;
  }
}

async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: config.redis.uri,
      retry_strategy: function(options) {
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    await redisClient.connect();
    console.log('Connected to Redis');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

function getRedis() {
  if (!redisClient) {
    throw new Error('Redis not initialized');
  }
  return redisClient;
}

module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getDb,
  getRedis
};

connectMongo();
connectRedis();

console.log(process.env.MONGODB_URI);