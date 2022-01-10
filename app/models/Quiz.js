const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Quiz = new Schema(
  {
    video_id: { type: ObjectId, ref: 'videos' },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('quizzes', Quiz);
