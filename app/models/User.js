const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    role_id: {
      type: Number,
      // required: true,
    },
    courses: {
      type: [{ type: String, ref: 'courses' }],
      // default: ["61ceea6b2410f51f1abb0429"],
    },
    cart: {
      type: [{ type: ObjectId, ref: 'courses' }],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('users', User);
