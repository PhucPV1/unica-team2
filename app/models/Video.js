const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Video = new Schema(
  {
    lecture_id: { type: ObjectId, ref: 'lecture' },
    title: { type: String, require: true },
    URL: { type: String, require: true },
    disable: { type: Boolean},
    next: { type: ObjectId},
    course_id: { type: ObjectId},
    index: { type: Number},
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('videos', Video);
