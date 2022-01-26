const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Review = new Schema(
  {
    course_id: {
      type: ObjectId,
      ref: 'courses',
      required: true,
    },
    trainee_id: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('reviews', Review);
