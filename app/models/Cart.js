const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema(
  {
    trainee_id: { type: String, ref: 'users' },
    course_id: { type: String, ref: 'courses' },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('carts', Cart);
