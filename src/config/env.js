const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

function validateEnv() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }

  // Validate URI formats
  const mongoRegex = /^mongodb(\+srv)?:\/\/.+/;
  const redisRegex = /^redis:\/\/.+/;

  if (!mongoRegex.test(process.env.MONGODB_URI)) {
    throw new Error('Invalid MONGODB_URI format');
  }

  if (!redisRegex.test(process.env.REDIS_URI)) {
    throw new Error('Invalid REDIS_URI format');
  }
}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development'
};