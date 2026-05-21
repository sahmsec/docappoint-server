const express = require('express');
const router = express.Router();
const authSession = require('../middleware/authSession');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// GET all reviews for a doctor (public)
router.get('/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create a review (protected - must have booked with the doctor)
router.post('/', authSession, async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    if (!doctorId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Verify user has at least one appointment with this doctor
    const hasBooking = await Appointment.findOne({
      userEmail: req.user.email,
      doctorId: doctorId
    });

    if (!hasBooking) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only review doctors you have booked an appointment with' 
      });
    }

    // Check if user already reviewed this doctor
    const existingReview = await Review.findOne({
      userId: req.user._id,
      doctorId: doctorId
    });

    if (existingReview) {
      return res.status(409).json({ 
        success: false, 
        message: 'You have already reviewed this doctor' 
      });
    }

    const review = await Review.create({
      userEmail: req.user.email,
      userId: req.user._id,
      userName: req.user.name,
      doctorId,
      rating: Number(rating),
      comment
    });

    res.status(201).json({ success: true, message: 'Review added successfully!', data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this doctor' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE a review (protected - own review only)
router.delete('/:id', authSession, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    res.json({ success: true, message: 'Review deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
