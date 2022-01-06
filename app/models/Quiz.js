const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Quiz = new Schema(
  {
    video_id: { type: String, ref: 'videos' },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('quizzes', Quiz);
