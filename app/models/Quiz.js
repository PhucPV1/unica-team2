const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Quiz = new Schema(
  {
    course_id: { type: ObjectId, ref: 'courses' },
    title: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('quizzes', Quiz);
