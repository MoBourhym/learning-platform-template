const { ObjectId } = require('mongodb');
const db = require('../config/db');

async function findOneById(collection, id) {
  try {
    const _id = new ObjectId(id);
    return await db.getDb().collection(collection).findOne({ _id });
  } catch (error) {
    console.error(`FindOneById error in ${collection}:`, error);
    throw error;
  }
}

async function insertOne(collection, data) {
  try {
    const result = await db.getDb().collection(collection).insertOne(data);
    return { ...data, _id: result.insertedId };
  } catch (error) {
    console.error(`InsertOne error in ${collection}:`, error);
    throw error;
  }
}

async function aggregate(collection, pipeline) {
  try {
    return await db.getDb()
      .collection(collection)
      .aggregate(pipeline)
      .toArray();
  } catch (error) {
    console.error(`Aggregate error in ${collection}:`, error);
    throw error;
  }
}

module.exports = {
  findOneById,
  insertOne,
  aggregate
};