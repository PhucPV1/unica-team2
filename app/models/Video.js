const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Video = new Schema(
  {
    chapter_id: { type: ObjectId, ref: 'chapters' },
    title: { type: String, require: true },
    URL: { type: String, require: true },
    disable: { type: Boolean},
    course_id: { type: ObjectId, ref: 'courses'},
    index: { type: Number},
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('videos', Video);