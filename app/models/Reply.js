const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Reply = new Schema(
  {
    user_id: { type: ObjectId, ref: 'users' },
    comment_id: { type: ObjectId, ref: 'comments' },
    course_id: { type: ObjectId, ref: 'courses' },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('replies', Reply);
