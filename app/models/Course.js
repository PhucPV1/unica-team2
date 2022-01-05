const mongoose = require("mongoose")
const Schema = mongoose.Schema
const slug = require("mongoose-slug-generator")

mongoose.plugin(slug)

const Course = new Schema(
  {
    title: { type: String },
    teacher: { type: String },
    review_count: { type: Number },
    previous_price: { type: Number },
    present_price: { type: Number },
    img_src: { type: String },
    review_count: { type: Number, default: 00 },
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  },
)
module.exports = mongoose.model("courses", Course)
