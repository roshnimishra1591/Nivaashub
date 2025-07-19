import express from 'express';
import mongoose from 'mongoose';

// --- Review Schema ---
const reviewSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  reviewerName: { type: String, default: 'Anonymous User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const router = express.Router();

// GET all reviews for a property
router.get('/property/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.id }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

// POST a new review for a property
router.post('/property/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    // Optionally, get reviewerName from auth/user context
    const reviewerName = req.user?.name || 'Anonymous User';
    const review = new Review({
      propertyId: req.params.id,
      reviewerName,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Failed to submit review', error: err.message });
  }
});

// GET all reviews for all properties
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all reviews', error: err.message });
  }
});

export default router;
