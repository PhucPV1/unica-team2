const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Video = new Schema(
  {
    title: { type: String, require: true },
    course_id: { type: ObjectId, ref: 'courses' },
    URL: { type: String, require: true },
    order_id: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('videos', Video);
