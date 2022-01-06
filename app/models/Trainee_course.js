const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trainee_course = new Schema(
  {
    trainee_id: { type: String, ref: 'users' },
    course_id: { type: String, ref: 'courses' },
    status: { type: Number },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('trainee_courses', Trainee_course);
