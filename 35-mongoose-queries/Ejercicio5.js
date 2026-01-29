const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({}, { strict: false });
const Grade = mongoose.model('Grade', gradeSchema, 'grades');

async function gradesByStudentAndType() {
  try {
    const result = await Grade.aggregate([
      { $unwind: '$scores' },
      {
        $group: {
          _id: {
            student_id: '$student_id',
            type: '$scores.type'
          },
          average: { $avg: '$scores.score' },
          maximum: { $max: '$scores.score' },
          minimum: { $min: '$scores.score' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.student_id': 1, '_id.type': 1 } }
    ]).exec();
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { gradesByStudentAndType };
