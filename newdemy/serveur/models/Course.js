const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  couponCode: { type: String, required: true },
  imageUrl: { type: String },
  instructor: { type: String },
  rating: { type: Number },
  enrollmentCount: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Course', courseSchema);