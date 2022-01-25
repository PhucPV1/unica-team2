const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Chapter = new Schema(
  {
    course_id: { type: ObjectId, ref: 'courses' },
    title: { type: String },
    index: { type: Number },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('chapters', Chapter);
