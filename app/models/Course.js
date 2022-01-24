const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Course = new Schema(
  {
    name: { type: String, required: true },
    trainer_id: { type: ObjectId, ref: 'users', required: true },
    category_id: { type: ObjectId, ref: 'categories', required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    review_count: { type: Number, default: 00 },
    previous_price: { type: Number, required: true },
    present_price: { type: Number, required: true },
    img_src: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('courses', Course);
