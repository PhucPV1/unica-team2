const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Question = new Schema(
  {
    quizzes_id: { type: ObjectId, ref: 'courses' },
    title: { type: String },
    answer: { type: Array },
    correct: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('question_quizzes', Question);
