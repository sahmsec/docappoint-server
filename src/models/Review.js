const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });

// One review per user per doctor
reviewSchema.index({ userId: 1, doctorId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
