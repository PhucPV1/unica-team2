const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Result = new Schema(
  {
    trainee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'videos', require: true },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'videos', require: true },
    description: { type: String },
    score: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('results', Result);
