const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Comment = new Schema(
  {
    user_id: { type: ObjectId, ref: 'users' },
    comment: { type: String },
    course_id: { type: ObjectId, ref: 'courses' },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('comments', Comment);
