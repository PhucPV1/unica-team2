const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Trainee_course = new Schema(
  {
    trainee_id: { type: ObjectId, ref: 'users', required: true },
    course_id: { type: ObjectId, ref: 'courses', required: true },
    status: { type: Number, required: true, default: 0 },
    index: { type: Number, default: 1 },
    quiz: { type: Number },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('trainee_courses', Trainee_course);
