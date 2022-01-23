const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Trainee_course = new Schema(
  {
    trainee_id: { type: ObjectId, ref: 'users' },
    course_id: { type: ObjectId, ref: 'courses' },
    status: { type: Number },
    index: { type: Number,default: 0 },
    quiz: { type: Number },
    
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('trainee_courses', Trainee_course);
