const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Course = new Schema(
  {
    name: { type: String },
    trainer_id: { type: ObjectId, ref: 'users' },
    category_id: { type: ObjectId, ref: 'category' },
    description: { type: String },
    review_count: { type: Number },
    previous_price: { type: Number },
    present_price: { type: Number },
    img_src: { type: String },
    review_count: { type: Number, default: 00 },
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('courses', Course);
