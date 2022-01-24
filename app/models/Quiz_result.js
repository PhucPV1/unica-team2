const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuizResult = new Schema(
  {
    trainee_course_id: { type: ObjectId, ref: 'trainee_courses' },
    quiz_id: { type: ObjectId, ref: 'quizzes' },
    point: { type: Number }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('quiz_results', QuizResult);