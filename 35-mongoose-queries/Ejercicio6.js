const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({}, { strict: false });
const Grade = mongoose.model('Grade', gradeSchema, 'grades');

async function gradesByClass() {
  try {
    const result = await Grade.aggregate([
      { $unwind: '$scores' },
      {
        $group: {
          _id: '$class_id',
          averageScore: { $avg: '$scores.score' },
          maxScore: { $max: '$scores.score' },
          minScore: { $min: '$scores.score' },
          totalStudents: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).exec();
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function gradesByClassAndType() {
  try {
    const result = await Grade.aggregate([
      { $unwind: '$scores' },
      {
        $group: {
          _id: {
            class_id: '$class_id',
            type: '$scores.type'
          },
          average: { $avg: '$scores.score' },
          maximum: { $max: '$scores.score' },
          minimum: { $min: '$scores.score' }
        }
      },
      { $sort: { '_id.class_id': 1, '_id.type': 1 } }
    ]).exec();
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { gradesByClass, gradesByClassAndType };
