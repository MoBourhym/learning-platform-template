const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createStudent(req, res) {
  try {
    const studentData = req.body;
    
    // Validation
    if (!studentData.firstName || !studentData.lastName || !studentData.email) {
      return res.status(400).json({ 
        error: 'First name, last name and email are required' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingStudent = await mongoService.findOne('students', {
      email: studentData.email
    });

    if (existingStudent) {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }

    const student = await mongoService.insertOne('students', {
      ...studentData,
      enrolledCourses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Invalider le cache
    await redisService.deleteByPattern('students:*');

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
}

async function getStudent(req, res) {
  try {
    const { id } = req.params;
    
    // Vérifier le cache d'abord
    const cached = await redisService.get(`students:${id}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const student = await mongoService.findOneById('students', id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Mettre en cache
    await redisService.set(
      `students:${id}`, 
      JSON.stringify(student), 
      60 * 15 // 15 minutes TTL
    );

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to retrieve student' });
  }
}

async function enrollInCourse(req, res) {
  try {
    const { studentId, courseId } = req.params;

    // Vérifier si le cours existe
    const course = await mongoService.findOneById('courses', courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Mettre à jour l'inscription
    const result = await mongoService.updateOne(
      'students',
      { _id: new ObjectId(studentId) },
      { 
        $addToSet: { enrolledCourses: new ObjectId(courseId) },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Invalider le cache
    await redisService.deleteByPattern(`students:${studentId}`);

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
}

async function getEnrolledCourses(req, res) {
  try {
    const { id } = req.params;

    const student = await mongoService.aggregate('students', [
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      { $project: { courseDetails: 1 } }
    ]);

    if (!student[0]) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student[0].courseDetails);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Failed to retrieve enrolled courses' });
  }
}

module.exports = {
  createStudent,
  getStudent,
  enrollInCourse,
  getEnrolledCourses
};