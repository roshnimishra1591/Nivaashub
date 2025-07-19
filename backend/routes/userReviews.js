import express from 'express';
import OwnerReview from '../models/OwnerReview.js';
import Review from '../models/Review.js';

const router = express.Router();

// GET all property reviews given by a user
router.get('/:userId/property-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewerId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch property reviews given by user', error: err.message });
  }
});

// GET all owner reviews given by a user
router.get('/:userId/owner-reviews', async (req, res) => {
  try {
    const reviews = await OwnerReview.find({ reviewerId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owner reviews given by user', error: err.message });
  }
});

export default router;
