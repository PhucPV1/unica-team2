const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Transaction = new Schema({
  payment_method: { type: String, require: true },
  transaction_id: { type: String, require: true },
  status: { type: String, require: true },
  amount: { type: Number, require: true },
  trainee_id: {
    type: ObjectId,
    ref: 'users',
    require: true,
  },
  trainee_email: { type: String, require: true },
  courses: {
    type: [{ type: ObjectId, ref: 'courses' }],
    require: true,
  },
  create_time: { type: String, require: true },
  update_time: { type: String, require: true },
});
module.exports = mongoose.model('transactions', Transaction);
