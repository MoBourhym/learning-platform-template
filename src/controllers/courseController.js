const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const courseData = req.body;
    
    // Validation
    if (!courseData.title || !courseData.description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    const course = await mongoService.insertOne('courses', {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Invalidate related cache
    await redisService.deleteByPattern('courses:*');

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;
    
    // Try cache first
    const cached = await redisService.get(`courses:${id}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const course = await mongoService.findOneById('courses', id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Cache the result
    await redisService.set(
      `courses:${id}`, 
      JSON.stringify(course), 
      60 * 15 // 15 minutes TTL
    );

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to retrieve course' });
  }
}

async function getCourseStats(req, res) {
  try {
    const stats = await mongoService.aggregate('courses', [
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    res.json(stats[0] || { totalCourses: 0, averageRating: 0 });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}

module.exports = {
  createCourse,
  getCourse,
  getCourseStats
};