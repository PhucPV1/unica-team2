const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Result = new Schema(
  {
    trainee_course_id: {
      type: ObjectId,
      ref: 'trainee_courses',
      require: true,
    },
    quiz_id: {
      type: ObjectId,
      ref: 'quizzes',
      require: true,
    },
    description: { type: String },
    score: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('results', Result);
